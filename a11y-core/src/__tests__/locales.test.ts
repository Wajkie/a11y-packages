import { describe, it, expect, beforeEach } from 'vitest';
import { setLocale, getCurrentLocale, getMessages, validateLocale } from '../locales/index';

describe('Locale System', () => {
  describe('setLocale', () => {
    it('should set English locale', async () => {
      await setLocale('en');
      expect(getCurrentLocale()).toBe('en');
    });

    it('should set Swedish locale', async () => {
      await setLocale('sv');
      expect(getCurrentLocale()).toBe('sv');
    });

    it('should load correct messages for English', async () => {
      await setLocale('en');
      const messages = getMessages();

      expect(messages.close).toBe('Close');
      expect(messages.open).toBe('Open');
      expect(messages.skipToContent).toBe('Skip to main content');
    });

    it('should load correct messages for Swedish', async () => {
      await setLocale('sv');
      const messages = getMessages();

      expect(messages.close).toBe('Stäng');
      expect(messages.open).toBe('Öppna');
      expect(messages.skipToContent).toBe('Hoppa till huvudinnehåll');
    });
  });

  describe('getMessages', () => {
    beforeEach(async () => {
      await setLocale('en');
    });

    it('should return all required navigation messages', () => {
      const messages = getMessages();

      expect(messages.skipToContent).toBeDefined();
      expect(messages.mainNavigation).toBeDefined();
      expect(messages.userMenu).toBeDefined();
      expect(messages.breadcrumb).toBeDefined();
      expect(messages.pagination).toBeDefined();
      expect(messages.siteNavigation).toBeDefined();
      expect(messages.footerNavigation).toBeDefined();
    });

    it('should return all required action messages', () => {
      const messages = getMessages();

      expect(messages.close).toBeDefined();
      expect(messages.open).toBeDefined();
      expect(messages.save).toBeDefined();
      expect(messages.cancel).toBeDefined();
      expect(messages.delete).toBeDefined();
      expect(messages.edit).toBeDefined();
      expect(messages.submit).toBeDefined();
      expect(messages.search).toBeDefined();
      expect(messages.loading).toBeDefined();
      expect(messages.menu).toBeDefined();
    });

    it('should return all required pagination messages', () => {
      const messages = getMessages();

      expect(messages.nextPage).toBeDefined();
      expect(messages.previousPage).toBeDefined();
      expect(messages.currentPage).toBeDefined();
      expect(messages.goToPage).toBeDefined();
    });

    it('should return all required user messages', () => {
      const messages = getMessages();

      expect(messages.login).toBeDefined();
      expect(messages.logout).toBeDefined();
      expect(messages.register).toBeDefined();
      expect(messages.account).toBeDefined();
    });

    it('should return all required status messages', () => {
      const messages = getMessages();

      expect(messages.required).toBeDefined();
      expect(messages.optional).toBeDefined();
      expect(messages.error).toBeDefined();
      expect(messages.success).toBeDefined();
    });
  });

  describe('validateLocale', () => {
    it('should return true for valid locale with all keys', () => {
      const locale = {
        close: 'Close',
        open: 'Open',
      };
      const keys = ['close', 'open'] as const;

      expect(validateLocale(locale, keys)).toBe(true);
    });

    it('should return false for locale missing keys', () => {
      const locale = {
        close: 'Close',
      };
      const keys = ['close', 'open'] as const;

      expect(validateLocale(locale, keys)).toBe(false);
    });

    it('should return false for locale with non-string values', () => {
      const locale = {
        close: 'Close',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        open: 123 as any,
      };
      const keys = ['close', 'open'] as const;

      expect(validateLocale(locale, keys)).toBe(false);
    });
  });

  describe('Locale consistency', () => {
    it('should have same keys in English and Swedish', async () => {
      await setLocale('en');
      const enMessages = getMessages();

      await setLocale('sv');
      const svMessages = getMessages();

      const enKeys = Object.keys(enMessages).sort();
      const svKeys = Object.keys(svMessages).sort();

      expect(enKeys).toEqual(svKeys);
    });

    it('should not have empty string values in English', async () => {
      await setLocale('en');
      const messages = getMessages();

      Object.entries(messages).forEach(([_key, value]) => {
        expect(value).not.toBe('');
        expect(value.trim()).toBe(value); // No leading/trailing spaces
      });
    });

    it('should not have empty string values in Swedish', async () => {
      await setLocale('sv');
      const messages = getMessages();

      Object.entries(messages).forEach(([_key, value]) => {
        expect(value).not.toBe('');
        expect(value.trim()).toBe(value);
      });
    });
  });
});
