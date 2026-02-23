import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Evento } from '@/types';

interface EventoState {
  eventos: Evento[];
  addEvento: (e: Omit<Evento, 'id'>) => string;
  removeEvento: (id: string) => void;
  updateEvento: (id: string, patch: Partial<Evento>) => void;
  resetEventos: () => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useEventoStore = create<EventoState>()(
  persist(
    (set) => ({
      eventos: [],
      addEvento: (e) => {
        const newId = genId();
        set((s) => ({ eventos: [...s.eventos, { ...e, id: newId }] }));
        return newId;
      },
      removeEvento: (id) => set((s) => ({ eventos: s.eventos.filter((ev) => ev.id !== id) })),
      updateEvento: (id, patch) =>
        set((s) => ({ eventos: s.eventos.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)) })),
      resetEventos: () => set({ eventos: [] }),
    }),
    {
      name: 'evento-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

