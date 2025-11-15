package br.com.fiap.acessly.dto;

public record CompanySupportRequest(
    Long companyId,
    String supportType,
    String description
) {}
