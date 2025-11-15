package br.com.fiap.acessly.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_support")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CompanySupport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "company_support_seq")
    @SequenceGenerator(name = "company_support_seq", sequenceName = "COMPANY_SUPPORT_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "company_id", referencedColumnName = "id", nullable = false)
    @NotNull(message = "{companysupport.company.notnull}")
    private Company company;

    @Column(name = "support_type", nullable = false, length = 100)
    @NotBlank(message = "{companysupport.supporttype.notblank}")
    private String supportType;

    @Column(name = "description", nullable = false, length = 255)
    @NotBlank(message = "{companysupport.description.notblank}")
    private String description;
}
