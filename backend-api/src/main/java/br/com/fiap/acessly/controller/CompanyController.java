package br.com.fiap.acessly.controller;

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

import br.com.fiap.acessly.dto.CompanyRequest;
import br.com.fiap.acessly.dto.CompanyResponse;
import br.com.fiap.acessly.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;

@Tag(name = "Companies", description = "Endpoint para cadastro, consulta, filtro, atualização e remoção de empresas")
@RestController
@RequestMapping("companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @Operation(summary = "Cadastro de empresa")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Empresa cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuário relacionado não encontrado")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @Parameter(description = "Dados da nova empresa a serem cadastrados") @RequestBody CompanyRequest request) {
        CompanyResponse saved = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Consulta empresa por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Empresa encontrada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Empresa não encontrada")
    })
    @GetMapping("{id}")
    public ResponseEntity<CompanyResponse> getCompany(
            @Parameter(description = "ID da empresa a ser consultada") @PathVariable Long id) {
        Optional<CompanyResponse> company = companyService.getCompanyById(id);
        return company.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Consulta paginada e filtrada de empresas")
    @ApiResponse(responseCode = "200", description = "Página de empresas encontrada com sucesso")
    @GetMapping
    public ResponseEntity<Page<CompanyResponse>> getCompanies(
            @Parameter(description = "Filtro por nome (opcional)") @RequestParam(required = false) String name,
            @Parameter(description = "Filtro por setor (opcional)") @RequestParam(required = false) String sector,
            @Parameter(description = "Filtro por tipo de acessibilidade (opcional)") @RequestParam(required = false) String acessibilityType,
            @Parameter(description = "Paginação e ordenação") @NonNull @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        Page<CompanyResponse> result = companyService.getCompaniesWithFilters(name, sector, acessibilityType, pageable);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Atualização de empresa")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Empresa atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Empresa não encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @Parameter(description = "ID da empresa a atualizar") @PathVariable Long id,
            @Parameter(description = "Novos dados da empresa") @RequestBody CompanyRequest request) {
        Optional<CompanyResponse> updated = companyService.updateCompany(id, request);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Exclusão de empresa")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Empresa excluída com sucesso"),
            @ApiResponse(responseCode = "404", description = "Empresa não encontrada")
    })
    @PreAuthorize("hasRole('COMPANY')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(
            @Parameter(description = "ID da empresa a excluir") @PathVariable Long id) {
        if (companyService.deleteCompany(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
