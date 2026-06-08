export interface Alerta {
  id?: number;
  titulo: string;
  descripcion: string;
  nivelRiesgo: 'VERDE' | 'AMARILLO' | 'ROJO';
  tipoAlerta: string;
  accionRecomendada?: string;
  smsEnviado?: boolean;
  audioGenerado?: boolean;
  leida?: boolean;
  fechaGeneracion?: Date;
  fechaExpiracion?: Date;
  usuarioId?: number;
  cultivoId?: number;
  nombreCultivo?: string;
  colorHex?: string;
  mensajeAudio?: string;
}

export interface EstadoSemaforo {
  nivelRiesgo: string;
  colorHex: string;
  mensajeAudio: string;
  titulo: string;
  descripcion: string;
  accionRecomendada: string;
}
