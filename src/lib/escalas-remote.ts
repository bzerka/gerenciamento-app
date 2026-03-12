import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { ScheduleDef } from '@/src/utils/escala';

const ESCALAS_CONFIG = {
  collection: 'appConfig',
  documentId: 'escalas',
  fieldList: 'list',
} as const;

type RawScheduleItem = {
  value?: string;
  label?: string;
  workHours?: number;
  cycleLength?: number;
  workOffsets?: number[];
  order?: number;
};

function parseScheduleDef(raw: RawScheduleItem): ScheduleDef | null {
  if (!raw || typeof raw.value !== 'string' || typeof raw.label !== 'string') return null;
  const value = raw.value.trim();
  const label = String(raw.label).trim();
  if (!value || !label) return null;
  const workHours = typeof raw.workHours === 'number' && raw.workHours > 0 ? raw.workHours : 12;
  const cycleLength = typeof raw.cycleLength === 'number' && raw.cycleLength > 0 ? raw.cycleLength : 2;
  const workOffsets = Array.isArray(raw.workOffsets)
    ? raw.workOffsets.filter((n) => typeof n === 'number' && n >= 0 && n < cycleLength)
    : [0];
  if (workOffsets.length === 0) return null;
  const order = typeof raw.order === 'number' && Number.isFinite(raw.order) ? raw.order : undefined;
  return { value, label, workHours, cycleLength, workOffsets, order };
}

/**
 * Busca a lista de tipos de escala no Firestore (appConfig/escalas, campo "list").
 */
export async function fetchSchedulesFromFirebase(): Promise<ScheduleDef[]> {
  try {
    const ref = doc(db, ESCALAS_CONFIG.collection, ESCALAS_CONFIG.documentId);
    const snap = await getDoc(ref);
    const list = snap.exists() ? snap.data()?.[ESCALAS_CONFIG.fieldList] : undefined;
    if (!Array.isArray(list) || list.length === 0) return [];
    const parsed: ScheduleDef[] = [];
    for (const item of list) {
      const def = parseScheduleDef(item as RawScheduleItem);
      if (def) parsed.push(def);
    }
    parsed.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return parsed;
  } catch {
    return [];
  }
}
