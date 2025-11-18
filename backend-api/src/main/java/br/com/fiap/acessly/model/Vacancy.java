package br.com.fiap.acessly.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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
@Table(name = "vacancy")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vacancy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vacancy_seq")
    @SequenceGenerator(name = "vacancy_seq", sequenceName = "VACANCY_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "company_id", referencedColumnName = "id", nullable = false)
    @NotNull(message = "{vacancy.company.notnull}")
    private Company company;

    @Column(name = "title", nullable = false, length = 100)
    @NotBlank(message = "{vacancy.title.notblank}")
    private String title;

    @Lob
    @Column(name = "description", columnDefinition = "CLOB")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacancy_type", nullable = false, length = 30)
    @NotNull(message = "{vacancy.vacancytype.notnull}")
    private VacancyType vacancyType;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "salary", precision = 10, scale = 2)
    private BigDecimal salary;

    @Column(name = "accessibility_offered", nullable = false, length = 255)
    @NotBlank(message = "{vacancy.accessibilityoffered.notblank}")
    private String accessibilityOffered;
}
