-- ============================================
-- AGROPREDICE PERU - SCRIPT COMPLETO DE BD
-- Ejecutar en MySQL Workbench
-- ============================================

USE agropredice_db;

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

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Usuario Admin (password: admin123)
INSERT INTO usuarios (nombre_completo, correo, telefono, password, rol, activo) VALUES 
('Administrador AgroPredice', 'admin@agropredice.pe', '+51999999999', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzQZ1QYQZ1QYQZ1QYQZ1QYQZ1Q', 'ADMIN', TRUE);

-- Usuarios de prueba (password: password123)
INSERT INTO usuarios (nombre_completo, correo, telefono, password, rol, modo_experto, audio_activado, activo) VALUES
('Juan Perez Garcia', 'juan.perez@email.com', '+51987654321', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzQZ1QYQZ1QYQZ1QYQZ1QYQZ1Q', 'AGRICULTOR', FALSE, TRUE, TRUE),
('Maria Lopez Torres', 'maria.lopez@email.com', '+51912345678', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzQZ1QYQZ1QYQZ1QYQZ1QYQZ1Q', 'AGRICULTOR', FALSE, TRUE, TRUE),
('Carlos Ruiz Mendoza', 'carlos.ruiz@email.com', '+51955556666', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzQZ1QYQZ1QYQZ1QYQZ1QYQZ1Q', 'AGRICULTOR', TRUE, TRUE, TRUE);

-- Cultivos de prueba
INSERT INTO cultivos (tipo_cultivo, ubicacion, latitud, longitud, hectareas, fecha_siembra, zona_cobertura, alertas_activadas, estado, usuario_id) VALUES
('Papa', 'Carabayllo, Lima Norte', -11.8500, -77.0500, 2.5, '2026-03-15', TRUE, TRUE, 'ACTIVO', 2),
('Maiz', 'Huaral, Lima', -11.5000, -77.2000, 5.0, '2026-02-20', TRUE, TRUE, 'ACTIVO', 2),
('Hortalizas', 'Canta, Lima', -11.4667, -76.6167, 1.8, '2026-04-01', TRUE, TRUE, 'ACTIVO', 3),
('Quinua', 'Huacho, Lima', -11.1000, -77.6000, 3.0, '2026-01-10', TRUE, TRUE, 'ACTIVO', 3),
('Papa', 'Barranca, Lima', -10.7500, -77.7667, 4.2, '2026-03-01', TRUE, TRUE, 'ACTIVO', 4);

-- Alertas de prueba (fechas fijas para evitar problemas)
INSERT INTO alertas (titulo, descripcion, nivel_riesgo, tipo_alerta, accion_recomendada, sms_enviado, audio_generado, leida, fecha_expiracion, usuario_id, cultivo_id) VALUES
('Alerta Roja! Helada inminente', 'Temperatura descendera bajo 0C con humedad 85% en las proximas 24h', 'ROJO', 'HELADA', 'Cubra sus cultivos con rastrojo y active sistema de riego por aspersion', TRUE, TRUE, FALSE, '2026-06-09 20:00:00', 2, 1),
('Alerta Amarilla. Lluvia intensa', 'Precipitaciones intensas pronosticadas en 48h en la zona de Huaral', 'AMARILLO', 'LLUVIA_INTENSA', 'Prepare drenajes y verifique canales de evacuacion', FALSE, TRUE, FALSE, '2026-06-09 20:00:00', 2, 2),
('Sin alertas', 'Condiciones favorables para sus cultivos de quinua', 'VERDE', 'SEQUIA', 'Continue con sus actividades normales de riego', FALSE, TRUE, TRUE, '2026-06-08 20:00:00', 3, 4);

-- Notificaciones de prueba
INSERT INTO notificaciones (telefono_destino, mensaje, tipo, estado, respuesta_proveedor, usuario_id, alerta_id) VALUES
('+51987654321', 'AGROPREDICE PERU - ALERTA ROJA - Helada inminente - Accion: Cubra sus cultivos con rastrojo', 'SMS', 'ENVIADO', 'SIMULACION_MVP1', 2, 1),
('+51912345678', 'AGROPREDICE PERU - ALERTA AMARILLA - Lluvia intensa - Accion: Prepare drenajes', 'SMS', 'PENDIENTE', NULL, 2, 2);

SELECT 'Base de datos AgroPredice Peru creada exitosamente' AS resultado;
