-- ============================================================
-- AGROPREDICE PERU - SCRIPT COMPLETO DE BASE DE DATOS
-- MySQL 8.0 - MVP1
-- Ejecutar todo este script en MySQL Workbench o línea de comandos
-- ============================================================

-- 1. CREAR BASE DE DATOS (si no existe)
DROP DATABASE IF EXISTS agropredice_db;
CREATE DATABASE agropredice_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE agropredice_db;

-- ============================================================
-- 2. TABLA: USUARIOS (Agricultores)
-- ============================================================
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL COMMENT 'Nombre del agricultor',
    correo VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico único',
    telefono VARCHAR(15) NOT NULL UNIQUE COMMENT 'Teléfono para SMS de alertas',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con BCrypt',
    rol ENUM('ADMIN', 'AGRICULTOR') DEFAULT 'AGRICULTOR' COMMENT 'Rol del usuario',
    modo_experto BOOLEAN DEFAULT FALSE COMMENT 'Modo experto: muestra datos técnicos',
    audio_activado BOOLEAN DEFAULT TRUE COMMENT 'Alertas por audio activadas',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Usuario activo/inactivo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_telefono (telefono),
    INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabla de agricultores registrados en el sistema';

-- ============================================================
-- 3. TABLA: CULTIVOS
-- ============================================================
CREATE TABLE cultivos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_cultivo VARCHAR(50) NOT NULL COMMENT 'Tipo: Papa, Maíz, Hortalizas, etc.',
    ubicacion VARCHAR(200) NOT NULL COMMENT 'Distrito o ubicación del cultivo',
    latitud DECIMAL(10, 8) COMMENT 'Coordenada GPS latitud',
    longitud DECIMAL(11, 8) COMMENT 'Coordenada GPS longitud',
    hectareas DECIMAL(10, 2) COMMENT 'Extensión en hectáreas',
    fecha_siembra DATE COMMENT 'Fecha de siembra del cultivo',
    zona_cobertura BOOLEAN DEFAULT TRUE COMMENT '¿Está en zona SENAMHI?',
    alertas_activadas BOOLEAN DEFAULT TRUE COMMENT 'Alertas activadas para este cultivo',
    estado VARCHAR(20) DEFAULT 'ACTIVO' COMMENT 'ACTIVO o INACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_cultivo (usuario_id),
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_zona_cobertura (zona_cobertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cultivos registrados por los agricultores';

-- ============================================================
-- 4. TABLA: ALERTAS CLIMÁTICAS
-- ============================================================
CREATE TABLE alertas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL COMMENT 'Título de la alerta',
    descripcion VARCHAR(500) NOT NULL COMMENT 'Descripción detallada',
    nivel_riesgo ENUM('VERDE', 'AMARILLO', 'ROJO') NOT NULL 
        COMMENT 'VERDE=Seguro, AMARILLO=Precaución, ROJO=Peligro',
    tipo_alerta ENUM('HELADA', 'LLUVIA_INTENSA', 'SEQUIA', 'VIENTO_FUERTE', 'CALOR_EXTREMO', 'PLAGA') 
        NOT NULL COMMENT 'Tipo de evento climático',
    accion_recomendada VARCHAR(300) COMMENT 'Qué hacer ante la alerta',
    sms_enviado BOOLEAN DEFAULT FALSE COMMENT '¿Se envió SMS?',
    audio_generado BOOLEAN DEFAULT FALSE COMMENT '¿Se generó audio?',
    leida BOOLEAN DEFAULT FALSE COMMENT '¿El usuario la leyó?',
    fecha_expiracion TIMESTAMP COMMENT 'Cuándo expira la alerta',
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    cultivo_id BIGINT COMMENT 'Cultivo asociado (puede ser NULL)',

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (cultivo_id) REFERENCES cultivos(id) ON DELETE SET NULL,
    INDEX idx_alerta_usuario (usuario_id),
    INDEX idx_alerta_nivel (nivel_riesgo),
    INDEX idx_alerta_fecha (fecha_generacion),
    INDEX idx_alerta_leida (leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Alertas climáticas generadas por el sistema';

-- ============================================================
-- 5. TABLA: NOTIFICACIONES (SMS enviados)
-- ============================================================
CREATE TABLE notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    telefono_destino VARCHAR(15) NOT NULL COMMENT 'Teléfono que recibió el SMS',
    mensaje VARCHAR(500) NOT NULL COMMENT 'Contenido del mensaje SMS',
    tipo ENUM('SMS', 'EMAIL', 'PUSH') DEFAULT 'SMS' COMMENT 'Tipo de notificación',
    estado ENUM('PENDIENTE', 'ENVIADO', 'FALLIDO', 'ENTREGADO') DEFAULT 'PENDIENTE',
    respuesta_proveedor VARCHAR(500) COMMENT 'Respuesta de Twilio u otro proveedor',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    alerta_id BIGINT COMMENT 'Alerta asociada',

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (alerta_id) REFERENCES alertas(id) ON DELETE SET NULL,
    INDEX idx_notif_usuario (usuario_id),
    INDEX idx_notif_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de notificaciones SMS enviadas';

-- ============================================================
-- 6. DATOS DE PRUEBA
-- ============================================================

-- Usuario Administrador (password: admin123 encriptado con BCrypt)
INSERT INTO usuarios (nombre_completo, correo, telefono, password, rol, activo) 
VALUES (
    'Administrador AgroPredice', 
    'admin@agropredice.pe', 
    '+51999999999', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzQZ1QYQZ1QYQZ1QYQZ1QYQZ1Q', 
    'ADMIN', 
    TRUE
);

-- Usuarios de prueba (password: password123 encriptado con BCrypt)
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

-- Alertas de prueba
INSERT INTO alertas (titulo, descripcion, nivel_riesgo, tipo_alerta, accion_recomendada, sms_enviado, audio_generado, leida, fecha_expiracion, usuario_id, cultivo_id) VALUES
('Alerta Roja! Helada inminente', 'Temperatura descendera bajo 0C con humedad 85% en las proximas 24h', 'ROJO', 'HELADA', 'Cubra sus cultivos con rastrojo y active sistema de riego por aspersion', TRUE, TRUE, FALSE, DATE_ADD(NOW(), INTERVAL 48 HOUR), 2, 1),
('Alerta Amarilla. Lluvia intensa', 'Precipitaciones intensas pronosticadas en 48h en la zona de Huaral', 'AMARILLO', 'LLUVIA_INTENSA', 'Prepare drenajes y verifique canales de evacuacion', FALSE, TRUE, FALSE, DATE_ADD(NOW(), INTERVAL 48 HOUR), 2, 2),
('Sin alertas', 'Condiciones favorables para sus cultivos de quinua', 'VERDE', 'SEQUIA', 'Continue con sus actividades normales de riego', FALSE, TRUE, TRUE, DATE_ADD(NOW(), INTERVAL 24 HOUR), 3, 4);

-- Notificaciones de prueba (SMS)
INSERT INTO notificaciones (telefono_destino, mensaje, tipo, estado, respuesta_proveedor, usuario_id, alerta_id) VALUES
('+51987654321', 'AGROPREDICE PERU - ALERTA ROJA - Helada inminente - Accion: Cubra sus cultivos con rastrojo', 'SMS', 'ENVIADO', 'SIMULACION_MVP1', 2, 1),
('+51912345678', 'AGROPREDICE PERU - ALERTA AMARILLA - Lluvia intensa - Accion: Prepare drenajes', 'SMS', 'PENDIENTE', NULL, 2, 2);

-- ============================================================
-- 7. VERIFICACIÓN
-- ============================================================
SELECT '=== AGROPREDICE PERU - BASE DE DATOS CREADA ===' AS resultado;
SELECT CONCAT('Total usuarios: ', COUNT(*)) FROM usuarios;
SELECT CONCAT('Total cultivos: ', COUNT(*)) FROM cultivos;
SELECT CONCAT('Total alertas: ', COUNT(*)) FROM alertas;
SELECT CONCAT('Total notificaciones: ', COUNT(*)) FROM notificaciones;

-- Ver usuarios creados
SELECT id, nombre_completo, telefono, rol, activo FROM usuarios;

-- Ver cultivos creados
SELECT c.id, c.tipo_cultivo, c.ubicacion, c.hectareas, u.nombre_completo AS agricultor 
FROM cultivos c 
JOIN usuarios u ON c.usuario_id = u.id;

-- Ver alertas creadas
SELECT a.id, a.titulo, a.nivel_riesgo, a.tipo_alerta, a.sms_enviado, u.nombre_completo 
FROM alertas a 
JOIN usuarios u ON a.usuario_id = u.id;
