package br.com.fiap.acessly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.fiap.acessly.model.Candidacy;
import br.com.fiap.acessly.model.CandidacyStatus;

public interface CandidacyRepository extends JpaRepository<Candidacy, Long>, JpaSpecificationExecutor<Candidacy> {
    
    List<Candidacy> findByCandidateId(Long candidateId);

    List<Candidacy> findByVacancyId(Long vacancyId);

    List<Candidacy> findByStatus(CandidacyStatus status);

    boolean existsByCandidateIdAndVacancyId(Long candidateId, Long vacancyId);
}
