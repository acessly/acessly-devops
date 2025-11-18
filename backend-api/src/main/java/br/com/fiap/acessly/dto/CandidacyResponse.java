package br.com.fiap.acessly.dto;

import java.time.LocalDate;

import br.com.fiap.acessly.model.CandidacyStatus;

public record CandidacyResponse(
    Long id,
    Long candidateId,
    String candidateName,
    Long vacancyId,
    String vacancyTitle,
    String companyName,
    LocalDate applicationDate,
    CandidacyStatus status
) {}
