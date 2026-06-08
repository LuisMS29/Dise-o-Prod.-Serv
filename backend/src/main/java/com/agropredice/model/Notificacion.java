package com.agropredice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad Notificacion - Registro de SMS enviados
 */
@Entity
@Table(name = "notificaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "telefono_destino", nullable = false, length = 15)
    private String telefonoDestino;

    @Column(name = "mensaje", nullable = false, length = 500)
    private String mensaje;

    @Column(name = "tipo", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TipoNotificacion tipo = TipoNotificacion.SMS;

    @Column(name = "estado", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EstadoNotificacion estado = EstadoNotificacion.PENDIENTE;

    @Column(name = "respuesta_proveedor", length = 500)
    private String respuestaProveedor;

    @CreationTimestamp
    @Column(name = "fecha_envio", updatable = false)
    private LocalDateTime fechaEnvio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alerta_id")
    private Alerta alerta;

    public enum TipoNotificacion {
        SMS, EMAIL, PUSH
    }

    public enum EstadoNotificacion {
        PENDIENTE, ENVIADO, FALLIDO, ENTREGADO
    }
}