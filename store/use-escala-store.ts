import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Escala } from '@/types';

interface EscalaState {
  escalas: Escala[];
  addEscala: (escala: Omit<Escala, 'id'>) => void;
  removeEscala: (id: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useEscalaStore = create<EscalaState>()(
  persist(
    (set) => ({
      escalas: [],
      addEscala: (escala) =>
        set((s) => ({
          escalas: [...s.escalas, { ...escala, id: genId() }],
        })),
      removeEscala: (id) =>
        set((s) => ({ escalas: s.escalas.filter((e) => e.id !== id) })),
    }),
    {
      name: 'escala-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
