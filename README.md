# 🌾 AgroPredice Peru

**Sistema Inteligente de Alertas Climaticas para Agricultores**

Proyecto Final - Curso de Diseno de Productos y Servicios
Universidad Tecnologica del Peru (UTP) - 2026

## 👥 Integrantes
- Ventocilla Carbajal Omar Elder - U24248244
- Martinez Juarez Wilinton - U24249376
- Marcaquispe Sulca Luis Angel - U23214796

## 🏗️ Arquitectura de 5 Capas

```
┌─────────────────────────────────────────┐
│           VISTA (Angular 17)             │
│  - Componentes standalone                │
│  - Angular Material                      │
│  - Sistema Semaforo + Audio              │
├─────────────────────────────────────────┤
│      CONTROLADOR (Spring Boot REST)     │
│  - AuthController                        │
│  - CultivoController                     │
│  - AlertaController                      │
├─────────────────────────────────────────┤
│      SERVICIO (Spring Boot Services)     │
│  - AuthService                           │
│  - CultivoService                        │
│  - AlertaService                         │
│  - NotificacionService (SMS Twilio)      │
├─────────────────────────────────────────┤
│         MODELO (JPA/Hibernate)           │
│  - Usuario, Cultivo, Alerta, Notificacion │
├─────────────────────────────────────────┤
│      BASE DE DATOS (MySQL 8.0 + HikariCP)│
│  - Flyway Migrations                     │
│  - Indices espaciales                    │
├─────────────────────────────────────────┤
│   INTEGRACION IA (Python Flask - MVP2)  │
│  - Preparado para TensorFlow             │
│  - APIs externas (SENAMHI)               │
└─────────────────────────────────────────┘
```

## 🚀 Instrucciones de Instalacion

### Requisitos
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### 1. Base de Datos
```bash
# Ejecutar el script SQL
mysql -u root -p < database/schema_completo.sql
```

### 2. Backend (Spring Boot)
```bash
cd backend
# Configurar application.properties con tus credenciales MySQL
mvn clean install
mvn spring-boot:run
# Servidor en: http://localhost:8080
```

### 3. Frontend (Angular)
```bash
cd frontend
npm install
ng serve
# Aplicacion en: http://localhost:4200
```

## 📱 Funcionalidades MVP1

| Historia | Descripcion | Estado |
|----------|-------------|--------|
| HU-01 | Registro de Usuario | ✅ Implementado |
| HU-04 | Registro de Cultivos | ✅ Implementado |
| HU-05 | Alertas Climaticas por SMS | ✅ Implementado (Twilio) |
| HU-06 | Sistema Semaforo de Riesgo | ✅ Implementado |
| HU-08 | Alertas por Audio | ✅ Implementado (Web Speech API) |

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Verde Oscuro | #2E7D32 | Alerta baja / Exito |
| Amarillo | #FFD740 | Alerta media / Precaucion |
| Rojo | #FF5252 | Alerta alta / Emergencia |
| Azul | #1976D2 | Botones principales |
| Naranja | #FF6F00 | Boton IA / Accion destacada |

## 🔐 Credenciales de Prueba
- Telefono: +51987654321
- Password: password123

## 📡 API Endpoints

### Autenticacion
- `POST /api/auth/registro` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/perfil` - Perfil del usuario

### Cultivos
- `POST /api/cultivos` - Registrar cultivo
- `GET /api/cultivos` - Listar cultivos
- `DELETE /api/cultivos/{id}` - Eliminar cultivo

### Alertas
- `GET /api/alertas` - Listar alertas
- `GET /api/alertas/activas` - Alertas activas
- `GET /api/alertas/semaforo` - Estado del semaforo
- `PUT /api/alertas/{id}/leida` - Marcar como leida

## 📄 Licencia
Proyecto academico - UTP 2026
