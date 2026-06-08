package com.agropredice.repository;

import com.agropredice.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByTelefono(String telefono);

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByTelefono(String telefono);

    boolean existsByCorreo(String correo);

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.cultivos WHERE u.id = :id")
    Optional<Usuario> findByIdWithCultivos(@Param("id") Long id);
}