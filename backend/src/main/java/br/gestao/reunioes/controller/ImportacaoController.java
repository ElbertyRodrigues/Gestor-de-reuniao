package br.gestao.reunioes.controller;

import java.util.List;
import br.gestao.reunioes.Reuniao;
import br.gestao.reunioes.repository.ReuniaoRepository;
import br.gestao.reunioes.service.ExcelService;
import br.gestao.reunioes.usuario.dto.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/reunioes")
public class ImportacaoController {

    @Autowired
    private ExcelService service;

    @Autowired
    private ReuniaoRepository reuniaoRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Usuario usuario) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Por favor, selecione um arquivo.");
        }
        if (usuario == null) {
            return ResponseEntity.status(401).body("Usuário não autenticado.");
        }

        try {
            service.importar(file, usuario.getId()); // ← passa o id
            return ResponseEntity.ok("Importação concluída com sucesso!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Erro ao processar o arquivo: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Reuniao>> listarTodas(
            @AuthenticationPrincipal Usuario usuario) {

        List<Reuniao> lista = reuniaoRepository.findByUsuarioIdOrderByIdDesc(usuario.getId());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reuniao> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {

        return reuniaoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}