import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Servico } from '@/types';

const DEFAULT_SERVICOS: Servico[] = [
  { id: 'default-normal', nome: 'Normal', cor: '#7ED957' },
  { id: 'default-ras', nome: 'RAS', cor: '#F39C12' },
  { id: 'default-sp', nome: 'Segurança Presente', cor: '#4DA6FF' },
  { id: 'default-proeis', nome: 'Proeis', cor: '#1E5E9B' },
];

interface ServicoState {
  servicos: Servico[];
  addServico: (s: Omit<Servico, 'id'>) => void;
  updateServico: (id: string, data: Partial<Omit<Servico, 'id'>>) => void;
  removeServico: (id: string) => void;
  resetServicos: () => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useServicoStore = create<ServicoState>()(
  persist(
    (set) => ({
      servicos: DEFAULT_SERVICOS,
      addServico: (s) =>
        set((st) => ({ servicos: [...st.servicos, { ...s, id: genId() }] })),
      updateServico: (id, data) =>
        set((st) => ({
          servicos: st.servicos.map((x) => (x.id === id ? { ...x, ...(data as any) } : x)),
        })),
      removeServico: (id) => set((st) => ({ servicos: st.servicos.filter((x) => x.id !== id) })),
      resetServicos: () => set({ servicos: DEFAULT_SERVICOS }),
    }),
    {
      name: 'servico-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

