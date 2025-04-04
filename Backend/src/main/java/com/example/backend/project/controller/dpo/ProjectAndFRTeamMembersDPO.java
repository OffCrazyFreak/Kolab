package com.example.backend.project.controller.dpo;

import com.example.backend.project.model.Project;
import com.example.backend.project.model.enums.TYPE;
import com.example.backend.user.model.AppUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.Set;

@AllArgsConstructor
@Getter @Setter
public class ProjectAndFRTeamMembersDPO {
    private Long id;
    private Long idCreator;
    private String name;
    private String category;
    private TYPE type;
    private Date startDate;
    private Date endDate;
    private AppUser FRResp;
    private Long FRGoal;
    private Date firstPingDate;
    private Date secondPingDate;
    private Set<FRTeamMemberDPO> frTeamMemberDPOS;

    public ProjectAndFRTeamMembersDPO(Project project, Set<FRTeamMemberDPO> frTeamMemberDPOS){
        this.id = project.getId();
        this.idCreator = project.getIdCreator();
        this.name = project.getName();
        this.category = project.getCategory();
        this.type = project.getType();
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.FRResp = project.getFRResp();
        this.FRGoal = project.getFRGoal();
        this.firstPingDate = project.getFirstPingDate();
        this.secondPingDate = project.getSecondPingDate();
        this.frTeamMemberDPOS = frTeamMemberDPOS;
    }
}
