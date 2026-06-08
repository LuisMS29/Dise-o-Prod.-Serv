package com.agropredice.service;

import com.agropredice.model.Alerta;
import com.agropredice.model.Notificacion;
import com.agropredice.model.Usuario;
import com.agropredice.repository.NotificacionRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de Notificaciones - Envio de SMS via Twilio
 * MVP1: Alertas por SMS para agricultores
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        if (!accountSid.equals("ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio inicializado correctamente");
        } else {
            log.warn("Twilio no configurado. Usando modo simulacion.");
        }
    }

    @Transactional
    public void enviarSMSAlerta(Usuario usuario, Alerta alerta) {
        String mensaje = construirMensajeSMS(alerta);

        Notificacion notificacion = Notificacion.builder()
                .telefonoDestino(usuario.getTelefono())
                .mensaje(mensaje)
                .tipo(Notificacion.TipoNotificacion.SMS)
                .usuario(usuario)
                .alerta(alerta)
                .build();

        try {
            if (!accountSid.equals("ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")) {
                // Enviar SMS real via Twilio
                Message message = Message.creator(
                        new PhoneNumber(usuario.getTelefono()),
                        new PhoneNumber(twilioPhoneNumber),
                        mensaje
                ).create();

                notificacion.setEstado(Notificacion.EstadoNotificacion.ENVIADO);
                notificacion.setRespuestaProveedor(message.getSid());
                alerta.setSmsEnviado(true);

                log.info("SMS enviado a {}. SID: {}", usuario.getTelefono(), message.getSid());
            } else {
                // Modo simulacion (para desarrollo sin credenciales Twilio)
                notificacion.setEstado(Notificacion.EstadoNotificacion.ENVIADO);
                notificacion.setRespuestaProveedor("SIMULACION_MVP1");
                alerta.setSmsEnviado(true);

                log.info("[SIMULACION] SMS enviado a {}: {}", usuario.getTelefono(), mensaje);
            }
        } catch (Exception e) {
            notificacion.setEstado(Notificacion.EstadoNotificacion.FALLIDO);
            notificacion.setRespuestaProveedor(e.getMessage());
            log.error("Error enviando SMS a {}: {}", usuario.getTelefono(), e.getMessage());
        }

        notificacionRepository.save(notificacion);
    }

    private String construirMensajeSMS(Alerta alerta) {
        StringBuilder sb = new StringBuilder();
        sb.append("¡AGROPREDICE PERU!");

        switch (alerta.getNivelRiesgo()) {
            case ROJO:
                sb.append("🚨 ALERTA ROJA 🚨");
                break;
            case AMARILLO:
                sb.append("⚠️ ALERTA AMARILLA ⚠️");
                break;
            default:
                sb.append("ℹ️ INFORMACION ℹ️");
        }

        sb.append(alerta.getTitulo()).append("");
        sb.append("Accion: ").append(alerta.getAccionRecomendada()).append("");
        sb.append("Ver mas en: https://agropredice.pe/alertas");

        return sb.toString();
    }
}