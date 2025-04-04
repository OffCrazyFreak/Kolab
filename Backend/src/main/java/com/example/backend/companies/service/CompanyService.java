package com.example.backend.companies.service;

import com.example.backend.collaborations.model.Collaboration;
import com.example.backend.collaborations.service.CollaborationsService;
import com.example.backend.companies.controller.dto.CompanyDto;
import com.example.backend.companies.controller.dto.ContactDto;
import com.example.backend.companies.model.Company;
import com.example.backend.companies.model.Contact;
import com.example.backend.companies.repo.CompanyRepository;
import com.example.backend.companies.repo.ContactRepository;
import com.example.backend.project.model.Project;
import com.example.backend.user.model.AUTHORITY;
import com.example.backend.user.model.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.backend.util.Helper;

import javax.naming.AuthenticationException;
import com.example.backend.util.exceptions.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service @Transactional
@RequiredArgsConstructor
public class CompanyService
{
    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;
    private final CollaborationsService collaborationsService;

    public List<Company> getAllCompanies(AppUser user) throws AuthenticationException
    {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");
        return companyRepository.findAll();
    }

    public Boolean softLockCompany(AppUser user, Long id) throws AuthenticationException, EntityNotFoundException
    {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.ADMINISTRATOR));
        if (List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.FR_TEAM_MEMBER).contains(user.getAuthority())){
            if (!isFrTeamMemberOrResponsibleOnCompany(user, id)){
                throw new AuthenticationException("You do not have permission to execute this command.");
            }
        }

        String errorMessage = "Company with id " + id + " does not exist";
        Company company = Helper.getValue(companyRepository.findById(id), errorMessage);
        boolean newSoftLocked = company.getSoftLocked() == null || !company.getSoftLocked();
        company.setSoftLocked(newSoftLocked);
        companyRepository.save(company);
        return newSoftLocked;
    }

    public Company getCompany(AppUser user, Long id) throws AuthenticationException, EntityNotFoundException
    {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");
        if (List.of(AUTHORITY.OBSERVER).contains(user.getAuthority())){
            throw new AuthenticationException("You do not have permission to execute this command.");
        }
        if (List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.FR_TEAM_MEMBER).contains(user.getAuthority())){
            if (!isFrTeamMemberOrResponsibleOnCompany(user, id)){
                throw new AuthenticationException("You do not have permission to execute this command.");
            }
        }
        Optional<Company> company = companyRepository.findById(id);
        if (!company.isPresent()){
            throw new EntityNotFoundException("Company under id " + id + " not found.");
        }
        return company.get();
    }

    public Company createCompany(AppUser user, CompanyDto companyDto) throws AuthenticationException
    {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");
        if (!List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.MODERATOR, AUTHORITY.ADMINISTRATOR).contains(user.getAuthority())){
            throw new AuthenticationException();
        }
        return companyRepository.save(companyDto.toCompany());
    }

    public Company editCompany(AppUser user, Long companyId, CompanyDto companyDto) throws AuthenticationException, EntityNotFoundException
    {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.MODERATOR, AUTHORITY.ADMINISTRATOR));

        Company company = Helper.getValue(companyRepository.findById(companyId), "Company under id " + companyId + " not found.");
        Helper.checkSoftLocked(company);

        company.updateWith(companyDto);
        companyRepository.save(company);
        return company;
    }

    public void deleteCompany(AppUser user, Long companyId) throws AuthenticationException, EntityNotFoundException
    {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.OBSERVER, AUTHORITY.FR_TEAM_MEMBER));

        Company company = Helper.getValue(companyRepository.findById(companyId), "Company under id " + companyId + " not found.");
        Helper.checkSoftLocked(company);
        companyRepository.deleteCompanyById(companyId);
    }

    public Contact addContactToCompany(AppUser user, Long companyId, ContactDto contactDto) throws AuthenticationException, EntityNotFoundException
    {
        if (user == null) throw new AuthenticationException("You do not have permission to access Kolab.");
        if (List.of(AUTHORITY.OBSERVER).contains(user.getAuthority())){
            throw new AuthenticationException("You do not have permission to execute this command.");
        }
        if (List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.FR_TEAM_MEMBER).contains(user.getAuthority())){
            if (!isFrTeamMemberOrResponsibleOnCompany(user, companyId)){
                throw new AuthenticationException("You do not have permission to execute this command.");
            }
        }

        Optional<Company> optionalCompany = companyRepository.findById(companyId);
        if (optionalCompany.isEmpty()){
            throw new EntityNotFoundException("Company under id " + companyId + " not found.");
        }
        Company company = optionalCompany.get();
        Contact contact = contactDto.toContact();
        contact.setCompany(company);
        return contactRepository.save(contact);
    }

    public Contact editContact(AppUser user, Long companyId, Long contactId, ContactDto contactDto) throws AuthenticationException, EntityNotFoundException
    {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.OBSERVER));
        if (List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.FR_TEAM_MEMBER).contains(user.getAuthority())){
            if (!isFrTeamMemberOrResponsibleOnCompany(user, companyId)){
                throw new AuthenticationException("You do not have permission to execute this command.");
            }
        }

        Company company = Helper.getValue(companyRepository.findById(companyId), "Company under id " + companyId + " not found.");
        Helper.checkSoftLocked(company);

        Contact contact = Helper.getValue(contactRepository.findById(contactId), "Contact under id " + contactId + " not found.");
        if (!contact.getCompany().getId().equals(companyId)){
            throw new EntityNotFoundException();
        }
        contact.updateWith(contactDto);
        return contactRepository.save(contact);
    }

    public void deleteContact(AppUser user, Long companyId, Long contactId) throws AuthenticationException, EntityNotFoundException
    {
        Helper.checkUserAuthorities(user, List.of(AUTHORITY.OBSERVER));
        if (List.of(AUTHORITY.FR_RESPONSIBLE, AUTHORITY.FR_TEAM_MEMBER).contains(user.getAuthority())){
            if (!isFrTeamMemberOrResponsibleOnCompany(user, companyId)){
                throw new AuthenticationException("You do not have permission to execute this command.");
            }
        }

        Company company = Helper.getValue(companyRepository.findById(companyId), "Company under id " + companyId + " not found.");
        Helper.checkSoftLocked(company);

        Contact contact = Helper.getValue(contactRepository.findById(contactId), "Contact under id " + contactId + " not found.");
        if (!contact.getCompany().getId().equals(companyId)){
            throw new EntityNotFoundException();
        }
        contactRepository.deleteContactById(contactId);
    }

    private boolean isFrTeamMemberOrResponsibleOnCompany(AppUser user, Long companyId) throws EntityNotFoundException{
        List<Collaboration> collaborations = collaborationsService.getCollaborationsForCompany(companyId);
        for(Collaboration collaboration : collaborations){
            Project project = collaboration.getCollaborationId().getProject();
            Set<AppUser> frTeamMembers = project.getFrteammembers();
            if (frTeamMembers.contains(user) || project.getFRResp().getId() == user.getId()){
                return true;
            }
        }
        return false;
    }

    public boolean existsById(Long companyid) {
        return companyRepository.existsById(companyid);
    }
}
