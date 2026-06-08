export interface Usuario {
  id?: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  password?: string;
  rol?: string;
  modoExperto?: boolean;
  audioActivado?: boolean;
  activo?: boolean;
  fechaRegistro?: Date;
  token?: string;
}

export interface LoginRequest {
  telefono: string;
  password: string;
}
