import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/types';

const locales: Locale[] = ['zh-CN', 'en-US'];

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useI18n();

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-white/80 shadow-none"
      aria-label={messages.actions.language}
    >
      {locales.map((option) => {
        const active = locale === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(option)}
            className={`px-2.5 py-1 text-sm font-medium transition-colors ${
              active
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {messages.languages[option]}
          </button>
        );
      })}
    </div>
  );
}
