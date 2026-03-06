/**
 * @deprecated O controle de "já viu onboarding" foi migrado para o Firestore.
 * Ver: coleção `session/{userId}` e useSession() em @/src/contexts/SessionContext.
 * Este store não é mais usado pelo app; mantido apenas para referência.
 */
import { create } from 'zustand';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  hasSeenOnboarding: false,
  setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
}));
