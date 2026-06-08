package com.agropredice.service;

import com.agropredice.dto.CultivoDTO;
import com.agropredice.dto.ApiResponse;
import com.agropredice.model.Cultivo;
import com.agropredice.model.Usuario;
import com.agropredice.repository.CultivoRepository;
import com.agropredice.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Cultivos - Logica de negocio de cultivos
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CultivoService {

    private final CultivoRepository cultivoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ApiResponse<CultivoDTO> registrarCultivo(Long usuarioId, CultivoDTO request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cultivo cultivo = Cultivo.builder()
                .tipoCultivo(request.getTipoCultivo())
                .ubicacion(request.getUbicacion())
                .latitud(request.getLatitud())
                .longitud(request.getLongitud())
                .hectareas(request.getHectareas())
                .fechaSiembra(request.getFechaSiembra())
                .usuario(usuario)
                .build();

        // Validar zona de cobertura automaticamente
        cultivo.validarZona();

        Cultivo guardado = cultivoRepository.save(cultivo);
        log.info("Cultivo registrado: {} para usuario {}", guardado.getTipoCultivo(), usuario.getTelefono());

        String mensaje = guardado.getZonaCobertura()
                ? "Cultivo registrado. Alertas personalizadas activadas para esta zona"
                : "Cultivo registrado. Zona no disponible para alertas precisas. Use modo SMS basico";

        return ApiResponse.ok(toDTO(guardado), mensaje);
    }

    public ApiResponse<List<CultivoDTO>> obtenerCultivosPorUsuario(Long usuarioId) {
        List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuarioId);
        List<CultivoDTO> dtos = cultivos.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos, "Cultivos obtenidos correctamente");
    }

    public ApiResponse<CultivoDTO> obtenerCultivoPorId(Long id) {
        Cultivo cultivo = cultivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cultivo no encontrado"));
        return ApiResponse.ok(toDTO(cultivo), "Cultivo encontrado");
    }

    @Transactional
    public ApiResponse<Void> eliminarCultivo(Long id) {
        Cultivo cultivo = cultivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cultivo no encontrado"));
        cultivoRepository.delete(cultivo);
        return ApiResponse.ok(null, "Cultivo eliminado correctamente");
    }

    public ApiResponse<List<CultivoDTO>> obtenerCultivosEnZonaCobertura() {
        List<Cultivo> cultivos = cultivoRepository.findActivosEnZonaCobertura();
        List<CultivoDTO> dtos = cultivos.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos, "Cultivos en zona de cobertura obtenidos");
    }

    private CultivoDTO toDTO(Cultivo cultivo) {
        return CultivoDTO.builder()
                .id(cultivo.getId())
                .tipoCultivo(cultivo.getTipoCultivo())
                .ubicacion(cultivo.getUbicacion())
                .latitud(cultivo.getLatitud())
                .longitud(cultivo.getLongitud())
                .hectareas(cultivo.getHectareas())
                .fechaSiembra(cultivo.getFechaSiembra())
                .zonaCobertura(cultivo.getZonaCobertura())
                .alertasActivadas(cultivo.getAlertasActivadas())
                .estado(cultivo.getEstado())
                .fechaRegistro(cultivo.getFechaRegistro())
                .usuarioId(cultivo.getUsuario().getId())
                .build();
    }
}