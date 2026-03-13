import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Manter splash nativa visível até o app estar pronto (evita tela preta/crash na abertura)
SplashScreen.preventAutoHideAsync();

import { useThemeOverrideStore } from '@/store/use-theme-override-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { SessionProvider, useSession } from '@/src/contexts/SessionContext';
import ForceUpdateScreen from '@/src/screens/ForceUpdate';
import OnboardingScreen from '@/src/screens/Onboarding';
import { AppThemeProvider, useEffectiveTheme } from '@/src/theme/ThemeProvider';
import { useForceUpdateCheck } from '@/hooks/use-force-update-check';
import { requestNotificationPermission, rescheduleAllAlertas } from '@/src/utils/notifications';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useEventoStore } from '@/store/use-evento-store';

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

// Uma única chamada a hideAsync para evitar "no native splash screen registered for given view controller"
let splashHidden = false;
function hideSplashOnce() {
  if (splashHidden) return;
  splashHidden = true;
  // Pequeno delay para o nativo registrar o splash no view controller atual (evita erro no iOS)
  setTimeout(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, 100);
}

// Fallback: esconder splash após 3s caso algo trave no carregamento
const SPLASH_MAX_VISIBLE_MS = 3000;
setTimeout(hideSplashOnce, SPLASH_MAX_VISIBLE_MS);

function RootLayoutContent() {
  const themeOverride = useThemeOverrideStore((s) => s.themeOverride);
  const colorScheme = useColorScheme();
  const effectiveTheme = themeOverride === 'system' ? (colorScheme === 'dark' ? 'dark' : 'light') : themeOverride;
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
  const theme = effectiveTheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <ThemeProvider value={theme}>
          <SessionProvider>
            <VersionGate />
          </SessionProvider>
        </ThemeProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

const LOADING_BG = '#000';
const LOADING_COLOR = '#155DFC';

function VersionGate() {
  const versionStatus = useForceUpdateCheck();
  const effectiveTheme = useEffectiveTheme();

  if (versionStatus.status === 'checking') {
    return (
      <View style={{ flex: 1, backgroundColor: LOADING_BG, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={LOADING_COLOR} />
      </View>
    );
  }

  if (versionStatus.status === 'required') {
    hideSplashOnce();
    return (
      <>
        <ForceUpdateScreen />
        <StatusBar
          style={effectiveTheme === 'dark' ? 'light' : 'dark'}
          translucent
          backgroundColor="transparent"
        />
      </>
    );
  }

  return <AuthGate />;
}

function AuthGate() {
  const { user, loading } = useAuth();
  const { hasSeenOnboarding, sessionLoading } = useSession();
  const effectiveTheme = useEffectiveTheme();

  // Esconder splash quando tivermos conteúdo para mostrar (evita crash/tela preta)
  useEffect(() => {
    const canShowContent = !loading && (!user || !sessionLoading);
    if (canShowContent) {
      hideSplashOnce();
    }
  }, [loading, user, sessionLoading]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  // Não logado: mostrar auth
  if (!user) {
    return (
      <>
        <Stack screenOptions={{ headerBackTitle: '' }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false, title: '' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        </Stack>
        <Redirect href="/(auth)/login" />
        <StatusBar
          style={effectiveTheme === 'dark' ? 'light' : 'dark'}
          translucent
          backgroundColor="transparent"
        />
      </>
    );
  }

  // Logado: aguardar sessão do Firestore (hasSeenOnboarding)
  if (sessionLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  // Logado mas não viu onboarding: mostrar onboarding
  if (!hasSeenOnboarding) {
    return (
      <>
        <OnboardingScreen />
        <StatusBar
          style={effectiveTheme === 'dark' ? 'light' : 'dark'}
          translucent
          backgroundColor="transparent"
        />
      </>
    );
  }

  // Logado e viu onboarding: mostrar tabs
  return (
    <>
      <Stack screenOptions={{ headerBackTitle: '' }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
      </Stack>
      <Redirect href="/(tabs)" />
      <StatusBar
        style={effectiveTheme === 'dark' ? 'light' : 'dark'}
        translucent
        backgroundColor="transparent"
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
