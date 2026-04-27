package br.ufu.gestao.usuario.controller;

import br.ufu.gestao.usuario.dto.LoginRequestDTO;
import br.ufu.gestao.usuario.dto.LoginResponseDTO;
import br.ufu.gestao.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    // @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
        // O Controller não sabe "como" logar, ele apenas pede ao Service
        String token = service.login(data.email(), data.senha());
        
        // Retorna o DTO com o token gerado
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}