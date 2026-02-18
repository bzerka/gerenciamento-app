import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Evento } from '@/types';

interface EventoState {
  eventos: Evento[];
  addEvento: (e: Omit<Evento, 'id'>) => void;
  removeEvento: (id: string) => void;
  updateEvento: (id: string, patch: Partial<Evento>) => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useEventoStore = create<EventoState>()(
  persist(
    (set) => ({
      eventos: [],
      addEvento: (e) => set((s) => ({ eventos: [...s.eventos, { ...e, id: genId() }] })),
      removeEvento: (id) => set((s) => ({ eventos: s.eventos.filter((ev) => ev.id !== id) })),
      updateEvento: (id, patch) =>
        set((s) => ({ eventos: s.eventos.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)) })),
    }),
    {
      name: 'evento-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

