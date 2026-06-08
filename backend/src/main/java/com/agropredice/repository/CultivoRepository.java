package com.agropredice.repository;

import com.agropredice.model.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {

    List<Cultivo> findByUsuarioId(Long usuarioId);

    List<Cultivo> findByUsuarioIdAndEstado(Long usuarioId, String estado);

    @Query("SELECT c FROM Cultivo c WHERE c.zonaCobertura = true AND c.alertasActivadas = true")
    List<Cultivo> findActivosEnZonaCobertura();

    @Query("SELECT c FROM Cultivo c WHERE c.ubicacion LIKE %:distrito% AND c.zonaCobertura = true")
    List<Cultivo> findByDistritoAndZonaCobertura(@Param("distrito") String distrito);
}