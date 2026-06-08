package com.agropredice.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Respuesta estandarizada de la API
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean exito;
    private String mensaje;
    private T data;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> ok(T data, String mensaje) {
        return ApiResponse.<T>builder()
                .exito(true)
                .mensaje(mensaje)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String mensaje) {
        return ApiResponse.<T>builder()
                .exito(false)
                .mensaje(mensaje)
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
}