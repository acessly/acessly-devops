package br.com.fiap.acessly.dto;

import java.math.BigDecimal;

import br.com.fiap.acessly.model.VacancyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VacancyRequest(

    @NotNull(message = "ID da empresa é obrigatório")
    Long companyId,

    @NotBlank(message = "Título é obrigatório")
    String title,

    String description,

    @NotNull(message = "Tipo de vaga é obrigatório")
    VacancyType vacancyType,

    String city,

    String state,

    BigDecimal salary,

    @NotBlank(message = "Acessibilidade oferecido é obrigatória")
    String accessibilityOffered
) {}
