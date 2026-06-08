package com.agropredice.repository;

import com.agropredice.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByUsuarioIdOrderByFechaGeneracionDesc(Long usuarioId);

    List<Alerta> findByUsuarioIdAndLeidaOrderByFechaGeneracionDesc(Long usuarioId, Boolean leida);

    List<Alerta> findByUsuarioIdAndNivelRiesgoOrderByFechaGeneracionDesc(Long usuarioId, Alerta.NivelRiesgo nivelRiesgo);

    List<Alerta> findByNivelRiesgoAndSmsEnviadoFalse(Alerta.NivelRiesgo nivelRiesgo);

    @Query("SELECT a FROM Alerta a WHERE a.usuario.id = :usuarioId AND a.fechaExpiracion > :ahora ORDER BY a.fechaGeneracion DESC")
    List<Alerta> findActivasByUsuarioId(@Param("usuarioId") Long usuarioId, @Param("ahora") LocalDateTime ahora);

    @Modifying
    @Query("UPDATE Alerta a SET a.leida = true WHERE a.id = :id")
    void marcarComoLeida(@Param("id") Long id);

    @Query("SELECT COUNT(a) FROM Alerta a WHERE a.usuario.id = :usuarioId AND a.leida = false")
    Long countNoLeidasByUsuarioId(@Param("usuarioId") Long usuarioId);
}