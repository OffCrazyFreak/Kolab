package kolab.dao;

import kolab.domain.Company;
import kolab.domain.Industry;
import kolab.domain.enums.CompanyCategorization;
import kolab.domain.enums.Month;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class CompanyRepositoryTest {

    @Autowired CompanyRepository companyRepository;
    @Autowired IndustryRepository industryRepository;

    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    @Test
    void testSaveAndFindByName() {
        String industryName = randomString("Industry");
        String companyName = randomString("Company");

        Industry industry = new Industry();
        industry.setName(industryName);
        industry = industryRepository.save(industry);

        Company company = new Company();
        company.setName(companyName);
        company.setIndustry(industry);
        company.setCategorization(CompanyCategorization.A);
        company.setBudgetPlanningMonth(Month.JANUARY);
        company.setCity("City");
        company.setCountry("Country");
        company.setZip(10000L);

        companyRepository.save(company);

        Company found = companyRepository.findByName(companyName);

        assertNotNull(found);
        assertEquals(companyName, found.getName());
        assertEquals(industryName, found.getIndustry().getName());
    }
}
