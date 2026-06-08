package com.agropredice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO para Usuario - Transferencia de datos segura
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {

    private Long id;

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombreCompleto;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo invalido")
    private String correo;

    @NotBlank(message = "El telefono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Telefono invalido. Minimo 9 digitos")
    private String telefono;

    private String rol;
    private Boolean modoExperto;
    private Boolean audioActivado;
    private Boolean activo;
    private LocalDateTime fechaRegistro;

    // Para registro
    @Size(min = 6, message = "La contrasena debe tener al menos 6 caracteres")
    private String password;

    // Para login
    private String token;
}