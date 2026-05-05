import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { LOCALE_STORAGE_KEY, getMessages, resolveLocale } from './index';
import type { Locale, MessageKey, Messages } from './types';
import { getLocalePath, normalizeLocalePathname } from '@/lib/site';

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (nextLocale: Locale) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readMessage(messages: Messages, key: string): string {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages) as string;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale());

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore localStorage write failures.
    }

    document.documentElement.lang = locale;

    const expectedPath = getLocalePath(locale);
    const currentPath = normalizeLocalePathname(window.location.pathname);
    if (currentPath !== expectedPath) {
      const nextUrl = `${expectedPath}${window.location.search}${window.location.hash}`;
      window.history.replaceState({ locale }, '', nextUrl);
    }
  }, [locale]);

  const messages = getMessages(locale);

  const setLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    const nextUrl = `${getLocalePath(nextLocale)}${window.location.search}${window.location.hash}`;
    window.history.pushState({ locale: nextLocale }, '', nextUrl);
    setLocaleState(nextLocale);
  };

  useEffect(() => {
    const handlePopState = () => {
      setLocaleState(resolveLocale());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const t = (key: MessageKey) => {
    const value = readMessage(messages, key);
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
