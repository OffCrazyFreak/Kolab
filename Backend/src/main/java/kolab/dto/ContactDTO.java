package kolab.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ContactDTO {
    private UUID id;
    private UUID companyId;
    private String firstName;
    private String lastName;
    private String position;
    private String email;
    private String phone;
}