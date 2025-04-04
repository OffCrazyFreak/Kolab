package com.example.backend.util;

import com.example.backend.user.model.AUTHORITY;
import com.example.backend.user.model.AppUser;
import com.example.backend.util.exceptions.EntityNotFoundException;

import javax.naming.AuthenticationException;
import java.util.List;
import java.util.Optional;

public class Helper {
    public static <T> T getValue(Optional<T> obj, String errorMessage) throws EntityNotFoundException {
        if(obj.isEmpty()) {
            throw new EntityNotFoundException(errorMessage);
        }
        return obj.get();
    }

    public static void checkUserAuthorities(AppUser user, List<AUTHORITY> authorities) throws AuthenticationException {
        if (user == null) throw new AuthenticationException("You don't have access to Kolab.");
        if (!authorities.contains(user.getAuthority())){
            throw new AuthenticationException("You do not have permission to execute this command.");
        }
    }

    public static void checkSoftLocked(SoftLockedInterface obj) throws AuthenticationException {
        if (obj.softLocked) {
            throw new AuthenticationException("You can't change soft locked object");
        }
    }
}
