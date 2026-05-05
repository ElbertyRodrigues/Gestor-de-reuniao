package br.ufu.gestao.service;

import br.ufu.gestao.Reuniao;
import br.ufu.gestao.ParticipanteReuniao;
import br.ufu.gestao.repository.ReuniaoRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Service
public class ExcelService {

    @Autowired
    private ReuniaoRepository reuniaoRepository;

    public void importar(MultipartFile multipartFile) throws Exception {
        Path tempFile = Files.createTempFile("upload-", multipartFile.getOriginalFilename());
        multipartFile.transferTo(tempFile);
        File file = tempFile.toFile();

        try {
            try {
                processarExcel(file);
            } catch (Exception e) {
                processarCSV(file);
            }
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }

   private void processarExcel(File file) throws Exception {
    try (Workbook workbook = WorkbookFactory.create(file)) {
        Sheet sheet = workbook.getSheetAt(0);
        Row primeiraLinha = sheet.getRow(0);

        boolean isFormsVotacao = primeiraLinha != null
            && primeiraLinha.getCell(0) != null
            && "ID".equalsIgnoreCase(getCellValue(primeiraLinha, 0))
            && primeiraLinha.getLastCellNum() <= 7;

        if (isFormsVotacao) {
            processarFormsVotacao(sheet);
        } else {
            processarExcelTeams(sheet);
        }
    }
}

private void processarFormsVotacao(Sheet sheet) {
    Row header = sheet.getRow(0);

    int ultimaColuna = header.getLastCellNum() - 1;
    String tituloVotacao = getCellValue(header, ultimaColuna);

    Reuniao reuniao = new Reuniao();
    reuniao.setTitulo(tituloVotacao);
    reuniao.setParticipantesAtendidos(sheet.getLastRowNum());

    List<ParticipanteReuniao> participantes = new ArrayList<>();

    for (int i = 1; i <= sheet.getLastRowNum(); i++) {
        Row row = sheet.getRow(i);
        if (row == null) continue;

        ParticipanteReuniao p = new ParticipanteReuniao();
 
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yy HH:mm");

        Cell startCell = row.getCell(1);
        String startTime = "";
        if (startCell != null && startCell.getCellType() == CellType.NUMERIC) {
            startTime = sdf.format(startCell.getDateCellValue());
        }

        Cell completionCell = row.getCell(2);
        String completionTime = "";
        if (completionCell != null && completionCell.getCellType() == CellType.NUMERIC) {
            completionTime = sdf.format(completionCell.getDateCellValue());
        }

        p.setEmail(getCellValue(row, 3));
        p.setNome(getCellValue(row, 4));
        p.setPrimeiraEntrada(startTime);
        p.setUltimaSaida(completionTime);
        p.setFuncao("Participante");
        p.setVoto(getCellValue(row, ultimaColuna));
        p.setReuniao(reuniao);
        participantes.add(p);
    }

    reuniao.setParticipantes(participantes);
    reuniaoRepository.save(reuniao);
}

private void processarExcelTeams(Sheet sheet) throws Exception {
    Reuniao reuniao = new Reuniao();

    reuniao.setTitulo(getCellValue(sheet, 0, 1, "Reunião Sem Título"));
    reuniao.setParticipantesAtendidos(parseInteger(getCellValue(sheet, 1, 1, "0")));
    reuniao.setHoraInicio(getCellValue(sheet, 2, 1, ""));
    reuniao.setHoraTermino(getCellValue(sheet, 3, 1, ""));
    reuniao.setDuracao(getCellValue(sheet, 4, 1, ""));
    reuniao.setTempoMedioParticipacao(getCellValue(sheet, 5, 1, ""));

    List<ParticipanteReuniao> participantes = new ArrayList<>();

    for (int i = 7; i <= sheet.getLastRowNum(); i++) {
        Row row = sheet.getRow(i);
        if (row == null || row.getCell(0) == null) continue;
        if (row.getCell(0).getStringCellValue().equalsIgnoreCase("Nome")) continue;

        ParticipanteReuniao p = new ParticipanteReuniao();
        p.setNome(getCellValue(row, 0));
        p.setPrimeiraEntrada(getCellValue(row, 1));
        p.setUltimaSaida(getCellValue(row, 2));
        p.setDuracaoParticipacao(getCellValue(row, 3));
        p.setEmail(getCellValue(row, 4));
        p.setUpn(getCellValue(row, 5));
        p.setFuncao(getCellValue(row, 6));
        p.setCameraLigada(checkBoolean(getCellValue(row, 7)));
        p.setLevantarMaos(checkBoolean(getCellValue(row, 8)));
        p.setDesativarMudo(checkBoolean(getCellValue(row, 9)));

        p.setReuniao(reuniao);
        participantes.add(p);
    }

    reuniao.setParticipantes(participantes);
    reuniaoRepository.save(reuniao);
    }

    private void processarCSV(File file) throws Exception {
    try (Scanner scanner = new Scanner(file, "UTF-16")) {
        Reuniao reuniao = new Reuniao();
        List<ParticipanteReuniao> participantes = new ArrayList<>();
        int linha = 0;
        boolean secaoParticipantes = false;

        while (scanner.hasNextLine()) {
            String raw = scanner.nextLine();

            String line = raw.replaceAll("\uFEFF", "").trim();
            if (line.isEmpty()) { linha++; continue; }

            String[] campos = line.split("\t");


            if (linha == 1 && campos.length > 1) {
                reuniao.setTitulo(campos[1].trim());
            }

            else if (linha == 2 && campos.length > 1) {
                try { reuniao.setParticipantesAtendidos(Integer.parseInt(campos[1].trim())); }
                catch (Exception ignored) {}
            }

            else if (linha == 3 && campos.length > 1) {
                reuniao.setHoraInicio(campos[1].trim());
            }

            else if (linha == 4 && campos.length > 1) {
                reuniao.setHoraTermino(campos[1].trim());
            }

            else if (linha == 5 && campos.length > 1) {
                reuniao.setDuracao(campos[1].trim());
            }

            else if (linha == 6 && campos.length > 1) {
                reuniao.setTempoMedioParticipacao(campos[1].trim());
            }

            else if (campos[0].trim().equalsIgnoreCase("Nome") && campos.length > 4) {
                secaoParticipantes = true;
            }

            else if (secaoParticipantes && campos.length == 3 &&
                     (campos[1].trim().contains("câmera") ||
                      campos[1].trim().contains("Mudo") ||
                      campos[1].trim().contains("mãos") ||
                      campos[1].trim().contains("Ativou") ||
                      campos[1].trim().contains("desativado"))) {
                secaoParticipantes = false;
            }

            else if (secaoParticipantes && campos.length >= 7) {
                ParticipanteReuniao p = new ParticipanteReuniao();
                p.setNome(campos[0].trim());
                p.setPrimeiraEntrada(campos[1].trim());
                p.setUltimaSaida(campos[2].trim());
                p.setDuracaoParticipacao(campos[3].trim());
                p.setEmail(campos[4].trim());
                p.setUpn(campos[5].trim());
                p.setFuncao(campos[6].trim());

                if (campos.length > 7) p.setCameraLigada(!campos[7].trim().isEmpty());
                if (campos.length > 8) p.setLevantarMaos(!campos[8].trim().isEmpty());
                if (campos.length > 9) p.setDesativarMudo(!campos[9].trim().isEmpty());

                p.setReuniao(reuniao);
                participantes.add(p);
            }
            linha++;
        }
        reuniao.setParticipantes(participantes);
        reuniaoRepository.save(reuniao);
        }
    }

    private String getCellValue(Sheet sheet, int r, int c, String def) {
        try { return sheet.getRow(r).getCell(c).getStringCellValue(); } 
        catch (Exception e) { return def; }
    }

    private String getCellValue(Row row, int c) {
        try { 
            Cell cell = row.getCell(c);
            if (cell == null) return "";
            if (cell.getCellType() == CellType.NUMERIC) return String.valueOf(cell.getNumericCellValue());
            return cell.getStringCellValue();
        } catch (Exception e) { return ""; }
    }

    private Boolean checkBoolean(String value) {
        return value != null && (value.equalsIgnoreCase("Sim") || value.equalsIgnoreCase("Yes"));
    }

    private Integer parseInteger(String val) {
        try { return Integer.parseInt(val.replaceAll("[^0-9]", "")); } 
        catch (Exception e) { return 0; }
    }
}