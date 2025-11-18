package br.com.fiap.acessly.dto;

import java.math.BigDecimal;

import br.com.fiap.acessly.model.VacancyType;

public record VacancyResponse(
    Long id,
    Long companyId,
    String companyName,
    String title,
    String description,
    VacancyType vacancyType,
    String city,
    String state,
    BigDecimal salary,
    String accessibilityOffered
) {}
