import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { LOCALE_STORAGE_KEY, getMessages, resolveLocale } from './index';
import type { Locale, MessageKey, Messages } from './types';

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
  }, [locale]);

  const messages = getMessages(locale);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
  };

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
