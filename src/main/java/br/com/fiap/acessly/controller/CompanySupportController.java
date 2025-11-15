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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.acessly.dto.CompanySupportRequest;
import br.com.fiap.acessly.dto.CompanySupportResponse;
import br.com.fiap.acessly.service.CompanySupportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;

@Tag(name = "Company Support", description = "Endpoint para cadastro e consulta de recursos de suporte oferecidos pelas empresas")
@RestController
@RequestMapping("company-support")
public class CompanySupportController {

    private final CompanySupportService companySupportService;

    public CompanySupportController(CompanySupportService companySupportService) {
        this.companySupportService = companySupportService;
    }

    @Operation(summary = "Cadastrar recurso de suporte da empresa")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Recurso de suporte cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem cadastrar")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @PostMapping
    public ResponseEntity<CompanySupportResponse> createCompanySupport(
            @Parameter(description = "Dados do recurso de suporte") @Valid @RequestBody CompanySupportRequest request) {
        CompanySupportResponse saved = companySupportService.createCompanySupport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Consultar recurso de suporte por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recurso de suporte encontrado"),
            @ApiResponse(responseCode = "404", description = "Recurso de suporte não encontrado")
    })
    @GetMapping("{id}")
    public ResponseEntity<CompanySupportResponse> getCompanySupport(
            @Parameter(description = "ID do recurso de suporte") @PathVariable Long id) {
        Optional<CompanySupportResponse> companySupport = companySupportService.getCompanySupportById(id);
        return companySupport.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar recursos de suporte com filtros")
    @ApiResponse(responseCode = "200", description = "Página de recursos de suporte encontrada")
    @GetMapping
    public ResponseEntity<Page<CompanySupportResponse>> getCompanySupports(
            @Parameter(description = "Filtro por ID da empresa") @RequestParam(required = false) Long companyId,
            @Parameter(description = "Filtro por tipo de suporte") @RequestParam(required = false) String supportType,
            @Parameter(description = "Paginação e ordenação") @NonNull @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        Page<CompanySupportResponse> result = companySupportService.getCompanySupportsWithFilters(companyId,
                supportType, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Listar recursos de suporte de uma empresa específica")
    @ApiResponse(responseCode = "200", description = "Recursos de suporte encontrados")
    @GetMapping("companies/{companyId}")
    public ResponseEntity<List<CompanySupportResponse>> getSupportsByCompany(
            @Parameter(description = "ID da empresa") @PathVariable Long companyId) {
        List<CompanySupportResponse> supports = companySupportService.getSupportByCompany(companyId);
        return ResponseEntity.ok(supports);
    }

    @Operation(summary = "Atualizar recurso de suporte")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recurso de suporte atualizado"),
            @ApiResponse(responseCode = "404", description = "Recurso de suporte não encontrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem atualizar")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @PutMapping("{id}")
    public ResponseEntity<CompanySupportResponse> updateCompanySupport(
            @Parameter(description = "ID do recurso de suporte") @PathVariable Long id,
            @Parameter(description = "Novos dados do recurso de suporte") @Valid @RequestBody CompanySupportRequest request) {
        Optional<CompanySupportResponse> updated = companySupportService.updateCompanySupport(id, request);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Excluir recurso de suporte")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Recurso de suporte excluído"),
            @ApiResponse(responseCode = "404", description = "Recurso de suporte não encontrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - apenas empresas podem excluir")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCompanySupport(
            @Parameter(description = "ID do recurso de suporte") @PathVariable Long id) {
        if (companySupportService.deleteCompanySupport(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
