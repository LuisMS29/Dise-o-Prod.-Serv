export interface Cultivo {
  id?: number;
  tipoCultivo: string;
  ubicacion: string;
  latitud?: number;
  longitud?: number;
  hectareas?: number;
  fechaSiembra?: Date;
  zonaCobertura?: boolean;
  alertasActivadas?: boolean;
  estado?: string;
  fechaRegistro?: Date;
  usuarioId?: number;
}

export const TIPOS_CULTIVO = [
  'Papa',
  'Maiz',
  'Hortalizas',
  'Quinua',
  'Arroz',
  'Frijol',
  'Cafe',
  'Cana de Azucar',
  'Uva',
  'Palta',
  'Mango',
  'Limon'
];

export const DISTRITOS_LIMA = [
  'Carabayllo',
  'Huaral',
  'Canta',
  'Huacho',
  'Barranca',
  'Ancón',
  'Comas',
  'Los Olivos',
  'Puente Piedra',
  'San Martín de Porres'
];
