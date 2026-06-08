package com.agropredice.service;

import com.agropredice.dto.AlertaDTO;
import com.agropredice.dto.ApiResponse;
import com.agropredice.model.Alerta;
import com.agropredice.model.Cultivo;
import com.agropredice.model.Usuario;
import com.agropredice.repository.AlertaRepository;
import com.agropredice.repository.CultivoRepository;
import com.agropredice.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Servicio de Alertas - Logica de negocio de alertas climaticas
 * Incluye sistema semaforo de riesgo y generacion de alertas
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AlertaService {

    private final AlertaRepository alertaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CultivoRepository cultivoRepository;
    private final NotificacionService notificacionService;

    // Mapa de colores del semaforo segun documento
    private static final Map<Alerta.NivelRiesgo, String> COLORES_SEMAFORO = new HashMap<>();
    static {
        COLORES_SEMAFORO.put(Alerta.NivelRiesgo.VERDE, "#2E7D32");
        COLORES_SEMAFORO.put(Alerta.NivelRiesgo.AMARILLO, "#FFD740");
        COLORES_SEMAFORO.put(Alerta.NivelRiesgo.ROJO, "#FF5252");
    }

    // Mensajes de audio segun nivel
    private static final Map<Alerta.NivelRiesgo, String> MENSAJES_AUDIO = new HashMap<>();
    static {
        MENSAJES_AUDIO.put(Alerta.NivelRiesgo.VERDE, 
                "Sin alertas. Condiciones favorables para sus cultivos");
        MENSAJES_AUDIO.put(Alerta.NivelRiesgo.AMARILLO, 
                "Alerta amarilla. Prepare drenajes y tome precauciones");
        MENSAJES_AUDIO.put(Alerta.NivelRiesgo.ROJO, 
                "¡Alerta roja! Helada inminente. Actue ahora. Cubra sus cultivos con rastrojo");
    }

    /**
     * Generar alerta manualmente (para pruebas o admin)
     */
    @Transactional
    public ApiResponse<AlertaDTO> generarAlerta(Long usuarioId, AlertaDTO request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cultivo cultivo = null;
        if (request.getCultivoId() != null) {
            cultivo = cultivoRepository.findById(request.getCultivoId()).orElse(null);
        }

        Alerta alerta = Alerta.builder()
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .nivelRiesgo(Alerta.NivelRiesgo.valueOf(request.getNivelRiesgo()))
                .tipoAlerta(Alerta.TipoAlerta.valueOf(request.getTipoAlerta()))
                .accionRecomendada(request.getAccionRecomendada())
                .fechaExpiracion(LocalDateTime.now().plusHours(48))
                .usuario(usuario)
                .cultivo(cultivo)
                .build();

        Alerta guardada = alertaRepository.save(alerta);
        log.info("Alerta generada: {} para usuario {}", guardada.getNivelRiesgo(), usuario.getTelefono());

        // Enviar SMS si es alerta critica
        if (guardada.getNivelRiesgo() == Alerta.NivelRiesgo.ROJO) {
            notificacionService.enviarSMSAlerta(usuario, guardada);
        }

        return ApiResponse.ok(toDTO(guardada), "Alerta generada correctamente");
    }

    /**
     * Obtener alertas activas del usuario
     */
    public ApiResponse<List<AlertaDTO>> obtenerAlertasActivas(Long usuarioId) {
        List<Alerta> alertas = alertaRepository.findActivasByUsuarioId(usuarioId, LocalDateTime.now());
        List<AlertaDTO> dtos = alertas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos, "Alertas activas obtenidas");
    }

    /**
     * Obtener todas las alertas del usuario
     */
    public ApiResponse<List<AlertaDTO>> obtenerAlertasPorUsuario(Long usuarioId) {
        List<Alerta> alertas = alertaRepository.findByUsuarioIdOrderByFechaGeneracionDesc(usuarioId);
        List<AlertaDTO> dtos = alertas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos, "Alertas obtenidas correctamente");
    }

    /**
     * Obtener alertas no leidas
     */
    public ApiResponse<List<AlertaDTO>> obtenerAlertasNoLeidas(Long usuarioId) {
        List<Alerta> alertas = alertaRepository.findByUsuarioIdAndLeidaOrderByFechaGeneracionDesc(usuarioId, false);
        List<AlertaDTO> dtos = alertas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos, "Alertas no leidas obtenidas");
    }

    /**
     * Marcar alerta como leida
     */
    @Transactional
    public ApiResponse<Void> marcarComoLeida(Long alertaId) {
        alertaRepository.marcarComoLeida(alertaId);
        return ApiResponse.ok(null, "Alerta marcada como leida");
    }

    /**
     * Obtener estado del semaforo para dashboard
     */
    public ApiResponse<AlertaDTO> obtenerEstadoSemaforo(Long usuarioId) {
        List<Alerta> alertas = alertaRepository.findActivasByUsuarioId(usuarioId, LocalDateTime.now());

        // Determinar nivel mas critico
        Alerta.NivelRiesgo nivelCritico = Alerta.NivelRiesgo.VERDE;
        Alerta alertaCritica = null;

        for (Alerta alerta : alertas) {
            if (alerta.getNivelRiesgo().ordinal() > nivelCritico.ordinal()) {
                nivelCritico = alerta.getNivelRiesgo();
                alertaCritica = alerta;
            }
        }

        AlertaDTO semaforo = AlertaDTO.builder()
                .nivelRiesgo(nivelCritico.name())
                .colorHex(COLORES_SEMAFORO.get(nivelCritico))
                .mensajeAudio(MENSAJES_AUDIO.get(nivelCritico))
                .build();

        if (alertaCritica != null) {
            semaforo.setTitulo(alertaCritica.getTitulo());
            semaforo.setDescripcion(alertaCritica.getDescripcion());
            semaforo.setAccionRecomendada(alertaCritica.getAccionRecomendada());
        } else {
            semaforo.setTitulo("Sin alertas");
            semaforo.setDescripcion("Condiciones favorables para sus cultivos");
            semaforo.setAccionRecomendada("Continue con sus actividades normales");
        }

        return ApiResponse.ok(semaforo, "Estado del semaforo obtenido");
    }

    /**
     * Contar alertas no leidas
     */
    public ApiResponse<Long> contarNoLeidas(Long usuarioId) {
        Long count = alertaRepository.countNoLeidasByUsuarioId(usuarioId);
        return ApiResponse.ok(count, "Conteo de alertas no leidas");
    }

    /**
     * Generar alertas automaticas simulando datos SENAMHI
     * Se ejecuta cada 6 horas
     */
    @Scheduled(fixedRate = 21600000) // 6 horas
    @Transactional
    public void generarAlertasAutomaticas() {
        log.info("Generando alertas automaticas desde SENAMHI...");

        List<Cultivo> cultivos = cultivoRepository.findActivosEnZonaCobertura();

        for (Cultivo cultivo : cultivos) {
            // Simular condiciones climaticas (en produccion: consumir API SENAMHI real)
            simularCondicionClimatica(cultivo);
        }
    }

    private void simularCondicionClimatica(Cultivo cultivo) {
        // Simulacion: 30% probabilidad de alerta amarilla, 10% de roja
        double random = Math.random();

        if (random > 0.9) {
            // Alerta Roja - Helada
            crearAlerta(cultivo, Alerta.NivelRiesgo.ROJO, Alerta.TipoAlerta.HELADA,
                    "¡Alerta Roja! Helada inminente en 24h",
                    "Temperatura descendera bajo 0°C con humedad 85%",
                    "Cubra sus cultivos con rastrojo y active sistema de riego por aspersion");
        } else if (random > 0.7) {
            // Alerta Amarilla - Lluvia intensa
            crearAlerta(cultivo, Alerta.NivelRiesgo.AMARILLO, Alerta.TipoAlerta.LLUVIA_INTENSA,
                    "Alerta Amarilla. Lluvia intensa pronosticada en 48h",
                    "Precipitaciones intensas esperadas",
                    "Prepare drenajes y verifique canales de evacuacion");
        }
    }

    private void crearAlerta(Cultivo cultivo, Alerta.NivelRiesgo nivel, Alerta.TipoAlerta tipo,
                            String titulo, String descripcion, String accion) {
        Alerta alerta = Alerta.builder()
                .titulo(titulo)
                .descripcion(descripcion)
                .nivelRiesgo(nivel)
                .tipoAlerta(tipo)
                .accionRecomendada(accion)
                .fechaExpiracion(LocalDateTime.now().plusHours(48))
                .usuario(cultivo.getUsuario())
                .cultivo(cultivo)
                .build();

        alertaRepository.save(alerta);

        // Enviar SMS para alertas criticas
        if (nivel == Alerta.NivelRiesgo.ROJO) {
            notificacionService.enviarSMSAlerta(cultivo.getUsuario(), alerta);
        }

        log.info("Alerta {} generada para cultivo {}", nivel, cultivo.getTipoCultivo());
    }

    private AlertaDTO toDTO(Alerta alerta) {
        return AlertaDTO.builder()
                .id(alerta.getId())
                .titulo(alerta.getTitulo())
                .descripcion(alerta.getDescripcion())
                .nivelRiesgo(alerta.getNivelRiesgo().name())
                .tipoAlerta(alerta.getTipoAlerta().name())
                .accionRecomendada(alerta.getAccionRecomendada())
                .smsEnviado(alerta.getSmsEnviado())
                .audioGenerado(alerta.getAudioGenerado())
                .leida(alerta.getLeida())
                .fechaGeneracion(alerta.getFechaGeneracion())
                .fechaExpiracion(alerta.getFechaExpiracion())
                .usuarioId(alerta.getUsuario().getId())
                .cultivoId(alerta.getCultivo() != null ? alerta.getCultivo().getId() : null)
                .nombreCultivo(alerta.getCultivo() != null ? alerta.getCultivo().getTipoCultivo() : null)
                .colorHex(COLORES_SEMAFORO.get(alerta.getNivelRiesgo()))
                .mensajeAudio(MENSAJES_AUDIO.get(alerta.getNivelRiesgo()))
                .build();
    }
}