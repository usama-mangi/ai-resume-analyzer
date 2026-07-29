export type Locale = 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES' | 'ja-JP' | 'zh-CN' | 'ar-SA' | 'he-IL';

export const SUPPORTED_LOCALES: Locale[] = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'zh-CN', 'ar-SA', 'he-IL'];

export const RTL_LOCALES: Locale[] = ['ar-SA', 'he-IL'];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

let currentLocale: Locale = 'en-US';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  document.documentElement.lang = locale.split('-')[0];
  document.documentElement.dir = getDirection(locale);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions, locale?: Locale): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const opts: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    ...options,
  };
  return new Intl.DateTimeFormat(locale || currentLocale, opts).format(dateObj);
}

export function formatDateTime(date: Date | string | number, locale?: Locale): string {
  return formatDate(date, { dateStyle: 'short', timeStyle: 'short' }, locale);
}

export function formatRelativeTime(date: Date | string | number, locale?: Locale): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat(locale || currentLocale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 7) return rtf.format(-diffDay, 'day');
  if (diffWeek < 4) return rtf.format(-diffWeek, 'week');
  if (diffMonth < 12) return rtf.format(-diffMonth, 'month');
  return rtf.format(-diffYear, 'year');
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: Locale): string {
  return new Intl.NumberFormat(locale || currentLocale, options).format(value);
}

export function formatCompactNumber(value: number, locale?: Locale): string {
  return formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 }, locale);
}

export function formatCurrency(value: number, currency: string = 'USD', locale?: Locale): string {
  return new Intl.NumberFormat(locale || currentLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number, locale?: Locale): string {
  return new Intl.NumberFormat(locale || currentLocale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function pluralize(count: number, singular: string, plural?: string, locale?: Locale): string {
  const pl = new Intl.PluralRules(locale || currentLocale).select(count);
  if (pl === 'one') return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}

export function truncate(text: string, maxLength: number, suffix = '…'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function truncateMiddle(text: string, maxLength: number, separator = '…'): string {
  if (text.length <= maxLength) return text;
  const startLength = Math.floor((maxLength - separator.length) / 2);
  const endLength = maxLength - separator.length - startLength;
  return text.slice(0, startLength) + separator + text.slice(-endLength);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => capitalize(word));
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}