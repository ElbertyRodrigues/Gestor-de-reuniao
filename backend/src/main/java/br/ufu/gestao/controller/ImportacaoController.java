package br.ufu.gestao.controller;

import java.util.List;
import br.ufu.gestao.Reuniao;
import br.ufu.gestao.repository.ReuniaoRepository;
import br.ufu.gestao.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
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
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Erro ao processar o arquivo: " + e.getMessage());
        }
    }

    @Autowired
    private ReuniaoRepository reuniaoRepository;

    @GetMapping
    public ResponseEntity<List<Reuniao>> listarTodas() {
        List<Reuniao> lista = reuniaoRepository.findAll();
        System.out.println("Quantidade de reuniões encontradas: " + lista.size());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reuniao> buscarPorId(@PathVariable Long id) {
        return reuniaoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}