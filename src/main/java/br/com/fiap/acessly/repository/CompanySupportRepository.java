package br.com.fiap.acessly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.fiap.acessly.model.CompanySupport;

public interface CompanySupportRepository extends JpaRepository<CompanySupport, Long>, JpaSpecificationExecutor<CompanySupport> {
    
    List<CompanySupport> findByCompanyId(Long companyId);

    List<CompanySupport> findBySupportTypeContainingIgnoreCase(String supportType);
}
