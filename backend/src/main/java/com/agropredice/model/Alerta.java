package com.agropredice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad Alerta - Alertas climaticas generadas por el sistema
 */
@Entity
@Table(name = "alertas", indexes = {
    @Index(name = "idx_alerta_usuario", columnList = "usuario_id"),
    @Index(name = "idx_alerta_nivel", columnList = "nivel_riesgo"),
    @Index(name = "idx_alerta_fecha", columnList = "fecha_generacion")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false, length = 100)
    @NotBlank(message = "El titulo es obligatorio")
    private String titulo;

    @Column(name = "descripcion", nullable = false, length = 500)
    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @Column(name = "nivel_riesgo", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private NivelRiesgo nivelRiesgo;

    @Column(name = "tipo_alerta", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TipoAlerta tipoAlerta;

    @Column(name = "accion_recomendada", length = 300)
    private String accionRecomendada;

    @Column(name = "sms_enviado")
    @Builder.Default
    private Boolean smsEnviado = false;

    @Column(name = "audio_generado")
    @Builder.Default
    private Boolean audioGenerado = false;

    @Column(name = "leida")
    @Builder.Default
    private Boolean leida = false;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

    @CreationTimestamp
    @Column(name = "fecha_generacion", updatable = false)
    private LocalDateTime fechaGeneracion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultivo_id")
    private Cultivo cultivo;

    public enum NivelRiesgo {
        VERDE,    // Sin alertas - Condiciones favorables
        AMARILLO, // Precaucion - Preparar drenajes
        ROJO      // Peligro - Accion inmediata
    }

    public enum TipoAlerta {
        HELADA,
        LLUVIA_INTENSA,
        SEQUIA,
        VIENTO_FUERTE,
        CALOR_EXTREMO,
        PLAGA
    }
}