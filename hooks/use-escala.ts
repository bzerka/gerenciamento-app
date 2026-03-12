import { useEffect, useState } from 'react';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import { fetchSchedulesFromFirebase } from '@/src/lib/escalas-remote';
import {
  generateWorkDays,
  turnoHoursForTipo,
  type ScheduleDef,
} from '@/src/utils/escala';
import { addMonths, format } from 'date-fns';

export type UseScheduleResult = {
  workSchedule: ScheduleDef[];
  loading: boolean;
  getScheduleDef: (tipo: string) => ScheduleDef | undefined;
  applySchedule: (params: ApplyScheduleParams) => void;
};

export type ApplyScheduleParams = {
  startDate: Date;
  horaInicio: string;
  diaFolhaExtra: number | null;
  scheduleDef: ScheduleDef | null | undefined;
};

/**
 * Hook único para escala de trabalho:
 * - Busca a lista de tipos no Firebase (appConfig/escalas).
 * - Expõe applySchedule() para persistir a config e preencher a agenda com os dias de trabalho.
 */
export function useSchedule(): UseScheduleResult {
  const [workSchedule, setWorkSchedule] = useState<ScheduleDef[]>([]);
  const [loading, setLoading] = useState(true);

  const servicos = useServicoStore((s) => s.servicos);
  const eventos = useEventoStore((s) => s.eventos);
  const addEvento = useEventoStore((s) => s.addEvento);
  const removeEvento = useEventoStore((s) => s.removeEvento);

  useEffect(() => {
    let cancelled = false;
    fetchSchedulesFromFirebase().then((list) => {
      if (!cancelled) {
        setWorkSchedule(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const getScheduleDef = (tipo: string) => workSchedule.find((s) => s.value === tipo);

  function applySchedule({ startDate, horaInicio, diaFolhaExtra, scheduleDef }: ApplyScheduleParams) {
    const normalServico =
      servicos.find((s) => s.nome.toLowerCase() === 'normal') ?? servicos[0];
    if (!normalServico) return;

    const endDate = addMonths(startDate, 5);
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');

    const removedIds = new Set<string>();
    for (const ev of eventos) {
      if (ev.servicoId === normalServico.id && ev.data >= startStr && ev.data <= endStr) {
        removeEvento(ev.id);
        removedIds.add(ev.id);
      }
    }

    const existingDates = new Set(
      eventos
        .filter((e) => e.servicoId === normalServico.id && !removedIds.has(e.id))
        .map((e) => e.data)
    );

    const turno = turnoHoursForTipo(scheduleDef);
    const workDays = generateWorkDays(startDate, diaFolhaExtra, scheduleDef);

    for (const day of workDays) {
      const dateStr = format(day, 'yyyy-MM-dd');
      if (!existingDates.has(dateStr)) {
        addEvento({
          data: dateStr,
          servicoId: normalServico.id,
          duracaoHoras: turno,
          inicio: horaInicio,
        });
        existingDates.add(dateStr);
      }
    }
  }

  return { workSchedule, loading, getScheduleDef, applySchedule };
}
