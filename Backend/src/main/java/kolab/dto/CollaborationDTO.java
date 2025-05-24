package kolab.dto;

import kolab.domain.enums.CollaborationCategory;
import kolab.domain.enums.CollaborationStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CollaborationDTO {
    private UUID id;
    private UUID projectId;
    private UUID companyId;
    private UUID contactId;
    private UUID responsibleId;
    private CollaborationCategory category;
    private CollaborationStatus status;
    private String comment;
    private Double achievedValue;
}