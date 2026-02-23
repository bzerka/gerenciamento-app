import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Alerta } from '@/types';

interface AlertaState {
  alertas: Alerta[];
  addAlerta: (a: Omit<Alerta, 'id'>, id?: string) => string;
  removeAlerta: (id: string) => void;
  resetAlertas: () => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useAlertaStore = create<AlertaState>()(
  persist(
    (set) => ({
      alertas: [],
      addAlerta: (a, id) => {
        const newId = id ?? genId();
        set((s) => ({ alertas: [...s.alertas, { ...a, id: newId }] }));
        return newId;
      },
      removeAlerta: (id) => set((s) => ({ alertas: s.alertas.filter((x) => x.id !== id) })),
      resetAlertas: () => set({ alertas: [] }),
    }),
    {
      name: 'alerta-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
