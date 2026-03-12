import { addDays, addMonths } from 'date-fns';

export type ScheduleDef = {
  value: string
  label: string
  workHours: number
  cycleLength: number
  workOffsets: number[]
  order?: number
};

export const WEEK_DAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
];

export function parseDate(str: string): Date | null {
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || y < 2000 || y > 2100) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

export function generateWorkDays(
  startDate: Date,
  diaFolhaExtra: number | null,
  scheduleDef: ScheduleDef | null | undefined,
): Date[] {
  if (!scheduleDef || scheduleDef.cycleLength <= 0 || !scheduleDef.workOffsets?.length) return [];

  const endDate = addMonths(startDate, 5);
  const days: Date[] = [];
  let current = new Date(startDate);
  let offset = 0;

  while (current <= endDate) {
    const dow = current.getDay();
    const isWork = scheduleDef.workOffsets.includes(offset % scheduleDef.cycleLength)
      && (diaFolhaExtra === null || dow !== diaFolhaExtra);
    if (isWork) days.push(new Date(current));

    current = addDays(current, 1);
    offset++;
  }

  return days;
}

export function turnoHoursForTipo(scheduleDef: ScheduleDef | null | undefined): number {
  if (!scheduleDef?.workHours || scheduleDef.workHours <= 0) return 0;
  return scheduleDef.workHours;
}
