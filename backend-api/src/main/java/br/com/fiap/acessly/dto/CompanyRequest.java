package br.com.fiap.acessly.dto;

import br.com.fiap.acessly.model.AcessibilityType;

public record CompanyRequest(
    Long userId,
    String name,
    String sector,
    AcessibilityType acessibilityType,
    String website,
    String description
) {}
