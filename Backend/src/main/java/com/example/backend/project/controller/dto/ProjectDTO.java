package com.example.backend.project.controller.dto;

import com.example.backend.project.model.Project;
import com.example.backend.project.model.enums.TYPE;
import com.example.backend.user.model.AppUser;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@Getter @Setter
public class ProjectDTO {
    private Long idCreator;
    private String name;
    private String category;
    private TYPE type;
    private Date startDate;
    private Date endDate;
    private Long IdFRResp;
    private Long FRgoal;
    private Date firstPingDate;
    private Date secondPingDate;

    public Project toProject(){
        return new Project(
                idCreator,
                name,
                category,
                type,
                startDate,
                endDate,
                null,
                new HashSet<>(),
                FRgoal,
                firstPingDate,
                secondPingDate
        );
    }
}
