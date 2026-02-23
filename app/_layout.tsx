import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { AppThemeProvider } from '@/src/theme/ThemeProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { requestNotificationPermission, rescheduleAllAlertas } from '@/src/utils/notifications';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useEventoStore } from '@/store/use-evento-store';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import OnboardingScreen from '@/src/screens/Onboarding';

// Show notifications even when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const hasOnboardingHydrated = useOnboardingStore.persist.hasHydrated();

  useEffect(() => {
    async function init() {
      // Wait for Zustand stores to finish rehydrating from AsyncStorage before
      // scheduling notifications — otherwise alertas/eventos would still be []
      if (!useAlertaStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useAlertaStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }
      if (!useEventoStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useEventoStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }
      const granted = await requestNotificationPermission();
      if (!granted) return;
      const currentAlertas = useAlertaStore.getState().alertas;
      const currentEventos = useEventoStore.getState().eventos;
      await rescheduleAllAlertas(currentAlertas, currentEventos);
    }
    init();
  }, []);
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  if (!hasOnboardingHydrated) {
    return (
      <AppThemeProvider>
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      </AppThemeProvider>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <AppThemeProvider>
        <ThemeProvider value={theme}>
          <OnboardingScreen />
          <StatusBar
            style={colorScheme === 'dark' ? 'light' : 'dark'}
            translucent
            backgroundColor="transparent"
          />
        </ThemeProvider>
      </AppThemeProvider>
    );
  }

  return (
    <AppThemeProvider>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            headerBackTitle: '',
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: '',
            }}
          />
        </Stack>

        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          translucent
          backgroundColor="transparent"
        />
      </ThemeProvider>
    </AppThemeProvider>
  );
}
