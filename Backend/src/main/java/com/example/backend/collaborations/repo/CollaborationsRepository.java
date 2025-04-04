package com.example.backend.collaborations.repo;

import com.example.backend.collaborations.model.Collaboration;
import com.example.backend.collaborations.model.CollaborationId;
import com.example.backend.companies.model.Company;
import com.example.backend.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollaborationsRepository extends JpaRepository<Collaboration, CollaborationId> {

    List<Collaboration> findAllByCollaborationId_Company(Company company);

    List<Collaboration> findAllByCollaborationId_Project(Project project);
}
