package br.ufu.gestao;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "reunioes")
@Data
public class Reuniao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titulo;
    private Integer participantesAtendidos;

    private String horaInicio; 
    private String horaTermino;
    private String duracao;
    private String tempoMedioParticipacao;

    @OneToMany(mappedBy = "reuniao", cascade = CascadeType.ALL)
    private List<ParticipanteReuniao> participantes;
}