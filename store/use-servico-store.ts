import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Servico } from '@/types';

interface ServicoState {
  servicos: Servico[];
  addServico: (s: Omit<Servico, 'id'>) => void;
  removeServico: (id: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 11);

export const useServicoStore = create<ServicoState>()(
  persist(
    (set) => ({
      servicos: [
        { id: genId(), nome: 'Normal', cor: '#7ED957' },
        { id: genId(), nome: 'RAS', cor: '#F39C12' },
        { id: genId(), nome: 'Segurança Presente', cor: '#4DA6FF' },
      ],
      addServico: (s) =>
        set((st) => ({ servicos: [...st.servicos, { ...s, id: genId() }] })),
      removeServico: (id) => set((st) => ({ servicos: st.servicos.filter((x) => x.id !== id) })),
    }),
    {
      name: 'servico-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

