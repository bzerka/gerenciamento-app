export const theme = {
  light: {
    text: '#000',
    textSecondary: '#687076',
    buttonText: '#fff',
    background: '#fff',
    cardBackground: '#F4F4F5',
    formButtonBackground: '#E5E7EB',
    formButtonBackgroundHover: '#DBEAFE',
    secondaryButtonBackground: '#888',
    buttonBackground: '#155DFC',
    icon: '#687076',
    border: 'rgba(104, 112, 118, 0.3)',
    calendarBorder: 'rgba(104, 112, 118, 0.15)',
    tintMuted: 'rgba(10, 126, 164, 0.10)',
    iconMuted: 'rgba(104, 112, 118, 0.5)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#888',
    background: '#000',
    buttonText: '#ECEDEE',
    formButtonBackground: '#2F3740',
    formButtonBackgroundHover: '#526073',
    secondaryButtonBackground: 'rgba(255, 255, 255, 0.15)',
    buttonBackground: '#155DFC',
    cardBackground: '#18181B',
    icon: '#9BA1A6',
    border: 'rgba(155, 161, 166, 0.3)',
    calendarBorder: 'rgba(255,255,255,0.08)',
    tintMuted: 'rgba(255, 255, 255, 0.15)',
    iconMuted: 'rgba(155, 161, 166, 0.4)',
  },
} as const;

export type ThemeMode = keyof typeof theme;
export type Theme = (typeof theme)[ThemeMode];

/** Object type for styled-components DefaultTheme augmentation (cannot extend union). */
export type DefaultThemeShape = {
  text: string;
  textSecondary: string;
  background: string;
  buttonText: string;
  formButtonBackground: string;
  formButtonBackgroundHover: string;
  buttonBackground: string;
  secondaryButtonBackground: string;
  icon: string;
  border: string;
  calendarBorder: string;
  tintMuted: string;
  iconMuted: string;
  cardBackground: string;
};
