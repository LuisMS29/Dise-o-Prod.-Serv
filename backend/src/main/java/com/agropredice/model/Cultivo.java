package com.agropredice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad Cultivo - Cultivo registrado por el agricultor
 */
@Entity
@Table(name = "cultivos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cultivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_cultivo", nullable = false, length = 50)
    @NotBlank(message = "El tipo de cultivo es obligatorio")
    @Size(min = 2, max = 50, message = "Tipo de cultivo invalido")
    private String tipoCultivo;

    @Column(name = "ubicacion", nullable = false, length = 200)
    @NotBlank(message = "La ubicacion es obligatoria")
    private String ubicacion;

    @Column(name = "latitud")
    private Double latitud;

    @Column(name = "longitud")
    private Double longitud;

    @Column(name = "hectareas")
    @DecimalMin(value = "0.01", message = "Las hectareas deben ser mayor a 0")
    private Double hectareas;

    @Column(name = "fecha_siembra")
    private LocalDate fechaSiembra;

    @Column(name = "zona_cobertura")
    @Builder.Default
    private Boolean zonaCobertura = true;

    @Column(name = "alertas_activadas")
    @Builder.Default
    private Boolean alertasActivadas = true;

    @Column(name = "estado", length = 20)
    @Builder.Default
    private String estado = "ACTIVO";

    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @PrePersist
    @PreUpdate
    public void validarZona() {
        // Validar si la ubicacion esta dentro de zona de cobertura SENAMHI
        // Lima Norte: Carabayllo, Huaral, etc.
        if (this.ubicacion != null) {
            String ubicacionLower = this.ubicacion.toLowerCase();
            this.zonaCobertura = ubicacionLower.contains("carabayllo") 
                || ubicacionLower.contains("huaral")
                || ubicacionLower.contains("canta")
                || ubicacionLower.contains("huacho")
                || ubicacionLower.contains("barranca");
        }
    }
}