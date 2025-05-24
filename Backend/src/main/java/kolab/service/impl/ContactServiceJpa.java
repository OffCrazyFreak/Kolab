package kolab.service.impl;

import kolab.dao.ContactRepository;
import kolab.domain.Contact;
import kolab.service.ContactService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.List;
import java.util.UUID;

@Service
public class ContactServiceJpa implements ContactService {
    @Autowired
    private ContactRepository contactRepo;

    @Override
    public List<Contact> getCompanyContacts() {
        return contactRepo.findAll();
    }

    @Override
    public Contact getCompanyContactById(UUID id) {
        return contactRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Company contact with id " + id + " not found"));
    }

    @Override
    public List<Contact> getContactsByCompanyId(UUID companyId) {
        return contactRepo.findByCompanyId(companyId);
    }

    @Override
    public Contact createCompanyContact(Contact contact) {
        Assert.notNull(contact, "Contact object must be given");
        if (contactRepo.existsByEmail(contact.getEmail())) {
            throw new IllegalArgumentException("Contact with email " + contact.getEmail() + " already exists");
        }
        validateContact(contact);
        return contactRepo.save(contact);
    }

    @Override
    public Contact updateCompanyContact(UUID id, Contact updatedContact) {
        Contact contact = getCompanyContactById(id);
        validateContact(updatedContact);

        if (!contact.getEmail().equals(updatedContact.getEmail()) && 
            contactRepo.existsByEmail(updatedContact.getEmail())) {
            throw new IllegalArgumentException("Contact with email " + updatedContact.getEmail() + " already exists");
        }

        contact.setCompany(updatedContact.getCompany());
        contact.setFirstName(updatedContact.getFirstName());
        contact.setLastName(updatedContact.getLastName());
        contact.setPosition(updatedContact.getPosition());
        contact.setEmail(updatedContact.getEmail());
        contact.setPhone(updatedContact.getPhone());

        return contactRepo.save(contact);
    }

    @Override
    public void deleteCompanyContact(UUID id) {
        if (contactRepo.existsById(id)) {
            contactRepo.deleteById(id);
        } else {
            throw new NotFoundException("Company contact with id " + id + " not found");
        }
    }

    private void validateContact(Contact contact) {
        if (contact.getFirstName() == null || contact.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (contact.getLastName() == null || contact.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (contact.getPosition() == null || contact.getPosition().trim().isEmpty()) {
            throw new IllegalArgumentException("Position is required");
        }
        if (contact.getEmail() == null || contact.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (contact.getCompany() == null) {
            throw new IllegalArgumentException("Company is required");
        }
    }
}