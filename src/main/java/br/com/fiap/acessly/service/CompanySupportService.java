package br.com.fiap.acessly.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.fiap.acessly.dto.CompanySupportRequest;
import br.com.fiap.acessly.dto.CompanySupportResponse;
import br.com.fiap.acessly.model.Company;
import br.com.fiap.acessly.model.CompanySupport;
import br.com.fiap.acessly.repository.CompanyRepository;
import br.com.fiap.acessly.repository.CompanySupportRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.NonNull;

@Service
public class CompanySupportService {

    private final CompanySupportRepository companySupportRepository;
    private final CompanyRepository companyRepository;

    public CompanySupportService(br.com.fiap.acessly.repository.CompanySupportRepository companySupportRepository,
            CompanyRepository companyRepository) {
        this.companySupportRepository = companySupportRepository;
        this.companyRepository = companyRepository;
    }

    @SuppressWarnings("null")
    public CompanySupportResponse createCompanySupport(CompanySupportRequest request) {
        Long companyId = request.companyId();

        if (companyId == null) {
            throw new IllegalArgumentException("Company ID cannot be null");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        CompanySupport companySupport = CompanySupport.builder()
                .company(company)
                .supportType(request.supportType())
                .description(request.description())
                .build();

        return toResponse(companySupportRepository.save(companySupport));
    }

    public Optional<CompanySupportResponse> getCompanySupportById(@NonNull Long id) {
        return companySupportRepository.findById(id).map(this::toResponse);
    }

    public Page<CompanySupportResponse> getCompanySupports(@NonNull Pageable pageable) {
        return companySupportRepository.findAll(pageable).map(this::toResponse);
    }

    public Optional<CompanySupportResponse> updateCompanySupport(@NonNull Long id, CompanySupportRequest request) {
        return companySupportRepository.findById(id).map(companySupport -> {
            Long companyId = request.companyId();

            if (companyId == null) {
                throw new IllegalArgumentException("Company ID cannot be null");
            }

            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new RuntimeException("Company not found"));

            companySupport.setCompany(company);
            companySupport.setSupportType(request.supportType());
            companySupport.setDescription(request.description());

            return toResponse(companySupportRepository.save(companySupport));
        });
    }

    public boolean deleteCompanySupport(@NonNull Long id) {
        if (companySupportRepository.existsById(id)) {
            companySupportRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<CompanySupportResponse> getCompanySupportsWithFilters(
            Long companyId,
            String supportType,
            @NonNull Pageable pageable) {

        return companySupportRepository.findAll(
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (companyId != null)
                        predicates.add(cb.equal(root.get("company").get("id"), companyId));

                    if (supportType != null && !supportType.isBlank())
                        predicates
                                .add(cb.like(cb.lower(root.get("supportType")), "%" + supportType.toLowerCase() + "%"));

                    return cb.and(predicates.toArray(new Predicate[0]));
                },
                pageable).map(this::toResponse);
    }

    public List<CompanySupportResponse> getSupportByCompany(Long companyId) {
        return companySupportRepository.findByCompanyId(companyId).stream()
                .map(this::toResponse)
                .toList();
    }

    private CompanySupportResponse toResponse(CompanySupport companySupport) {
        return new CompanySupportResponse(
                companySupport.getId(),
                companySupport.getCompany().getId(),
                companySupport.getCompany().getName(),
                companySupport.getSupportType(),
                companySupport.getDescription());
    }
}
