-- ============================================
-- AGROPREDICE PERU - DATOS DE PRUEBA MVP1
-- ============================================

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

-- Alertas de prueba (usando TIMESTAMPADD en vez de DATE_ADD)
INSERT INTO alertas (titulo, descripcion, nivel_riesgo, tipo_alerta, accion_recomendada, sms_enviado, audio_generado, leida, fecha_expiracion, usuario_id, cultivo_id) VALUES
('Alerta Roja! Helada inminente', 'Temperatura descendera bajo 0C con humedad 85% en las proximas 24h', 'ROJO', 'HELADA', 'Cubra sus cultivos con rastrojo y active sistema de riego por aspersion', TRUE, TRUE, FALSE, TIMESTAMPADD(HOUR, 48, NOW()), 2, 1),
('Alerta Amarilla. Lluvia intensa', 'Precipitaciones intensas pronosticadas en 48h en la zona de Huaral', 'AMARILLO', 'LLUVIA_INTENSA', 'Prepare drenajes y verifique canales de evacuacion', FALSE, TRUE, FALSE, TIMESTAMPADD(HOUR, 48, NOW()), 2, 2),
('Sin alertas', 'Condiciones favorables para sus cultivos de quinua', 'VERDE', 'SEQUIA', 'Continue con sus actividades normales de riego', FALSE, TRUE, TRUE, TIMESTAMPADD(HOUR, 24, NOW()), 3, 4);

-- Notificaciones de prueba
INSERT INTO notificaciones (telefono_destino, mensaje, tipo, estado, respuesta_proveedor, usuario_id, alerta_id) VALUES
('+51987654321', 'AGROPREDICE PERU - ALERTA ROJA - Helada inminente - Accion: Cubra sus cultivos con rastrojo', 'SMS', 'ENVIADO', 'SIMULACION_MVP1', 2, 1),
('+51912345678', 'AGROPREDICE PERU - ALERTA AMARILLA - Lluvia intensa - Accion: Prepare drenajes', 'SMS', 'PENDIENTE', NULL, 2, 2);
