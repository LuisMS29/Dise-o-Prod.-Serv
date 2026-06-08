package com.agropredice.service;

import com.agropredice.dto.*;
import com.agropredice.model.Usuario;
import com.agropredice.repository.UsuarioRepository;
import com.agropredice.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de Autenticacion - Registro y Login
 * Patron Service Layer: Logica de negocio separada del controlador
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public ApiResponse<UsuarioDTO> registrar(UsuarioDTO request) {
        // Validar telefono duplicado
        if (usuarioRepository.existsByTelefono(request.getTelefono())) {
            return ApiResponse.error("Este numero ya esta registrado. ¿Desea iniciar sesion?");
        }

        // Validar correo duplicado
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            return ApiResponse.error("El correo ya esta registrado");
        }

        // Crear usuario
        Usuario usuario = Usuario.builder()
                .nombreCompleto(request.getNombreCompleto())
                .correo(request.getCorreo())
                .telefono(request.getTelefono())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Usuario.Rol.AGRICULTOR)
                .modoExperto(false)
                .audioActivado(true)
                .activo(true)
                .build();

        Usuario guardado = usuarioRepository.save(usuario);
        log.info("Usuario registrado: {}", guardado.getTelefono());

        // Generar token
        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        guardado.getTelefono(),
                        guardado.getPassword(),
                        java.util.Collections.emptyList()
                )
        );

        UsuarioDTO response = toDTO(guardado);
        response.setToken(token);

        return ApiResponse.ok(response, "Registro exitoso. Bienvenido a AgroPredice Peru");
    }

    public ApiResponse<UsuarioDTO> login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getTelefono(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByTelefono(request.getTelefono())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        usuario.getTelefono(),
                        usuario.getPassword(),
                        java.util.Collections.emptyList()
                )
        );

        UsuarioDTO response = toDTO(usuario);
        response.setToken(token);

        return ApiResponse.ok(response, "Inicio de sesion exitoso");
    }

    public ApiResponse<UsuarioDTO> obtenerPerfil(String telefono) {
        Usuario usuario = usuarioRepository.findByTelefono(telefono)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ApiResponse.ok(toDTO(usuario), "Perfil obtenido");
    }

    @Transactional
    public ApiResponse<UsuarioDTO> actualizarModoExperto(String telefono, Boolean modoExperto) {
        Usuario usuario = usuarioRepository.findByTelefono(telefono)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setModoExperto(modoExperto);
        Usuario actualizado = usuarioRepository.save(usuario);

        return ApiResponse.ok(toDTO(actualizado), 
                modoExperto ? "Modo Experto activado" : "Modo Simple activado");
    }

    @Transactional
    public ApiResponse<UsuarioDTO> actualizarAudio(String telefono, Boolean audioActivado) {
        Usuario usuario = usuarioRepository.findByTelefono(telefono)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setAudioActivado(audioActivado);
        Usuario actualizado = usuarioRepository.save(usuario);

        return ApiResponse.ok(toDTO(actualizado), 
                audioActivado ? "Audio activado" : "Modo silencio activado");
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombreCompleto(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .telefono(usuario.getTelefono())
                .rol(usuario.getRol().name())
                .modoExperto(usuario.getModoExperto())
                .audioActivado(usuario.getAudioActivado())
                .activo(usuario.getActivo())
                .fechaRegistro(usuario.getFechaRegistro())
                .build();
    }
}