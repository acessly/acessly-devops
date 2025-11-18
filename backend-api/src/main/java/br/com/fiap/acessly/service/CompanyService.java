package br.com.fiap.acessly.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.fiap.acessly.dto.CompanyRequest;
import br.com.fiap.acessly.dto.CompanyResponse;
import br.com.fiap.acessly.model.Company;
import br.com.fiap.acessly.model.User;
import br.com.fiap.acessly.repository.CompanyRepository;
import br.com.fiap.acessly.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.NonNull;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @SuppressWarnings("null")
    public CompanyResponse createCompany(CompanyRequest request) {
        Long userId = request.userId();

        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = Company.builder()
                .user(user)
                .name(request.name())
                .sector(request.sector())
                .acessibilityType(request.acessibilityType())
                .website(request.website())
                .description(request.description())
                .build();

        company = companyRepository.save(company);
        return toResponse(company);
    }

    public Optional<CompanyResponse> getCompanyById(@NonNull Long id) {
        return companyRepository.findById(id).map(this::toResponse);
    }

    public Page<CompanyResponse> getCompanies(@NonNull Pageable pageable) {
        return companyRepository.findAll(pageable).map(this::toResponse);
    }

    public Optional<CompanyResponse> updateCompany(@NonNull Long id, CompanyRequest request) {
        return companyRepository.findById(id).map(company -> {
            Long userId = request.userId();

            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            company.setUser(user);
            company.setName(request.name());
            company.setSector(request.sector());
            company.setAcessibilityType(request.acessibilityType());
            company.setWebsite(request.website());
            company.setDescription(request.description());

            return toResponse(companyRepository.save(company));
        });
    }

    public boolean deleteCompany(long id) {
        if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private CompanyResponse toResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getSector(),
                company.getAcessibilityType(),
                company.getWebsite(),
                company.getDescription(),
                company.getUser().getId());
    }

    public Page<CompanyResponse> getCompaniesWithFilters(String name, String sector, String acessibilityType,
            @NonNull Pageable pageable) {
        return companyRepository.findAll(
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();
                    if (name != null && !name.isBlank())
                        predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
                    if (sector != null && !sector.isBlank())
                        predicates.add(cb.like(cb.lower(root.get("sector")), "%" + sector.toLowerCase() + "%"));
                    if (acessibilityType != null && !acessibilityType.isBlank())
                        predicates.add(cb.equal(root.get("acessibilityType"), acessibilityType));
                    return cb.and(predicates.toArray(new Predicate[0]));
                },
                pageable).map(this::toResponse);
    }

}
