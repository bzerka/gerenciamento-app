export const theme = {
  light: {
    text: '#11181C',
    buttonText: '#11181C',
    background: '#fff',
    buttonBackground: '#0a7ea4',
    icon: '#687076',
    border: 'rgba(104, 112, 118, 0.3)',
    tintMuted: 'rgba(10, 126, 164, 0.15)',
    iconMuted: 'rgba(104, 112, 118, 0.4)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    buttonText: '#151718',
    buttonBackground: '#fff',
    icon: '#9BA1A6',
    border: 'rgba(155, 161, 166, 0.3)',
    tintMuted: 'rgba(255, 255, 255, 0.15)',
    iconMuted: 'rgba(155, 161, 166, 0.4)',
  },
} as const;

export type ThemeMode = keyof typeof theme;
export type Theme = (typeof theme)[ThemeMode];

/** Object type for styled-components DefaultTheme augmentation (cannot extend union). */
export type DefaultThemeShape = {
  text: string;
  background: string;
  buttonText: string;
  buttonBackground: string;
  icon: string;
  border: string;
  tintMuted: string;
  iconMuted: string;
};
