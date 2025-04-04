package com.example.backend.collaborations.model;

import com.example.backend.companies.model.Company;
import com.example.backend.project.model.Project;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Embeddable
public class CollaborationId implements Serializable {
    @ManyToOne
    @JoinColumn(nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Company company;

    public CollaborationId(Project project, Company company) {
        this.project = project;
        this.company = company;
    }

    public CollaborationId() {
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
