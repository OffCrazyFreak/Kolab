package kolab.dao;

import kolab.domain.User;
import kolab.domain.enums.UserAuthorization;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.ContextConfiguration;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ContextConfiguration(classes = UserRepository.class)
@EntityScan(basePackages = "kolab.domain") // 👈 tells Spring where to find @Entity classes
@EnableJpaRepositories(basePackages = "kolab.dao") // 👈 tells Spring where to find repos
@ComponentScan(basePackages = "kolab.dao") // optional if needed
class UserRepositoryTest {

    @jakarta.annotation.Resource
    private UserRepository userRepository;

    private String randomEmail() {
        return "user_" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }

    private User createUser() {
        User user = new User();
        user.setName("Test");
        user.setSurname("User");
        user.setEmail(randomEmail());
        user.setAuthorization(UserAuthorization.USER);
        user.setNickname("nick_" + UUID.randomUUID().toString().substring(0, 4));
        return user;
    }

    @Test
    @DisplayName("Should find user by email")
    void testFindByEmail() {
        User user = createUser();
        userRepository.save(user);

        User found = userRepository.findByEmail(user.getEmail());

        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    @DisplayName("Should persist and retrieve user by ID")
    void testSaveAndFindById() {
        User user = createUser();
        User saved = userRepository.save(user);

        Optional<User> result = userRepository.findById(saved.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo(user.getName());
    }
}
