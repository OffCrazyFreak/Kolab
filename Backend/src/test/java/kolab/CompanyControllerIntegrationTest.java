package kolab;

import com.fasterxml.jackson.databind.ObjectMapper;
import kolab.dao.CompanyRepository;
import kolab.dao.IndustryRepository;
import kolab.domain.Company;
import kolab.domain.Industry;
import kolab.domain.enums.CompanyCategorization;
import kolab.domain.enums.Month;
import kolab.dto.CompanyDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CompanyControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private IndustryRepository industryRepository;
    @Autowired private CompanyRepository companyRepository;

    private String random(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    @Test
    void testCreateAndFetchCompany() throws Exception {
        // Create and persist a valid Industry
        Industry industry = new Industry();
        industry.setName(random("Industry"));
        industry = industryRepository.save(industry);

        // Create a valid CompanyDTO
        CompanyDTO dto = new CompanyDTO();
        dto.setIndustryId(industry.getId());
        dto.setName(random("FinCorp"));
        dto.setCountry("Germany");
        dto.setZip(23456L);
        dto.setCity("Munich");
        dto.setCategorization(CompanyCategorization.A);
        dto.setBudgetPlanningMonth(Month.JANUARY);
        dto.setAddress("Street 1");
        dto.setWebLink("https://fincorp.com");
        dto.setDescription("Finance specialists");
        dto.setContactInFuture(true);

        // Serialize DTO to JSON
        String json = objectMapper.writeValueAsString(dto);

        // Perform POST to create company
        String response = mockMvc.perform(post("/api/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Deserialize response to get company ID
        Company created = objectMapper.readValue(response, Company.class);

        // GET and verify by ID
        mockMvc.perform(get("/api/companies/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(dto.getName()))
                .andExpect(jsonPath("$.industry.name").value(industry.getName()));
    }
}
