package br.ufu.gestao.controller;

import br.ufu.gestao.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
// Removido o "/api" pois o Nginx (proxy_pass http://api:8080/;) já corta esse prefixo
@RequestMapping("/reunioes") 
public class ImportacaoController {

    @Autowired
    private ExcelService service;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Por favor, selecione um arquivo.");
        }

        try {
            service.importar(file);
            return ResponseEntity.ok("Importação concluída com sucesso!");
        } catch (Exception e) {
            e.printStackTrace(); // Ajuda a ver o erro real nos logs do Docker
            return ResponseEntity.internalServerError()
                .body("Erro ao processar o arquivo: " + e.getMessage());
        }
    }
}