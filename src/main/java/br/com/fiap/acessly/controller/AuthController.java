package br.com.fiap.acessly.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.acessly.service.TokenService;

@RestController
public class AuthController {
    
    private final TokenService tokenService;
    public record TokenResponse(String token) {
    }

    AuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public TokenResponse login(Authentication authentication) {
        var token = tokenService.generateToken(authentication.getName());
        return new TokenResponse(token);
    }
}
