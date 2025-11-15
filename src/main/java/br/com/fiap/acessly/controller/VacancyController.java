package br.com.fiap.acessly.controller;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.acessly.dto.VacancyRequest;
import br.com.fiap.acessly.dto.VacancyResponse;
import br.com.fiap.acessly.service.VacancyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;

@Tag(name = "Vacancies", description = "Endpoint para cadastro, consulta, filtro ,atualização e remoção de vagas")
@RestController
@RequestMapping("vacancies")
public class VacancyController {

    private final VacancyService vacancyService;

    public VacancyController(VacancyService vacancyService) {
        this.vacancyService = vacancyService;
    }

    @Operation(summary = "Cadastro de vaga")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Vaga cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem criar vagas")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @PostMapping
    public ResponseEntity<VacancyResponse> createVacancy(
            @Parameter(description = "Dados da nova vaga") @Valid @RequestBody VacancyRequest request) {
        VacancyResponse saved = vacancyService.createVacancy(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Consulta vaga por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vaga encontrada"),
            @ApiResponse(responseCode = "404", description = "Vaga não encontrada")
    })
    @GetMapping("{id}")
    public ResponseEntity<VacancyResponse> getVacancy(
            @Parameter(description = "ID da vaga") @PathVariable Long id) {
        Optional<VacancyResponse> vacancy = vacancyService.getVacancyById(id);
        return vacancy.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Consulta paginada e filtrada de vagas")
    @ApiResponse(responseCode = "200", description = "Página de vagas encontrada")
    @GetMapping
    public ResponseEntity<Page<VacancyResponse>> getVacancies(
            @Parameter(description = "Filtro por título (opcional)") @RequestParam(required = false) String title,
            @Parameter(description = "Filtro por tipo de vaga (opcional)") @RequestParam(required = false) String vacancyType,
            @Parameter(description = "Filtro por cidade (opcional)") @RequestParam(required = false) String city,
            @Parameter(description = "Filtro por acessibilidade oferecida (opcional)") @RequestParam(required = false) String accessibilityOffered,
            @Parameter(description = "Paginação e ordenação") @NonNull Pageable pageable) {
        Page<VacancyResponse> result = vacancyService.getVacanciesWithFilters(title, vacancyType, city,
                accessibilityOffered, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Atualização de vaga")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vaga atualizada"),
            @ApiResponse(responseCode = "404", description = "Vaga não encontrada"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem atualizar vagas")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @PutMapping("{id}")
    public ResponseEntity<VacancyResponse> updateVacancy(
            @Parameter(description = "ID da vaga") @PathVariable Long id,
            @Parameter(description = "Novos dados da vaga") @Valid @RequestBody VacancyRequest request) {
        Optional<VacancyResponse> updated = vacancyService.updateVacancy(id, request);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Exclusão de vaga")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Vaga excluída"),
            @ApiResponse(responseCode = "404", description = "Vaga não encontrada"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem excluir vagas")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteVacancy(
            @Parameter(description = "ID da vaga") @PathVariable Long id) {
        if (vacancyService.deleteVacancy(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
