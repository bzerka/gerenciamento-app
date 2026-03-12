import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { doc, getDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { db } from '@/src/lib/firebase';

// -----------------------------------------------------------------------------
// Firestore config (documento appConfig/version; regras devem permitir read sem auth)
// -----------------------------------------------------------------------------

const VERSION_CONFIG = {
  collection: 'appConfig',
  documentId: 'version',
  fieldMinimumBuild: 'minimumBuildNumber',
} as const;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ForceUpdateResult = { required: true } | { required: false };

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/** Converte valor do Firestore (number | string) em inteiro; inválido → 0 */
function toBuildNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Em __DEV__: retorna build mockado do .env (Expo Go); senão undefined. Use EXPO_PUBLIC_TEST_BUILD_NUMBER=5 */
function getDevTestBuildNumber(): number | undefined {
  if (!__DEV__) return undefined;
  const v = process.env.EXPO_PUBLIC_TEST_BUILD_NUMBER;
  if (v == null || v === '') return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Build atual do app.
 * Ordem: (1) __DEV__ + EXPO_PUBLIC_TEST_BUILD_NUMBER, (2) native (expo-application), (3) manifest.
 * No Expo Go sem env mockado costuma vir 0.
 */
export function getBuildNumber(): number {
  const devBuild = getDevTestBuildNumber();
  if (devBuild !== undefined) return devBuild;

  try {
    const native = Application.nativeBuildVersion;
    if (native != null && String(native).trim() !== '') {
      const n = parseInt(String(native), 10);
      if (Number.isFinite(n)) return n;
    }
  } catch {
    // expo-application pode falhar em web / ambientes sem native
  }

  if (Platform.OS === 'android') {
    const v =
      Constants.expoConfig?.android?.versionCode ??
      (Constants.manifest as { android?: { versionCode?: unknown } } | undefined)?.android?.versionCode;
    return toBuildNumber(v);
  }
  const v =
    Constants.expoConfig?.ios?.buildNumber ??
    (Constants.manifest as { ios?: { buildNumber?: unknown } } | undefined)?.ios?.buildNumber;
  return toBuildNumber(v);
}

/**
 * Compara build atual com o mínimo no Firestore. Se atual < mínimo → required: true.
 */
export async function checkForceUpdate(): Promise<ForceUpdateResult> {
  try {
    const ref = doc(db, VERSION_CONFIG.collection, VERSION_CONFIG.documentId);
    const snap = await getDoc(ref);
    const raw = snap.exists() ? snap.data()?.[VERSION_CONFIG.fieldMinimumBuild] : undefined;
    const minimumBuild = toBuildNumber(raw);
    if (minimumBuild <= 0) return { required: false };

    const current = getBuildNumber();
    if (current < minimumBuild) return { required: true };
    return { required: false };
  } catch {
    return { required: false };
  }
}
