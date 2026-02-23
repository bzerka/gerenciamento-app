import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface EscalaConfig {
  tipo: string;
  dataInicio: string; // DD/MM/YYYY
  horaInicio: string; // HH:mm
  diaFolhaExtra: number | null; // 0=Dom … 6=Sáb, null=nenhum
}

interface EscalaState {
  config: EscalaConfig | null;
  setConfig: (c: EscalaConfig) => void;
  clearConfig: () => void;
}

export const useEscalaStore = create<EscalaState>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (c) => set({ config: c }),
      clearConfig: () => set({ config: null }),
    }),
    {
      name: 'escala-config-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
