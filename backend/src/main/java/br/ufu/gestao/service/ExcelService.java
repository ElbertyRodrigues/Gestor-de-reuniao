package br.ufu.gestao.service;

import br.ufu.gestao.Reuniao;
import br.ufu.gestao.ParticipanteReuniao;
import br.ufu.gestao.dto.ParticipanteExcelDTO;
import br.ufu.gestao.repository.ReuniaoRepository;
import com.poiji.bind.Poiji;
import com.poiji.option.PoijiOptions;
import com.opencsv.CSVReader;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExcelService {

    @Autowired
    private ReuniaoRepository reuniaoRepository;

    public void importar(MultipartFile multipartFile) throws Exception {
        String fileName = multipartFile.getOriginalFilename().toLowerCase();
        
        if (fileName.endsWith(".csv")) {
            importarCSV(multipartFile);
        } else {
            importarExcel(multipartFile);
        }
    }

    private void importarExcel(MultipartFile multipartFile) throws Exception {
        Path tempFile = Files.createTempFile("upload-", multipartFile.getOriginalFilename());
        multipartFile.transferTo(tempFile);
        File file = tempFile.toFile();

        try (Workbook workbook = WorkbookFactory.create(file)) {
            Sheet sheet = workbook.getSheetAt(0);
            Reuniao reuniao = new Reuniao();
            
            // Cabeçalho Excel (Linha 0, Coluna 1)
            Row row0 = sheet.getRow(0);
            reuniao.setTitulo(row0 != null ? row0.getCell(1).getStringCellValue() : "Reunião Excel");

            PoijiOptions options = PoijiOptions.PoijiOptionsBuilder.settings().headerStart(7).build();
            List<ParticipanteExcelDTO> dtos = Poiji.fromExcel(file, ParticipanteExcelDTO.class, options);

            reuniao.setParticipantes(converterParaEntidades(dtos, reuniao));
            reuniaoRepository.save(reuniao);
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }

    private void importarCSV(MultipartFile file) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVReader csvReader = new CSVReader(reader)) {
            
            List<String[]> rows = csvReader.readAll();
            if (rows.isEmpty()) return;

            Reuniao reuniao = new Reuniao();
            // No CSV do Teams, o título costuma estar na primeira linha, última coluna
            // Baseado no snippet: ID, Start time, ..., "Título da Reunião"
            String[] headerRow = rows.get(0);
            reuniao.setTitulo(headerRow[headerRow.length - 1].replace("\"", ""));

            List<ParticipanteReuniao> participantes = new ArrayList<>();
            // Participantes começam da linha 1 (índice 1) em diante no CSV
            for (int i = 1; i < rows.size(); i++) {
                String[] columns = rows.get(i);
                if (columns.length < 5) continue;

                ParticipanteReuniao p = new ParticipanteReuniao();
                p.setNome(columns[4]); // Coluna Name
                p.setEmail(columns[3]); // Coluna Email
                p.setReuniao(reuniao);
                participantes.add(p);
            }

            reuniao.setParticipantes(participantes);
            reuniaoRepository.save(reuniao);
        }
    }

    private List<ParticipanteReuniao> converterParaEntidades(List<ParticipanteExcelDTO> dtos, Reuniao reuniao) {
        return dtos.stream().map(dto -> {
            ParticipanteReuniao p = new ParticipanteReuniao();
            p.setNome(dto.getNome());
            p.setEmail(dto.getEmail());
            p.setFuncao(dto.getFuncao());
            p.setReuniao(reuniao);
            p.setCameraLigada("Sim".equalsIgnoreCase(dto.getCameraLigada()));
            return p;
        }).collect(Collectors.toList());
    }
}