import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import { getLocaleFromPathname } from '@/lib/site';
import type { Locale, Messages } from './types';

export const LOCALE_STORAGE_KEY = 'text-calcer-locale';
export const defaultLocale: Locale = 'zh-CN';

const locales: Record<Locale, Messages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'zh-CN' || value === 'en-US';
}

export function resolveLocale(): Locale {
  if (typeof window !== 'undefined') {
    const pathnameLocale = getLocaleFromPathname(window.location.pathname);
    if (pathnameLocale) {
      return pathnameLocale;
    }
  }

  try {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(storedLocale)) {
      return storedLocale;
    }
  } catch {
    // Ignore storage access failures and fall back to browser language.
  }

  if (typeof navigator !== 'undefined') {
    const browserLocale = navigator.language?.toLowerCase() ?? '';
    if (browserLocale.startsWith('zh')) {
      return 'zh-CN';
    }
    if (browserLocale.startsWith('en')) {
      return 'en-US';
    }
  }

  return defaultLocale;
}

export function getMessages(locale: Locale): Messages {
  return locales[locale] ?? locales[defaultLocale];
}
