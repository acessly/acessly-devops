package br.com.fiap.acessly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.fiap.acessly.model.Vacancy;

public interface VacancyRepository extends JpaRepository<Vacancy, Long>, JpaSpecificationExecutor<Vacancy> {
    
    List<Vacancy> findByCompanyId(Long companyId);

    List<Vacancy> findByVacancyType(String vacancyType);

    List<Vacancy> findByCityContainingIgnoreCase(String city);
}
