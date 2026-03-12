import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ScheduleConfig {
  tipo: string;
  dataInicio: string; // DD/MM/YYYY
  horaInicio: string; // HH:mm
  diaFolhaExtra: number | null; // 0=Dom … 6=Sáb, null=nenhum
}

interface ScheduleState {
  config: ScheduleConfig | null;
  setConfig: (c: ScheduleConfig) => void;
  clearConfig: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (c) => set({ config: c }),
      clearConfig: () => set({ config: null }),
    }),
    {
      name: 'schedule-config-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
