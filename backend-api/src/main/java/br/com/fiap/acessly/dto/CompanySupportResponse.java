package br.com.fiap.acessly.dto;

public record CompanySupportResponse(
    Long id,
    Long companyId,
    String companyName,
    String supportType,
    String description
) {}
