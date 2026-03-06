import { create } from 'zustand';

export type ThemeOverride = 'light' | 'dark' | 'system';

interface ThemeOverrideState {
  themeOverride: ThemeOverride;
  setThemeOverride: (value: ThemeOverride) => void;
  toggleTheme: () => void; // alterna entre light e dark (para teste)
}

export const useThemeOverrideStore = create<ThemeOverrideState>((set) => ({
  themeOverride: 'system',
  setThemeOverride: (value) => set({ themeOverride: value }),
  toggleTheme: () =>
    set((s) => ({
      themeOverride: s.themeOverride === 'dark' ? 'light' : 'dark',
    })),
}));
