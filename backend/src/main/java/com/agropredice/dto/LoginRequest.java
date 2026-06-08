package com.agropredice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "El telefono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Telefono invalido")
    private String telefono;

    @NotBlank(message = "La contrasena es obligatoria")
    private String password;
}