package kolab.dao;

import kolab.domain.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findByCompanyId(UUID companyId);
    boolean existsByEmail(String email);
}