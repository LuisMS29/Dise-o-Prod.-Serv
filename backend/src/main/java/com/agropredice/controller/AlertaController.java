package com.agropredice.controller;

import com.agropredice.dto.AlertaDTO;
import com.agropredice.dto.ApiResponse;
import com.agropredice.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Alertas
 * HU-05: Alertas Climaticas por SMS
 * HU-06: Sistema Semaforo de Riesgo
 * HU-08: Alertas por Audio
 */
@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AlertaController {

    private final AlertaService alertaService;

    /**
     * Generar alerta (admin o sistema)
     * POST /api/alertas
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AlertaDTO>> generarAlerta(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestBody AlertaDTO request) {
        return ResponseEntity.ok(alertaService.generarAlerta(usuarioId, request));
    }

    /**
     * Obtener alertas activas del usuario
     * GET /api/alertas/activas
     */
    @GetMapping("/activas")
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> obtenerAlertasActivas(
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(alertaService.obtenerAlertasActivas(usuarioId));
    }

    /**
     * Obtener todas las alertas del usuario
     * GET /api/alertas
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> obtenerAlertas(
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(alertaService.obtenerAlertasPorUsuario(usuarioId));
    }

    /**
     * Obtener alertas no leidas
     * GET /api/alertas/no-leidas
     */
    @GetMapping("/no-leidas")
    public ResponseEntity<ApiResponse<List<AlertaDTO>>> obtenerAlertasNoLeidas(
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(alertaService.obtenerAlertasNoLeidas(usuarioId));
    }

    /**
     * Marcar alerta como leida
     * PUT /api/alertas/{id}/leida
     */
    @PutMapping("/{id}/leida")
    public ResponseEntity<ApiResponse<Void>> marcarComoLeida(
            @PathVariable Long id) {
        return ResponseEntity.ok(alertaService.marcarComoLeida(id));
    }

    /**
     * Obtener estado del semaforo (dashboard)
     * GET /api/alertas/semaforo
     */
    @GetMapping("/semaforo")
    public ResponseEntity<ApiResponse<AlertaDTO>> obtenerEstadoSemaforo(
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(alertaService.obtenerEstadoSemaforo(usuarioId));
    }

    /**
     * Contar alertas no leidas
     * GET /api/alertas/contador
     */
    @GetMapping("/contador")
    public ResponseEntity<ApiResponse<Long>> contarNoLeidas(
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(alertaService.contarNoLeidas(usuarioId));
    }
}