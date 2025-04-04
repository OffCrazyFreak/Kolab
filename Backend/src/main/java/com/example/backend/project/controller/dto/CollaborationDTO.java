package com.example.backend.project.controller.dto;

import com.example.backend.collaborations.model.enums.Category;
import com.example.backend.collaborations.model.enums.Status;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CollaborationDTO {
    private Long companyId;
    private Long contactId;
    private Long contactResponsibleId;
    private boolean priority;
    private Category category;
    private Status status;
    private String comment;
    private Long achievedValue;
}
