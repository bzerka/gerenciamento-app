import { useThemeOverrideStore } from '@/store/use-theme-override-store';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { theme, type ThemeMode, type DefaultThemeShape } from './index';

declare module 'styled-components/native' {
  export interface DefaultTheme extends DefaultThemeShape {}
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const themeOverride = useThemeOverrideStore((s) => s.themeOverride);
  const scheme = useColorScheme();
  const mode: ThemeMode =
    themeOverride === 'system'
      ? scheme === 'dark'
        ? 'dark'
        : 'light'
      : themeOverride;
  return <StyledThemeProvider theme={theme[mode]}>{children}</StyledThemeProvider>;
}

/** Tema efetivo (light/dark) para StatusBar etc. */
export function useEffectiveTheme(): 'light' | 'dark' {
  const themeOverride = useThemeOverrideStore((s) => s.themeOverride);
  const scheme = useColorScheme();
  if (themeOverride !== 'system') return themeOverride;
  return scheme === 'dark' ? 'dark' : 'light';
}
