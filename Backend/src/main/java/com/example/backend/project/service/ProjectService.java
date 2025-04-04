package com.example.backend.project.service;

import com.example.backend.collaborations.model.Collaboration;
import com.example.backend.collaborations.repo.CollaborationsRepository;
import com.example.backend.project.controller.dpo.FRTeamMemberDPO;
import com.example.backend.project.controller.dpo.ProjectAndFRTeamMembersDPO;
import com.example.backend.project.controller.dto.ProjectDTO;
import com.example.backend.project.model.Project;
import com.example.backend.project.repo.ProjectRepository;
import com.example.backend.user.model.AUTHORITY;
import com.example.backend.user.model.AppUser;
import com.example.backend.user.repo.UserRepository;
import com.example.backend.util.exceptions.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.util.Helper;

import javax.naming.AuthenticationException;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service @Transactional
@AllArgsConstructor
public class ProjectService {
    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private CollaborationsRepository collaborationsRepository;

    public List<Project> findAll(AppUser user) throws AuthenticationException {
        if (user == null) throw new AuthenticationException();

        return projectRepository.findAll();
    }

    public ProjectAndFRTeamMembersDPO findById(Long id, AppUser user) throws AuthenticationException, EntityNotFoundException {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");

        Project project;
        if (projectRepository.findById(id).isPresent()) project = projectRepository.findById(id).get();
        else throw new EntityNotFoundException("You do not have permission to execute this command.");
        Set<FRTeamMemberDPO> frTeamMemberDPOS = new HashSet<>();
        for (AppUser appUser: project.getFrteammembers()){
            FRTeamMemberDPO x = new FRTeamMemberDPO(
                appUser.getId(),
                appUser.getFirstName(),
                appUser.getLastName()
            );
            frTeamMemberDPOS.add(x);
        }
        return new ProjectAndFRTeamMembersDPO(project, frTeamMemberDPOS);
    }

    public Project addProject(ProjectDTO projectDTO, AppUser user) throws EntityNotFoundException, AuthenticationException {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");
        if (!List.of(AUTHORITY.ADMINISTRATOR, AUTHORITY.MODERATOR).contains(user.getAuthority())) throw new AuthenticationException();

        AppUser frResp;
        if (userRepository.findById(projectDTO.getIdFRResp()).isPresent()) frResp = userRepository.findById(projectDTO.getIdFRResp()).get();
        else throw new EntityNotFoundException();

        if (frResp.getAuthority() == AUTHORITY.OBSERVER || frResp.getAuthority() == AUTHORITY.FR_TEAM_MEMBER){
            frResp.setAuthority(AUTHORITY.FR_RESPONSIBLE);
            userRepository.save(frResp);
        }
        Project project = projectDTO.toProject();
        project.setFRResp(frResp);
        project.addFrTeamMember(user);
        return projectRepository.save(project);
    }

    public Project updateProject(ProjectDTO projectDTO, Long id, AppUser user) throws AuthenticationException, EntityNotFoundException {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.ADMINISTRATOR, AUTHORITY.MODERATOR));

        Project project = Helper.getValue(projectRepository.findById(id), "Project under id " + id + " not found.");
        Helper.checkSoftLocked(project);

        project.setIdCreator(projectDTO.getIdCreator());
        project.setName(projectDTO.getName());
        project.setCategory(projectDTO.getCategory());
        project.setType(projectDTO.getType());
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        if (userRepository.findById(projectDTO.getIdFRResp()).isPresent()) project.setFRResp(userRepository.findById(projectDTO.getIdFRResp()).get());
        else throw new EntityNotFoundException();
        project.setFRGoal(projectDTO.getFRgoal());
        project.setFirstPingDate(projectDTO.getFirstPingDate());
        project.setSecondPingDate(projectDTO.getSecondPingDate());

        return projectRepository.save(project);
    }

    public List<Collaboration> getCollaborations(Long id, AppUser user) throws AuthenticationException, EntityNotFoundException {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");

        AUTHORITY authority = user.getAuthority();
        Project project;
        if (projectRepository.findById(id).isPresent()) project = projectRepository.findById(id).get();
        else throw new EntityNotFoundException("Project under id " + id + " not found.");

        if (authority == AUTHORITY.OBSERVER ||
                (authority == AUTHORITY.FR_TEAM_MEMBER && !project.getFrteammembers().contains(user)) ||
                (authority == AUTHORITY.FR_RESPONSIBLE && !Objects.equals(project.getFRResp().getId(), user.getId())))
            throw new AuthenticationException("You do not have permission to execute this command.");

        return collaborationsRepository.findAllByCollaborationId_Project(project);
    }

    public Project addFrTeamMember(Long projectId, Long teamMemberId, AppUser user) throws AuthenticationException, EntityNotFoundException {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");
        AUTHORITY authority = user.getAuthority();
        if (!List.of(AUTHORITY.ADMINISTRATOR, AUTHORITY.MODERATOR, AUTHORITY.FR_RESPONSIBLE).contains(authority))
            throw new AuthenticationException("You do not have permission to execute this command.");
        Project project;
        if (projectRepository.findById(projectId).isPresent()) project = projectRepository.findById(projectId).get();
        else throw new EntityNotFoundException("Project under id " + projectId + " not found.");
        AppUser newFRTeamMember;
        if (userRepository.findById(teamMemberId).isPresent()) newFRTeamMember = userRepository.findById(teamMemberId).get();
        else throw new EntityNotFoundException("User under id " + teamMemberId + " not found.");

        if (authority == AUTHORITY.FR_RESPONSIBLE && !Objects.equals(project.getFRResp().getId(), user.getId())) {
            throw new AuthenticationException("You do not have permission to execute this command.");
        }

        if (newFRTeamMember.getAuthority() == AUTHORITY.OBSERVER) {
            user.setAuthority(AUTHORITY.FR_TEAM_MEMBER);
            userRepository.save(user);
        }
        project.addFrTeamMember(user);

        return projectRepository.save(project);
    }

    public Boolean softLockProject(AppUser user, Long id) throws AuthenticationException, EntityNotFoundException
    {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.ADMINISTRATOR));

        if (List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.MODERATOR).contains(user.getAuthority())){
            if (!isResponsibleOrModeratorOnProject(user, id)){
                throw new AuthenticationException("You do not have permission to execute this command.");
            }
        }

        String errorMessage = "Project with id " + id + " does not exist";
        Project project = Helper.getValue(projectRepository.findById(id), errorMessage);
        boolean newSoftLocked = project.getSoftLocked() == null || !project.getSoftLocked();
        project.setSoftLocked(newSoftLocked);
        projectRepository.save(project);
        return newSoftLocked;
    }

    public Project deleteFrTeamMember(Long projectId, Long teamMemberId, AppUser user) throws AuthenticationException, EntityNotFoundException {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");

        Project project;
        if (projectRepository.findById(projectId).isPresent()) project = projectRepository.findById(projectId).get();
        else throw new EntityNotFoundException("Project under id " + projectId + " not found.");
        AppUser FRTeamMember;
        if (userRepository.findById(teamMemberId).isPresent()) FRTeamMember = userRepository.findById(teamMemberId).get();
        else throw new EntityNotFoundException("User under id " + teamMemberId + " not found.");

        project.removeFrTeamMember(FRTeamMember);
        if (FRTeamMember.getProjects().isEmpty() && FRTeamMember.getAuthority() == AUTHORITY.FR_TEAM_MEMBER){
            FRTeamMember.setAuthority(AUTHORITY.OBSERVER);
            userRepository.save(FRTeamMember);
        }
        return projectRepository.save(project);
    }

    public void deleteProject(Long id, AppUser user) throws AuthenticationException, EntityNotFoundException {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.ADMINISTRATOR, AUTHORITY.MODERATOR));

        Project project = Helper.getValue(projectRepository.findById(id), "Project under id " + id + " not found.");
        Helper.checkSoftLocked(project);

        projectRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return projectRepository.existsById(id);
    }

    private boolean isResponsibleOrModeratorOnProject(AppUser user, Long id) throws EntityNotFoundException
    {
        String errorMessage = "Project with id " + id + " does not exist";
        Project project = Helper.getValue(projectRepository.findById(id), errorMessage);
        return project.getIdCreator().equals(user.getId()) || project.getFRResp().getId().equals(user.getId());
    }
}
