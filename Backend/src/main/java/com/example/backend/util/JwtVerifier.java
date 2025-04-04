package com.example.backend.util;

import org.json.JSONObject;

import java.util.Base64;

public class JwtVerifier {
    static Base64.Decoder decoder = Base64.getUrlDecoder();

    public static String verifyAndReturnEmail(String token) {
            if (token == null) return null;

            String[] chunks = token.split("\\.");
            if (chunks.length != 3) return null;
            String bodyString = new String(decoder.decode(chunks[1]));
            JSONObject body = new JSONObject(bodyString);

            return body.getString("email");
    }
}
