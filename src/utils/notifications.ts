import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Alerta, Evento } from '@/types';

// Logical key for a mapping between our alerta-evento pair and the OS scheduled id
function notifKey(alertaId: string, eventoId: string) {
  return `alerta-${alertaId}-evento-${eventoId}`;
}

const MAP_KEY = 'scheduled_notifications_map_v1';

async function readMap(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function writeMap(m: Record<string, string>) {
  try {
    await AsyncStorage.setItem(MAP_KEY, JSON.stringify(m));
  } catch {
    // ignore
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedule (or re-schedule) all notifications for a single alerta across all events.
export async function scheduleAlertaForEvents(alerta: Alerta, eventos: Evento[]) {
  const now = Date.now();
  const map = await readMap();

  for (const ev of eventos) {
    if (!ev.inicio) continue;

    // Build event start in local timezone using the unambiguous Date constructor
    // (avoids the ISO-string UTC interpretation issue on iOS Safari/JSC)
    const [hh, mm] = ev.inicio.split(':').map(Number);
    const eventStart = new Date(
      Number(ev.data.slice(0, 4)),
      Number(ev.data.slice(5, 7)) - 1,
      Number(ev.data.slice(8, 10)),
      hh, mm, 0, 0
    );

    const offsetMs = (alerta.horasOffset ?? 2) * 60 * 60 * 1000;
    const triggerDate =
      alerta.quando === 'antes'
        ? new Date(eventStart.getTime() - offsetMs)
        : new Date(eventStart.getTime() + offsetMs);

    // Skip if trigger time is already in the past
    if (triggerDate.getTime() <= now) continue;

    const key = notifKey(alerta.id, ev.id);

    // If we already have a scheduled id for this key, cancel it first
    const existingScheduledId = map[key];
    if (existingScheduledId) {
      await Notifications.cancelScheduledNotificationAsync(existingScheduledId).catch(() => {});
    }

    const scheduledId = await Notifications.scheduleNotificationAsync({
      content: {
        title: alerta.titulo,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      } as any,
    });

    // persist mapping so we can cancel later
    map[key] = scheduledId;
  }

  await writeMap(map);
}

// Re-schedule all alertas × all events (call on app start or after bulk changes).
export async function rescheduleAllAlertas(alertas: Alerta[], eventos: Evento[]) {
  for (const alerta of alertas) {
    await scheduleAlertaForEvents(alerta, eventos);
  }
}

// Cancel all notifications tied to a specific alerta.
export async function cancelAlertaNotifications(alertaId: string, eventos: Evento[]) {
  const map = await readMap();
  let changed = false;
  for (const ev of eventos) {
    const key = notifKey(alertaId, ev.id);
    const scheduledId = map[key];
    if (scheduledId) {
      await Notifications.cancelScheduledNotificationAsync(scheduledId).catch(() => {});
      delete map[key];
      changed = true;
    }
  }
  if (changed) await writeMap(map);
}

// Cancel all notifications tied to a specific event (e.g. when event is deleted).
export async function cancelEventNotifications(eventoId: string, alertas: Alerta[]) {
  const map = await readMap();
  let changed = false;
  for (const alerta of alertas) {
    const key = notifKey(alerta.id, eventoId);
    const scheduledId = map[key];
    if (scheduledId) {
      await Notifications.cancelScheduledNotificationAsync(scheduledId).catch(() => {});
      delete map[key];
      changed = true;
    }
  }
  if (changed) await writeMap(map);
}
