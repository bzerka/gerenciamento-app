export type Turno = 'manha' | 'tarde' | 'noite';

export interface Escala {
  id: string;
  titulo: string;
  data: string;
  turno: Turno;
}

export interface Servico {
  id: string;
  nome: string;
  cor: string; // hex
  turnos?: Record<number, { ativo: boolean; valor?: number }>; // duracaoHoras -> config
}

export interface Alerta {
  id: string;
  titulo: string;
  quando: 'antes' | 'durante';
  // Number of hours offset. If `quando === 'antes'` this is hours before start,
  // if `quando === 'durante'` this is hours after start.
  horasOffset?: number;
}

export interface Evento {
  id: string;
  data: string; // ISO date (yyyy-mm-dd)
  servicoId: string;
  inicio?: string; // HH:mm
  duracaoHoras?: number;
  local?: string;
  valor?: number;
  pago?: boolean;
  notas?: string;
}
