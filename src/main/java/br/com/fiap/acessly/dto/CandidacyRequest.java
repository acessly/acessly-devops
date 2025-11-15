package br.com.fiap.acessly.dto;

import java.time.LocalDate;

import br.com.fiap.acessly.model.CandidacyStatus;

public record CandidacyRequest(
    Long candidateId,
    Long vacancyId,
    LocalDate applicationDate,
    CandidacyStatus status
) {}
