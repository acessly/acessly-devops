package br.com.fiap.acessly.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import br.com.fiap.acessly.dto.CandidateRequest;
import br.com.fiap.acessly.dto.CandidateResponse;
import br.com.fiap.acessly.model.Candidate;
import br.com.fiap.acessly.model.User;
import br.com.fiap.acessly.repository.CandidateRepository;
import br.com.fiap.acessly.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateRepository candidateRepository, UserRepository userRepository) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
    }

    @SuppressWarnings("null")
    public CandidateResponse createCandidate(CandidateRequest request) {
        Long userId = request.userId();

        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = Candidate.builder()
                .user(user)
                .disabilityType(request.disabilityType())
                .skills(request.skills())
                .experience(request.experience())
                .requiredAcessibility(request.requiredAcessibility())
                .build();

        candidate = candidateRepository.save(candidate);
        return toResponse(candidate);
    }

    public Optional<CandidateResponse> getCandidateById(@NonNull Long id) {
        return candidateRepository.findById(id)
                .map(this::toResponse);
    }

    public Page<CandidateResponse> getCandidates(@NonNull Pageable pageable) {
        return candidateRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public Optional<CandidateResponse> updateCandidate(@NonNull Long id, @NonNull CandidateRequest request) {
        return candidateRepository.findById(id).map(candidate -> {
            Long userId = request.userId();

            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            candidate.setUser(user);
            candidate.setDisabilityType(request.disabilityType());
            candidate.setSkills(request.skills());
            candidate.setExperience(request.experience());
            candidate.setRequiredAcessibility(request.requiredAcessibility());

            return toResponse(candidateRepository.save(candidate));
        });
    }

    public boolean deleteCandidate(@NonNull Long id) {
        if (candidateRepository.existsById(id)) {
            candidateRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<CandidateResponse> getCandidatesWithFilters(
            String disabilityType,
            String skills,
            @NonNull Pageable pageable) {

        return candidateRepository.findAll(
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (disabilityType != null && !disabilityType.isBlank())
                        predicates.add(cb.equal(root.get("disabilityType"), disabilityType));

                    if (skills != null && !skills.isBlank())
                        predicates.add(cb.like(cb.lower(root.get("skills")), "%" + skills.toLowerCase() + "%"));

                    return cb.and(predicates.toArray(new Predicate[0]));
                },
                pageable).map(this::toResponse);
    }

    private CandidateResponse toResponse(Candidate candidate) {
        return new CandidateResponse(
                candidate.getId(),
                candidate.getUser().getId(),
                candidate.getDisabilityType(),
                candidate.getSkills(),
                candidate.getExperience(),
                candidate.getRequiredAcessibility());
    }
}
