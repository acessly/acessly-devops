package br.com.fiap.acessly.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.fiap.acessly.dto.VacancyRequest;
import br.com.fiap.acessly.dto.VacancyResponse;
import br.com.fiap.acessly.model.Company;
import br.com.fiap.acessly.model.Vacancy;
import br.com.fiap.acessly.repository.CompanyRepository;
import br.com.fiap.acessly.repository.VacancyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.NonNull;

@Service
public class VacancyService {

    private final VacancyRepository vacancyRepository;
    private final CompanyRepository companyRepository;

    public VacancyService(VacancyRepository vacancyRepository, CompanyRepository companyRepository) {
        this.vacancyRepository = vacancyRepository;
        this.companyRepository = companyRepository;
    }

    @SuppressWarnings("null")
    public VacancyResponse createVacancy(VacancyRequest request) {
        Long companyId = request.companyId();

        if (companyId == null) {
            throw new IllegalArgumentException("Company ID cannot be null");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Vacancy vacancy = Vacancy.builder()
                .company(company)
                .title(request.title())
                .description(request.description())
                .vacancyType(request.vacancyType())
                .city(request.city())
                .state(request.state())
                .salary(request.salary())
                .accessibilityOffered(request.accessibilityOffered())
                .build();

        return toResponse(vacancyRepository.save(vacancy));
    }

    public Optional<VacancyResponse> getVacancyById(@NonNull Long id) {
        return vacancyRepository.findById(id).map(this::toResponse);
    }

    public Page<VacancyResponse> getVacancies(@NonNull Pageable pageable) {
        return vacancyRepository.findAll(pageable).map(this::toResponse);
    }

    public Optional<VacancyResponse> updateVacancy(@NonNull Long id, VacancyRequest request) {
        return vacancyRepository.findById(id).map(vacancy -> {
            Long companyId = request.companyId();

            if (companyId == null) {
                throw new IllegalArgumentException("Company ID cannot be null");
            }

            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new RuntimeException("Company not found"));

            vacancy.setCompany(company);
            vacancy.setTitle(request.title());
            vacancy.setDescription(request.description());
            vacancy.setVacancyType(request.vacancyType());
            vacancy.setCity(request.city());
            vacancy.setState(request.state());
            vacancy.setSalary(request.salary());
            vacancy.setAccessibilityOffered(request.accessibilityOffered());

            return toResponse(vacancyRepository.save(vacancy));
        });
    }

    public boolean deleteVacancy(@NonNull Long id) {
        if (vacancyRepository.existsById(id)) {
            vacancyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<VacancyResponse> getVacanciesWithFilters(
            String title,
            String vacancyType,
            String city,
            String accessibilityOffered,
            @NonNull Pageable pageable) {

        return vacancyRepository.findAll(
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (title != null && !title.isBlank())
                        predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));

                    if (vacancyType != null && !vacancyType.isBlank())
                        predicates.add(cb.equal(root.get("vacancyType"), vacancyType));

                    if (city != null && !city.isBlank())
                        predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"));

                    if (accessibilityOffered != null && !accessibilityOffered.isBlank())
                        predicates.add(cb.like(cb.lower(root.get("accessibilityOffered")),
                                "%" + accessibilityOffered.toLowerCase() + "%"));

                    return cb.and(predicates.toArray(new Predicate[0]));
                },
                pageable).map(this::toResponse);
    }

    private VacancyResponse toResponse(Vacancy vacancy) {
        return new VacancyResponse(
                vacancy.getId(),
                vacancy.getCompany().getId(),
                vacancy.getCompany().getName(),
                vacancy.getTitle(),
                vacancy.getDescription(),
                vacancy.getVacancyType(),
                vacancy.getCity(),
                vacancy.getState(),
                vacancy.getSalary(),
                vacancy.getAccessibilityOffered());
    }
}
