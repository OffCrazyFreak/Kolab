package kolab.dto;

import kolab.domain.enums.ProjectType;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
public class ProjectDTO {
    private UUID id;
    private UUID categoryId;
    private String name;
    private ProjectType type;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Long goal;
    private UUID responsibleId;
}