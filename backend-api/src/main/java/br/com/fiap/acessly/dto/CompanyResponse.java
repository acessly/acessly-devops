package br.com.fiap.acessly.dto;

import br.com.fiap.acessly.model.AcessibilityType;

public record CompanyResponse(
    Long id,
    String name,
    String sector,
    AcessibilityType acessibilityType,
    String website,
    String description,
    Long userId
) {}
