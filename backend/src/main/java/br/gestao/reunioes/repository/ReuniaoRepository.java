package br.gestao.reunioes.repository;

import br.gestao.reunioes.Reuniao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReuniaoRepository extends JpaRepository<Reuniao, Long> {
    List<Reuniao> findByUsuarioIdOrderByIdDesc(Long usuarioId);
    Optional<Reuniao> findByIdAndUsuarioId(Long id, Long usuarioId); // segurança no GET /{id}
}