package com.agropredice.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO para Alerta Climatica
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private String nivelRiesgo;     // VERDE, AMARILLO, ROJO
    private String tipoAlerta;      // HELADA, LLUVIA_INTENSA, etc.
    private String accionRecomendada;
    private Boolean smsEnviado;
    private Boolean audioGenerado;
    private Boolean leida;
    private LocalDateTime fechaGeneracion;
    private LocalDateTime fechaExpiracion;
    private Long usuarioId;
    private Long cultivoId;
    private String nombreCultivo;

    // Campos para semaforo
    private String colorHex;        // #2E7D32, #FFD740, #FF5252
    private String mensajeAudio;    // Texto para TTS
}