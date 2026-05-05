import type { Locale } from '@/i18n/types';
import { siteConfig } from '@/config/site';

export const SITE_ORIGIN = siteConfig.siteUrl.replace(/\/$/, '');

const localePaths: Record<Locale, string> = {
  'zh-CN': '/zh-CN/',
  'en-US': '/en-US/',
};

export function normalizeLocalePathname(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function getLocalePath(locale: Locale): string {
  return localePaths[locale];
}

export function getLocaleUrl(locale: Locale): string {
  return `${SITE_ORIGIN}${getLocalePath(locale)}`;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const normalized = normalizeLocalePathname(pathname);

  if (normalized === '/zh-CN') {
    return 'zh-CN';
  }

  if (normalized === '/en-US') {
    return 'en-US';
  }

  return null;
}
