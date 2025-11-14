package br.com.fiap.acessly.dto;

import java.math.BigDecimal;

import br.com.fiap.acessly.model.VacancyType;

public record VacancyRequest(
    Long companyId,
    String title,
    String description,
    VacancyType vacancyType,
    String city,
    String state,
    BigDecimal salary,
    String accessibilityOffered
) {}
