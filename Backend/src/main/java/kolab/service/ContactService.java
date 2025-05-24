package kolab.service;

import kolab.domain.Contact;
import java.util.List;
import java.util.UUID;

public interface ContactService {
    List<Contact> getCompanyContacts();
    Contact getCompanyContactById(UUID id);
    List<Contact> getContactsByCompanyId(UUID companyId);
    Contact createCompanyContact(Contact contact);
    Contact updateCompanyContact(UUID id, Contact contact);
    void deleteCompanyContact(UUID id);
}