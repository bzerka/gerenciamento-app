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
    text: '#F1F2F3',
    textSecondary: '#9CA3AF',
    background: '#0A0A0B',
    buttonText: '#F1F2F3',
    formButtonBackground: '#252A33',
    formButtonBackgroundHover: '#3A4150',
    secondaryButtonBackground: 'rgba(255, 255, 255, 0.12)',
    buttonBackground: '#155DFC',
    cardBackground: '#16171A',
    icon: '#9CA3AF',
    border: 'rgba(148, 163, 184, 0.2)',
    calendarBorder: 'rgba(255,255,255,0.08)',
    tintMuted: 'rgba(21, 93, 252, 0.12)',
    iconMuted: 'rgba(148, 163, 184, 0.45)',
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
