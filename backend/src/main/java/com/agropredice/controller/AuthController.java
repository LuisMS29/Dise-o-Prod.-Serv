package com.agropredice.controller;

import com.agropredice.dto.*;
import com.agropredice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de Autenticacion
 * Delega toda la logica de negocio a AuthService (Patron Service Layer)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    /**
     * HU-01: Registro de Usuario
     * POST /api/auth/registro
     */
    @PostMapping("/registro")
    public ResponseEntity<ApiResponse<UsuarioDTO>> registrar(
            @Valid @RequestBody UsuarioDTO request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    /**
     * Login de Usuario
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UsuarioDTO>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Obtener perfil del usuario autenticado
     * GET /api/auth/perfil
     */
    @GetMapping("/perfil")
    public ResponseEntity<ApiResponse<UsuarioDTO>> obtenerPerfil(
            @RequestHeader("X-User-Phone") String telefono) {
        return ResponseEntity.ok(authService.obtenerPerfil(telefono));
    }

    /**
     * Cambiar modo experto/simple
     * PUT /api/auth/modo-experto
     */
    @PutMapping("/modo-experto")
    public ResponseEntity<ApiResponse<UsuarioDTO>> cambiarModoExperto(
            @RequestHeader("X-User-Phone") String telefono,
            @RequestParam Boolean activar) {
        return ResponseEntity.ok(authService.actualizarModoExperto(telefono, activar));
    }

    /**
     * Activar/desactivar audio
     * PUT /api/auth/audio
     */
    @PutMapping("/audio")
    public ResponseEntity<ApiResponse<UsuarioDTO>> cambiarAudio(
            @RequestHeader("X-User-Phone") String telefono,
            @RequestParam Boolean activar) {
        return ResponseEntity.ok(authService.actualizarAudio(telefono, activar));
    }
}