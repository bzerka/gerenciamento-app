import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Alerta } from '@/types';

const DEFAULT_LEMBRETES: Omit<Alerta, 'id'>[] = [
  { titulo: 'Lembrete 1', quando: 'antes', horasOffset: 12 },
  { titulo: 'Lembrete 2', quando: 'durante', horasOffset: 2 },
];

interface AlertaState {
  alertas: Alerta[];
  hasInitializedDefaults: boolean;
  addAlerta: (a: Omit<Alerta, 'id'>, id?: string) => string;
  updateAlerta: (id: string, data: Partial<Pick<Alerta, 'titulo' | 'quando' | 'horasOffset'>>) => void;
  removeAlerta: (id: string) => void;
  resetAlertas: () => void;
  initializeDefaultsIfNeeded: () => boolean;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useAlertaStore = create<AlertaState>()(
  persist(
    (set, get) => ({
      alertas: [],
      hasInitializedDefaults: false,
      addAlerta: (a, id) => {
        const newId = id ?? genId();
        set((s) => ({ alertas: [...s.alertas, { ...a, id: newId }] }));
        return newId;
      },
      updateAlerta: (id, data) =>
        set((s) => ({
          alertas: s.alertas.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      removeAlerta: (id) => set((s) => ({ alertas: s.alertas.filter((x) => x.id !== id) })),
      resetAlertas: () => set({ alertas: [], hasInitializedDefaults: false }),
      initializeDefaultsIfNeeded: () => {
        const { alertas, hasInitializedDefaults } = get();
        if (alertas.length > 0 || hasInitializedDefaults) return false;
        const newAlertas: Alerta[] = DEFAULT_LEMBRETES.map((d) => ({
          ...d,
          id: genId(),
        }));
        set({ alertas: newAlertas, hasInitializedDefaults: true });
        return true;
      },
    }),
    {
      name: 'alerta-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
