package br.gestao.reunioes.usuario.service;

import br.gestao.reunioes.usuario.repository.UsuarioRepository;
import br.gestao.reunioes.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public String login(String email, String senha) {
        var usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (passwordEncoder.matches(senha, usuario.getSenha())) {
            return tokenService.generateToken(email);
        }
        throw new RuntimeException("Credenciais inválidas");
    }
}