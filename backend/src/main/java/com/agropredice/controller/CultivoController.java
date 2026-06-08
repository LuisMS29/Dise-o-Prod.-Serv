package com.agropredice.controller;

import com.agropredice.dto.ApiResponse;
import com.agropredice.dto.CultivoDTO;
import com.agropredice.service.CultivoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Cultivos
 * HU-04: Registro de Cultivos
 */
@RestController
@RequestMapping("/api/cultivos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CultivoController {

    private final CultivoService cultivoService;

    /**
     * Registrar nuevo cultivo
     * POST /api/cultivos
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CultivoDTO>> registrarCultivo(
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody CultivoDTO request) {
        return ResponseEntity.ok(cultivoService.registrarCultivo(usuarioId, request));
    }

    /**
     * Obtener cultivos del usuario
     * GET /api/cultivos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CultivoDTO>>> obtenerCultivos(
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(cultivoService.obtenerCultivosPorUsuario(usuarioId));
    }

    /**
     * Obtener cultivo por ID
     * GET /api/cultivos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CultivoDTO>> obtenerCultivoPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(cultivoService.obtenerCultivoPorId(id));
    }

    /**
     * Eliminar cultivo
     * DELETE /api/cultivos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarCultivo(
            @PathVariable Long id) {
        return ResponseEntity.ok(cultivoService.eliminarCultivo(id));
    }

    /**
     * Obtener cultivos en zona de cobertura (admin)
     * GET /api/cultivos/zona-cobertura
     */
    @GetMapping("/zona-cobertura")
    public ResponseEntity<ApiResponse<List<CultivoDTO>>> obtenerCultivosZonaCobertura() {
        return ResponseEntity.ok(cultivoService.obtenerCultivosEnZonaCobertura());
    }
}