package com.agropredice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para Cultivo
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivoDTO {

    private Long id;

    @NotBlank(message = "El tipo de cultivo es obligatorio")
    @Size(min = 2, max = 50, message = "Tipo de cultivo invalido")
    private String tipoCultivo;

    @NotBlank(message = "La ubicacion es obligatoria")
    private String ubicacion;

    private Double latitud;
    private Double longitud;

    @DecimalMin(value = "0.01", message = "Las hectareas deben ser mayor a 0")
    private Double hectareas;

    private LocalDate fechaSiembra;
    private Boolean zonaCobertura;
    private Boolean alertasActivadas;
    private String estado;
    private LocalDateTime fechaRegistro;
    private Long usuarioId;
}