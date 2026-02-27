import { addDays, addMonths } from 'date-fns';

export const SCALE_TYPES = [
  { value: '12x36', label: '12x36 (12h trabalho, 36h folga)' },
  { value: '12x48', label: '12x48 (12h trabalho, 48h folga)' },
  { value: '12x60', label: '12x60 (12h trabalho, 60h folga)' },
  { value: '24x48', label: '24x48 (24h trabalho, 48h folga)' },
  { value: '24x72', label: '24x72 (24h trabalho, 72h folga)' },
  { value: '24x96', label: '24x96 (24h trabalho, 96h folga)' },
  { value: '12x24x12x72', label: '12x24x12x72 (alternado)' },
];

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
  tipo: string,
  startDate: Date,
  diaFolhaExtra: number | null,
): Date[] {
  const endDate = addMonths(startDate, 5);
  const days: Date[] = [];
  let current = new Date(startDate);
  let offset = 0;

  while (current <= endDate) {
    let isWork = false;
    const dow = current.getDay();
    const o = offset;

    switch (tipo) {
      case '12x36':
        isWork = o % 2 === 0;
        break;
      case '12x48':
        isWork = o % 5 === 0 || o % 5 === 2;
        break;
      case '12x60':
        isWork = o % 3 === 0;
        break;
      case '24x48':
        isWork = o % 3 === 0;
        break;
      case '24x72':
        isWork = o % 4 === 0;
        break;
      case '24x96':
        isWork = o % 5 === 0;
        break;
      case '12x24x12x72':
        isWork = o % 5 === 0 || o % 5 === 1;
        break;
      default:
        isWork = o % 2 === 0;
    }

    if (diaFolhaExtra !== null && dow === diaFolhaExtra) isWork = false;
    if (isWork) days.push(new Date(current));

    current = addDays(current, 1);
    offset++;
  }

  return days;
}

export function turnoHoursForTipo(tipo: string): number {
  switch (tipo) {
    case '12x36':
    case '12x48':
    case '12x60':
    case '12x24x12x72':
      return 12;
    case '24x48':
    case '24x72':
    case '24x96':
      return 24;
    case '5x2':
    case '6x1':
    default:
      return 8;
  }
}
