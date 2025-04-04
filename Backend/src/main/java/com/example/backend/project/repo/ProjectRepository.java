package com.example.backend.project.repo;

import com.example.backend.companies.model.Company;
import com.example.backend.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
