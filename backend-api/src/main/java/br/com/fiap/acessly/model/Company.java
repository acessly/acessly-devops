package br.com.fiap.acessly.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "company_seq")
    @SequenceGenerator(name = "company_seq", sequenceName = "COMPANY_SEQ", allocationSize = 1)
    private Long id;

    @NotNull(message = "{company.user.notnull}")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NotBlank(message = "{company.name.notblank]}")
    @Size(max = 100, message = "{company.name.size}")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "{company.sector.notblank}")
    @Size(max = 100, message = "{company.sector.size}")
    @Column(nullable = false, length = 100)
    private String sector;

    @NotNull(message = "{company.acessibilitytype.notnull}")
    @Enumerated(EnumType.STRING)
    @Column(name = "acessibility_type", nullable = false, length = 50)
    private AcessibilityType acessibilityType;

    @Size(max = 255, message = "{company.website.size}")
    @Column(name = "site", length = 255)
    private String website;

    @Column(columnDefinition = "CLOB")
    private String description;
}
