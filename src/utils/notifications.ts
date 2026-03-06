import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Alerta, Evento } from '@/types';

const ALARM_CHANNEL_ID = 'plantao-alarmes';

export async function ensureAlarmChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
      name: 'Lembretes de Plantão',
      description: 'Lembretes programados antes e durante os serviços',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250, 250, 250],
      sound: 'default',
      enableVibrate: true,
    });
  }
}

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
  await ensureAlarmChannel();
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedule (or re-schedule) all notifications for a single alerta across all events.
// Não agenda se alerta.ativo === false.
// Se alerta.servicoIds estiver definido e não vazio, só agenda para eventos desses serviços.
export async function scheduleAlertaForEvents(alerta: Alerta, eventos: Evento[]) {
  if (alerta.ativo === false) return;
  await ensureAlarmChannel();
  // Cancela todas as notificações deste alerta antes de reagendar (para refletir mudança de servicoIds)
  await cancelAlertaNotifications(alerta.id, eventos);
  const now = Date.now();
  const map = await readMap();

  const ids = alerta.servicoIds;
  const filterByServico = ids && ids.length > 0;
  const eventosFiltrados = filterByServico
    ? eventos.filter((ev) => ids!.includes(ev.servicoId))
    : eventos;

  for (const ev of eventosFiltrados) {
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

    const trigger: any = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    };
    if (Platform.OS === 'android') {
      trigger.channelId = ALARM_CHANNEL_ID;
    }

    const scheduledId = await Notifications.scheduleNotificationAsync({
      content: {
        title: alerta.titulo,
        body: `Lembrete: ${alerta.titulo}`,
        sound: true,
        ...(Platform.OS === 'android' && {
          priority: Notifications.AndroidNotificationPriority.MAX,
        }),
      },
      trigger,
    });

    // persist mapping so we can cancel later
    map[key] = scheduledId;
  }

  await writeMap(map);
}

// Re-schedule all alertas × all events (call on app start or after bulk changes).
// Só agenda alertas com ativo !== false.
export async function rescheduleAllAlertas(alertas: Alerta[], eventos: Evento[]) {
  for (const alerta of alertas) {
    if (alerta.ativo === false) continue;
    await scheduleAlertaForEvents(alerta, eventos);
  }
}

/**
 * URL para abrir o app Relógio/Alarme do celular.
 */
export function getOpenAlarmAppUrl(): string {
  if (Platform.OS === 'ios') return 'clock-alarm:';
  if (Platform.OS === 'android') {
    return 'intent://com.android.deskclock/alarm#Intent;package=com.android.deskclock;end';
  }
  return '';
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
