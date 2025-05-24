package kolab.dto;

import kolab.domain.enums.CompanyCategorization;
import kolab.domain.enums.Month;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CompanyDTO {
    private UUID id;
    private UUID industryId;
    private String name;
    private CompanyCategorization categorization;
    private Month budgetPlanningMonth;
    private String country;
    private Long zip;
    private String city;
    private String address;
    private String webLink;
    private String description;
    private boolean contactInFuture;
}