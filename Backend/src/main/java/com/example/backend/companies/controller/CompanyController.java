package com.example.backend.companies.controller;
import com.example.backend.collaborations.service.CollaborationsService;
import com.example.backend.companies.controller.dto.CompanyDto;
import com.example.backend.companies.controller.dto.ContactDto;
import com.example.backend.companies.model.Company;
import com.example.backend.companies.model.Contact;
import com.example.backend.companies.service.CompanyService;
import com.example.backend.user.model.AUTHORITY;
import com.example.backend.user.model.AppUser;
import com.example.backend.user.service.UserService;
import com.example.backend.util.JwtVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.naming.AuthenticationException;
import com.example.backend.util.exceptions.EntityNotFoundException;
import java.util.List;

@SuppressWarnings("ALL")
@CrossOrigin
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController
{
    private final CompanyService companyService;
    private final UserService userService;
    private final CollaborationsService collaborationsService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Company>> getCompanies(@RequestHeader String googleTokenEncoded){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.getAllCompanies(user), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<Company> AddCompany(@RequestHeader String googleTokenEncoded, @RequestBody CompanyDto companyDto){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.createCompany(user, companyDto), HttpStatus.CREATED);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Company> getCompany(@RequestHeader String googleTokenEncoded, @PathVariable Long id){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.getCompany(user, id), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{companyId}/contacts")
    @ResponseBody
    public ResponseEntity<Contact> addContact(@RequestHeader String googleTokenEncoded, @PathVariable Long companyId, @RequestBody ContactDto contactDto){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.addContactToCompany(user, companyId, contactDto), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("{companyId}")
    @ResponseBody
    public ResponseEntity<Company> editCompany(@RequestHeader String googleTokenEncoded, @PathVariable Long companyId, @RequestBody CompanyDto companyDto){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.editCompany(user, companyId, companyDto), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{companyId}/softLock")
    @ResponseBody
    public ResponseEntity<Boolean> softLockCompany(@RequestHeader String googleTokenEncoded, @PathVariable Long companyId){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.softLockCompany(user, companyId), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{companyId}")
    @ResponseBody
    public ResponseEntity<Company> deleteCompany(@RequestHeader String googleTokenEncoded, @PathVariable Long companyId)
    {
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            companyService.deleteCompany(user, companyId);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{companyId}/contacts/{contactId}")
    @ResponseBody
    public ResponseEntity<Contact> editContact(@RequestHeader String googleTokenEncoded, @PathVariable Long companyId, @PathVariable Long contactId, @RequestBody ContactDto contactDto){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(companyService.editContact(user, companyId, contactId, contactDto), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{companyId}/contacts/{contactId}")
    @ResponseBody
    public ResponseEntity deleteContact(@RequestHeader String googleTokenEncoded, @PathVariable Long companyId, @PathVariable Long contactId){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            companyService.deleteContact(user, companyId, contactId);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/collaborations")
    @ResponseBody
    public ResponseEntity getCollaborationsForCompany(@RequestHeader String googleTokenEncoded, @PathVariable Long id){
        List<AUTHORITY> a = List.of(AUTHORITY.MODERATOR, AUTHORITY.ADMINISTRATOR, AUTHORITY.FR_RESPONSIBLE);
        String email = JwtVerifier.verifyAndReturnEmail(googleTokenEncoded);
        if (email == null)
            return new ResponseEntity("Token is missing or invalid", HttpStatus.UNAUTHORIZED);
        if (userService.findByEmail(email) == null)
            return new ResponseEntity("You don't have access to Kolab", HttpStatus.UNAUTHORIZED);
        if (!a.contains(userService.findByEmail(email).getAuthority()))
            return new ResponseEntity("You don't have premission to this resource", HttpStatus.UNAUTHORIZED);

        try
        {
            return new ResponseEntity(collaborationsService.getCollaborationsForCompany(id), HttpStatus.OK);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }

    private AppUser getUser(String googleTokenEncoded){
        String email = JwtVerifier.verifyAndReturnEmail(googleTokenEncoded);
        if (email == null)
            return null;
        return userService.findByEmail(email);
    }
}
