/**
 * Internationalization (i18n) support for accessibility utilities
 * Provides localized messages for common UI patterns
 */

/**
 * Interface for extending supported locales
 * Users can augment this interface to add their custom locales to TypeScript autocomplete
 * 
 * @example
 * ```ts
 * // In your app's type definition file (e.g., types/a11y.d.ts)
 * declare module '@wajkie/a11y-core/locales' {
 *   interface CustomLocales {
 *     de: 'de';
 *     fr: 'fr';
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomLocales {
  // Users can augment this interface via module augmentation
}

/**
 * Supported locale codes
 * Built-in locales have autocomplete, custom locales via module augmentation
 */
export type KnownLocale = 'en' | 'sv' | keyof CustomLocales;
export type Locale = KnownLocale | (string & {});

/**
 * Interface for all accessibility messages
 * Ensures type safety and autocomplete for message keys
 */
export interface A11yMessages {
  // Navigation (7 strings)
  skipToContent: string;
  mainNavigation: string;
  userMenu: string;
  breadcrumb: string;
  pagination: string;
  siteNavigation: string;
  footerNavigation: string;

  // Common actions (10 strings)
  close: string;
  open: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  submit: string;
  search: string;
  loading: string;
  menu: string;

  // Pagination (4 strings)
  nextPage: string;
  previousPage: string;
  currentPage: string;
  goToPage: string;

  // Navigation links (4 strings)
  home: string;
  dashboard: string;
  settings: string;
  profile: string;

  // User menu (4 strings)
  login: string;
  logout: string;
  register: string;
  account: string;

  // Company (3 strings)
  customers: string;
  companies: string;
  modules: string;

  // States & Status (4 strings)
  required: string;
  optional: string;
  error: string;
  success: string;
}

/**
 * Validate that a locale object has all required keys
 */
export const validateLocale = (locale: Record<string, string>, keys: readonly string[]): boolean => {
  return keys.every(key => key in locale && typeof locale[key] === 'string');
};

// Import locales statically
import enMessages from './en';
import svMessages from './sv';

const localeData: Record<string, A11yMessages> = {
  en: enMessages,
  sv: svMessages,
};

let currentLocale: Locale = 'en';
let messages: A11yMessages = enMessages;

/**
 * Register a custom locale
 * Allows adding new languages at runtime
 * 
 * @param locale - The locale code (e.g., 'de', 'fr')
 * @param messages - The translated messages object
 * 
 * @example
 * ```ts
 * import deMessages from './locales/de';
 * registerLocale('de', deMessages);
 * await setLocale('de');
 * ```
 */
export const registerLocale = (locale: string, localeMessages: A11yMessages): void => {
  if (!locale) {
    console.error('[a11y-core] registerLocale: locale code is required');
    return;
  }
  
  if (!localeMessages || typeof localeMessages !== 'object') {
    console.error('[a11y-core] registerLocale: localeMessages must be an object with all A11yMessages keys');
    return;
  }
  
  // Validate that all required keys are present
  const requiredKeys: (keyof A11yMessages)[] = [
    'skipToContent', 'mainNavigation', 'userMenu', 'breadcrumb', 'pagination',
    'siteNavigation', 'footerNavigation', 'close', 'open', 'save', 'cancel',
    'delete', 'edit', 'submit', 'search', 'loading', 'menu', 'nextPage',
    'previousPage', 'currentPage', 'goToPage', 'home', 'dashboard', 'settings',
    'profile', 'login', 'logout', 'register', 'account', 'customers', 'companies', 'modules'
  ];
  
  const missingKeys = requiredKeys.filter(key => !(key in localeMessages));
  if (missingKeys.length > 0) {
    console.error(
      `[a11y-core] registerLocale: Missing required message keys for locale "${locale}":`,
      missingKeys.join(', '),
      '\nSee A11yMessages interface for all required keys.'
    );
    return;
  }
  
  localeData[locale] = localeMessages;
};

/**
 * Set the current locale
 * Updates the current locale messages
 * 
 * @param locale - The locale code to set
 * 
 * @example
 * ```ts
 * await setLocale('sv');
 * const messages = getMessages();
 * console.log(messages.close); // 'Stäng'
 * ```
 */
export const setLocale = async (locale: Locale): Promise<void> => {
  if (!locale) {
    console.error('[a11y-core] setLocale: locale code is required');
    return;
  }
  
  if (!localeData[locale]) {
    console.warn(
      `[a11y-core] setLocale: Locale "${locale}" not found. Falling back to English.`,
      `Available locales: ${Object.keys(localeData).join(', ')}`,
      locale !== 'en' && locale !== 'sv' ? '\nDid you forget to call registerLocale()?': ''
    );
    currentLocale = 'en';
    messages = localeData.en;
    return;
  }
  
  currentLocale = locale;
  messages = localeData[locale];
};

/**
 * Get the current locale code
 * 
 * @returns The current locale code
 */
export const getCurrentLocale = (): Locale => {
  return currentLocale;
};

/**
 * Get the current locale messages
 * If no locale has been set, returns English messages
 * 
 * @returns The current locale messages
 * 
 * @example
 * ```ts
 * const messages = getMessages();
 * <button aria-label={messages.close}>×</button>
 * ```
 */
export const getMessages = (): A11yMessages => {
  return messages;
};
