/**
 * URLs das lojas para abrir o app (atualização, compartilhar link, etc.).
 * iOS: defina EXPO_PUBLIC_APP_STORE_URL no .env com o link completo se necessário.
 */

export const ANDROID_PACKAGE_ID = 'com.igorcastro1.escalaapp';

export const PLAY_STORE_APP_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

export const APP_STORE_APP_URL =
  process.env.EXPO_PUBLIC_APP_STORE_URL ?? 'https://apps.apple.com/app/id';

export function getStoreUrl(platform: 'android' | 'ios'): string {
  return platform === 'android' ? PLAY_STORE_APP_URL : APP_STORE_APP_URL;
}
