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
