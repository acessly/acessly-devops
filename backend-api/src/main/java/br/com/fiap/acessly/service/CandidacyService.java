package br.com.fiap.acessly.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.fiap.acessly.dto.CandidacyRequest;
import br.com.fiap.acessly.dto.CandidacyResponse;
import br.com.fiap.acessly.model.Candidacy;
import br.com.fiap.acessly.model.CandidacyStatus;
import br.com.fiap.acessly.model.Candidate;
import br.com.fiap.acessly.model.Vacancy;
import br.com.fiap.acessly.repository.CandidacyRepository;
import br.com.fiap.acessly.repository.CandidateRepository;
import br.com.fiap.acessly.repository.VacancyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.NonNull;

@Service
public class CandidacyService {

    private final CandidacyRepository candidacyRepository;
    private final CandidateRepository candidateRepository;
    private final VacancyRepository vacancyRepository;

    public CandidacyService(CandidacyRepository candidacyRepository, CandidateRepository candidateRepository,
            VacancyRepository vacancyRepository) {
        this.candidacyRepository = candidacyRepository;
        this.candidateRepository = candidateRepository;
        this.vacancyRepository = vacancyRepository;
    }

    @SuppressWarnings("null")
    public CandidacyResponse createCandidacy(CandidacyRequest request) {
        Long candidateId = request.candidateId();
        Long vacancyId = request.vacancyId();

        if (candidateId == null || vacancyId == null) {
            throw new IllegalArgumentException("Candidate ID and Vacancy ID cannot be null.");
        }

        if (candidacyRepository.existsByCandidateIdAndVacancyId(candidateId, vacancyId)) {
            throw new RuntimeException("Candidate alreay applied to this vacancy");
        }

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Vacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));

        Candidacy candidacy = Candidacy.builder()
                .candidate(candidate)
                .vacancy(vacancy)
                .applicationDate(request.applicationDate())
                .status(request.status() != null ? request.status() : CandidacyStatus.UNDER_ANALYSIS)
                .build();

        return toResponse(candidacyRepository.save(candidacy));
    }

    public Optional<CandidacyResponse> getCandidacyById(@NonNull Long id) {
        return candidacyRepository.findById(id).map(this::toResponse);
    }

    public Page<CandidacyResponse> getCandidacies(@NonNull Pageable pageable) {
        return candidacyRepository.findAll(pageable).map(this::toResponse);
    }

    public Optional<CandidacyResponse> updateCandidacyStatus(@NonNull Long id, CandidacyStatus status) {
        return candidacyRepository.findById(id).map(candidacy -> {
            candidacy.setStatus(status);
            return toResponse(candidacyRepository.save(candidacy));
        });
    }

    public boolean deleteCandidacy(@NonNull Long id) {
        if (candidacyRepository.existsById(id)) {
            candidacyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<CandidacyResponse> getCandidaciesWithFilters(
            Long candidateId,
            Long vacancyId,
            String status,
            @NonNull Pageable pageable) {

        return candidacyRepository.findAll(
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (candidateId != null)
                        predicates.add(cb.equal(root.get("candidate").get("id"), candidateId));

                    if (vacancyId != null)
                        predicates.add(cb.equal(root.get("vacancy").get("id"), vacancyId));

                    if (status != null && !status.isBlank())
                        predicates.add(cb.equal(root.get("status"), CandidacyStatus.valueOf(status)));

                    return cb.and(predicates.toArray(new Predicate[0]));
                },
                pageable).map(this::toResponse);
    }

    public List<CandidacyResponse> getCandidaciesByCandidate(Long candidateId) {
        return candidacyRepository.findByCandidateId(candidateId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<CandidacyResponse> getCandidaciesByVacancy(Long vacancyId) {
        return candidacyRepository.findByVacancyId(vacancyId).stream()
                .map(this::toResponse)
                .toList();
    }

    private CandidacyResponse toResponse(Candidacy candidacy) {
        return new CandidacyResponse(
                candidacy.getId(),
                candidacy.getCandidate().getId(),
                candidacy.getCandidate().getUser().getName(),
                candidacy.getVacancy().getId(),
                candidacy.getVacancy().getTitle(),
                candidacy.getVacancy().getCompany().getName(),
                candidacy.getApplicationDate(),
                candidacy.getStatus());
    }
}
