import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Nota } from '@/types';

interface NotaState {
  notas: Nota[];
  addNota: (n: Omit<Nota, 'id' | 'createdAt'>, id?: string) => string;
  updateNota: (id: string, data: Partial<Pick<Nota, 'titulo' | 'conteudo'>>) => void;
  removeNota: (id: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useNotaStore = create<NotaState>()(
  persist(
    (set) => ({
      notas: [],
      addNota: (n, id) => {
        const newId = id ?? genId();
        const nota: Nota = {
          ...n,
          id: newId,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ notas: [nota, ...s.notas] }));
        return newId;
      },
      updateNota: (id, data) =>
        set((s) => ({
          notas: s.notas.map((n) =>
            n.id === id ? { ...n, ...data } : n
          ),
        })),
      removeNota: (id) =>
        set((s) => ({ notas: s.notas.filter((x) => x.id !== id) })),
    }),
    {
      name: 'nota-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
