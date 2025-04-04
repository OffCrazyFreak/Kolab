package com.example.backend.companies.repo;

import com.example.backend.companies.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long>
{
    List<Contact> findAll();

    List<Contact> deleteContactById(Long id);
}