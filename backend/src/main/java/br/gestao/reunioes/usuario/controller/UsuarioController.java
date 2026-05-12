package br.gestao.reunioes.usuario.controller;

import br.gestao.reunioes.usuario.dto.LoginRequestDTO;
import br.gestao.reunioes.usuario.dto.LoginResponseDTO;
import br.gestao.reunioes.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

  
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
 
        String token = service.login(data.email(), data.senha());
        
     
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}