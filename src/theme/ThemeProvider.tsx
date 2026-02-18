import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { theme, type ThemeMode, type DefaultThemeShape } from './index';

declare module 'styled-components/native' {
  export interface DefaultTheme extends DefaultThemeShape {}
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';
  return <StyledThemeProvider theme={theme[mode]}>{children}</StyledThemeProvider>;
}
