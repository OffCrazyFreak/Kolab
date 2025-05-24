package kolab.domain;

import jakarta.persistence.*;
import javax.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "industry")
@Getter
@Setter
public class Industry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Industry name is required")
    @Size(min = 2, max = 100, message = "Industry name must be between 2 and 100 characters")
    @Column(nullable = false, unique = true)
    private String name;
}