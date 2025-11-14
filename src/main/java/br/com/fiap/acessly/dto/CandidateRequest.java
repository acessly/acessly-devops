package br.com.fiap.acessly.dto;

import br.com.fiap.acessly.model.DisabilityType;

public record CandidateRequest(
    Long userId,
    DisabilityType disabilityType,
    String skills,
    String experience,
    String requiredAcessibility
) {}
