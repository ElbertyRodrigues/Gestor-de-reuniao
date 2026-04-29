package br.ufu.gestao.dto;

import com.poiji.annotation.ExcelCell;
import lombok.Data;

@Data
public class ParticipanteExcelDTO {

    @ExcelCell(0)
    private String nome;

    @ExcelCell(1)
    private String entrada;

    @ExcelCell(2)
    private String saida;

    @ExcelCell(3)
    private String duracao;

    @ExcelCell(4)
    private String email;

    @ExcelCell(5)
    private String upn;

    @ExcelCell(6)
    private String funcao;

    @ExcelCell(7)
    private String cameraLigada;

    @ExcelCell(8)
    private String levantarMaos;

    @ExcelCell(9)
    private String desativarMudo;
}