package br.com.fiap.acessly.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.fiap.acessly.model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long>, JpaSpecificationExecutor<Candidate> {
    
    Optional<Candidate> findByUserId(Long userId);

    List<Candidate> findByDisabilityType(String disabilityType);
}
