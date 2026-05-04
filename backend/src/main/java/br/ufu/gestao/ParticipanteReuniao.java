package br.ufu.gestao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "participantes_reuniao")
@Data
public class ParticipanteReuniao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String upn;
    private String funcao;
    
    private String primeiraEntrada;
    private String ultimaSaida;
    private String duracaoParticipacao;

    private Boolean cameraLigada;
    private Boolean levantarMaos;
    private Boolean desativarMudo;
    
    private String voto;

    @ManyToOne
    @JoinColumn(name = "reuniao_id")
    @JsonIgnore
    private Reuniao reuniao;
}