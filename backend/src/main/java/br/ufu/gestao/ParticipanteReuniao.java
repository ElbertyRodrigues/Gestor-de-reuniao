package br.ufu.gestao;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "participantes_reuniao")
@Data
public class ParticipanteReuniao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "reuniao_id")
    private Reuniao reuniao;

    private String nome;
    private LocalDateTime entrada;
    private LocalDateTime saida;
    private String duracao;
    private String email;
    private String upnId;
    private String funcao;
    private Boolean cameraLigada;
    private Boolean levantarMaos;
    private Boolean desativarMudo;
}