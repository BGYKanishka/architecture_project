package com.bookfair.system.controller.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class AuthCallbackRedirectController {

    @Value("${app.public-url:http://localhost:3000}")
    private String appPublicUrl;

    @GetMapping("/auth/callback")
    public RedirectView handleCallback() {
        String target = (appPublicUrl != null && !appPublicUrl.isBlank())
                ? appPublicUrl.replaceAll("/+$", "") + "/auth/callback"
                : "http://localhost:5173/auth/callback";
        return new RedirectView(target);
    }
}
