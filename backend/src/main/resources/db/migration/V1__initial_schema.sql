-- ============================================
-- AGROPREDICE PERU - ESQUEMA INICIAL MVP1
-- MySQL 8.0 con indices espaciales
-- ============================================

-- Tabla de Usuarios (Agricultores)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'AGRICULTOR') DEFAULT 'AGRICULTOR',
    modo_experto BOOLEAN DEFAULT FALSE,
    audio_activado BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_telefono (telefono),
    INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Cultivos
CREATE TABLE IF NOT EXISTS cultivos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_cultivo VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    hectareas DECIMAL(10, 2),
    fecha_siembra DATE,
    zona_cobertura BOOLEAN DEFAULT TRUE,
    alertas_activadas BOOLEAN DEFAULT TRUE,
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_cultivo (usuario_id),
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_zona_cobertura (zona_cobertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Alertas Climaticas
CREATE TABLE IF NOT EXISTS alertas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    nivel_riesgo ENUM('VERDE', 'AMARILLO', 'ROJO') NOT NULL,
    tipo_alerta ENUM('HELADA', 'LLUVIA_INTENSA', 'SEQUIA', 'VIENTO_FUERTE', 'CALOR_EXTREMO', 'PLAGA') NOT NULL,
    accion_recomendada VARCHAR(300),
    sms_enviado BOOLEAN DEFAULT FALSE,
    audio_generado BOOLEAN DEFAULT FALSE,
    leida BOOLEAN DEFAULT FALSE,
    fecha_expiracion TIMESTAMP,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    cultivo_id BIGINT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (cultivo_id) REFERENCES cultivos(id) ON DELETE SET NULL,
    INDEX idx_alerta_usuario (usuario_id),
    INDEX idx_alerta_nivel (nivel_riesgo),
    INDEX idx_alerta_fecha (fecha_generacion),
    INDEX idx_alerta_leida (leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Notificaciones (SMS)
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    telefono_destino VARCHAR(15) NOT NULL,
    mensaje VARCHAR(500) NOT NULL,
    tipo ENUM('SMS', 'EMAIL', 'PUSH') DEFAULT 'SMS',
    estado ENUM('PENDIENTE', 'ENVIADO', 'FALLIDO', 'ENTREGADO') DEFAULT 'PENDIENTE',
    respuesta_proveedor VARCHAR(500),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    alerta_id BIGINT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (alerta_id) REFERENCES alertas(id) ON DELETE SET NULL,
    INDEX idx_notif_usuario (usuario_id),
    INDEX idx_notif_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
