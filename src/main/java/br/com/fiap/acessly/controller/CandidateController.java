package br.com.fiap.acessly.controller;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.acessly.dto.CandidateRequest;
import br.com.fiap.acessly.dto.CandidateResponse;
import br.com.fiap.acessly.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;

@Tag(name = "Candidates", description = "Endpoint para cadastro, consulta, filtro, atualização e remoção de candidatos")
@RestController
@RequestMapping("candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @Operation(summary = "Cadastro de candidato")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Candidato cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping
    public ResponseEntity<CandidateResponse> createCandidate(
            @Parameter(description = "Dados do candidato") @Valid @RequestBody CandidateRequest request) {
        CandidateResponse saved = candidateService.createCandidate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Consulta candidato por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Candidato encontrado"),
            @ApiResponse(responseCode = "404", description = "Candidato não encontrado"),
    })
    @GetMapping("{id}")
    public ResponseEntity<CandidateResponse> getCandidate(
            @Parameter(description = "ID do candidato") @NonNull @PathVariable Long id) {
        Optional<CandidateResponse> candidate = candidateService.getCandidateById(id);
        return candidate.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Consulta paginada e filtrada de candidatos")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Página de candidatos encontrada")
    })
    @GetMapping
    public ResponseEntity<Page<CandidateResponse>> getCandidates(
            @Parameter(description = "Filtro por tipo de deficiência") @RequestParam(required = false) String disabilityType,
            @Parameter(description = "Filtro por habilidades") @RequestParam(required = false) String skills,
            @Parameter(description = "Paginação e ordenação") @NonNull Pageable pageable) {
        Page<CandidateResponse> result = candidateService.getCandidatesWithFilters(disabilityType, skills, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Atualização de candidato")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Candidato atualizado"),
            @ApiResponse(responseCode = "404", description = "Candidato não encontrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("{id}")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @Parameter(description = "ID do candidato") @NonNull @PathVariable Long id,
            @Parameter(description = "Novos dados do candidato") @NonNull @Valid @RequestBody CandidateRequest request) {
        Optional<CandidateResponse> updated = candidateService.updateCandidate(id, request);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Void> deleteCandidate(
            @Parameter(description = "ID do candidato") @NonNull @PathVariable Long id) {
        
        if (candidateService.deleteCandidate(id)) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.notFound().build();
    }

}
