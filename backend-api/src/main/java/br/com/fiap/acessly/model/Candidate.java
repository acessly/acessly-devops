package br.com.fiap.acessly.model;

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
@Table(name = "candidate")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidate_seq")
    @SequenceGenerator(name = "candidate_seq", sequenceName = "CANDIDATE_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @NotNull(message = "{candidate.user.notnull}")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "disability_type", nullable = false, length = 100)
    @NotNull(message = "{candidate.disabilitytype.notnull}")
    private DisabilityType disabilityType;

    @Lob
    @Column(name = "skills", columnDefinition = "CLOB")
    private String skills;

    @Column(name = "experience", length = 255)
    private String experience;

    @Column(name = "required_acessibility", nullable = false, length = 255)
    @NotBlank(message = "{candidate.requiredacessibility.notblank}")
    private String requiredAcessibility;
}
