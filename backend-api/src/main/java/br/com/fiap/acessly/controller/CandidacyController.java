package br.com.fiap.acessly.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.acessly.dto.CandidacyRequest;
import br.com.fiap.acessly.dto.CandidacyResponse;
import br.com.fiap.acessly.model.CandidacyStatus;
import br.com.fiap.acessly.service.CandidacyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;

@Tag(name = "Candidacies", description = "Endpoints para candidaturas em vagas")
@RestController
@RequestMapping("candidacies")
public class CandidacyController {

    private final CandidacyService candidacyService;

    public CandidacyController(CandidacyService candidacyService) {
        this.candidacyService = candidacyService;
    }

    @Operation(summary = "Candidatar-se em uma vaga")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Candidatura realizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou candidatura duplicada"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas candidatos podem se candidatar")
    })
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping
    public ResponseEntity<CandidacyResponse> createCandidacy(
            @Parameter(description = "Dados da candidatura") @Valid @RequestBody CandidacyRequest request) {
        try {
            CandidacyResponse saved = candidacyService.createCandidacy(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Consulta candidatura por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Candidatura encontrada"),
            @ApiResponse(responseCode = "404", description = "Candidatura não encontrada")
    })
    @GetMapping("{id}")
    public ResponseEntity<CandidacyResponse> getCandidacy(
            @Parameter(description = "ID da candidatura") @PathVariable Long id) {
        Optional<CandidacyResponse> candidacy = candidacyService.getCandidacyById(id);
        return candidacy.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar todas as candidaturas com filtros")
    @ApiResponse(responseCode = "200", description = "Página de candidaturas encontrada")
    @GetMapping
    public ResponseEntity<Page<CandidacyResponse>> getCandidacies(
            @Parameter(description = "Filtro por ID do candidato") @RequestParam(required = false) Long candidateId,
            @Parameter(description = "Filtro por ID da vaga") @RequestParam(required = false) Long vacancyId,
            @Parameter(description = "Filtro por status") @RequestParam(required = false) String status,
            @Parameter(description = "Paginação e ordenação") @NonNull @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        Page<CandidacyResponse> result = candidacyService.getCandidaciesWithFilters(candidateId, vacancyId, status,
                pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Listar candidaturas de um candidatio específico")
    @ApiResponse(responseCode = "200", description = "Candidaturas encontradas")
    @GetMapping("candidates/{candidateId}")
    public ResponseEntity<List<CandidacyResponse>> getCandidaciesByCandidate(
            @Parameter(description = "ID do candidato") @PathVariable Long candidateId) {
        List<CandidacyResponse> candidacies = candidacyService.getCandidaciesByCandidate(candidateId);
        return ResponseEntity.ok(candidacies);
    }

    @Operation(summary = "Listar candidaturas de uma vaga específica")
    @ApiResponse(responseCode = "200", description = "Candidaturas encontradas")
    @PreAuthorize("hasRole('COMPANY')")
    @GetMapping("/vacancy/{vacancyId}")
    public ResponseEntity<List<CandidacyResponse>> getCandidaciesByVacancy(
            @Parameter(description = "ID da vaga") @PathVariable Long vacancyId) {
        List<CandidacyResponse> candidacies = candidacyService.getCandidaciesByVacancy(vacancyId);
        return ResponseEntity.ok(candidacies);
    }

    @Operation(summary = "Atualizar status da candidatura")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status atualizado"),
            @ApiResponse(responseCode = "404", description = "Candidatura não encontrada"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem atualizar status")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @PatchMapping("{id}/status")
    public ResponseEntity<CandidacyResponse> updateCandidacyStatus(
            @Parameter(description = "ID da candidatura") @PathVariable Long id,
            @Parameter(description = "Novo status") @RequestParam CandidacyStatus status) {
        Optional<CandidacyResponse> updated = candidacyService.updateCandidacyStatus(id, status);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Excluir candidatura")
    @ApiResponse(responseCode = "204", description = "Candidatura excluída")
    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCandidacy(
            @Parameter(description = "ID da candidatura") @PathVariable Long id) {

        if (candidacyService.deleteCandidacy(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
