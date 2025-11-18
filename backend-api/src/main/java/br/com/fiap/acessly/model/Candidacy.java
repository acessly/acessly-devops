package br.com.fiap.acessly.model;

import java.time.LocalDate;

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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "candidacy")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidacy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidacy_seq")
    @SequenceGenerator(name = "candidacy_seq", sequenceName = "CANDIDACY_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidate_id", referencedColumnName = "id", nullable = false)
    @NotNull(message = "{candidacy.candidate.notnull}")
    private Candidate candidate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vacancy_id", referencedColumnName = "id", nullable = false)
    @NotNull(message = "{candidacy.vacancy.notnull}")
    private Vacancy vacancy;

    @Column(name = "application_date", nullable = false)
    @NotNull(message = "{candidacy.applicationdate.notnull}")
    private LocalDate applicationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private CandidacyStatus status = CandidacyStatus.UNDER_ANALYSIS;
}
