import { describe, it, expect } from 'vitest';
import { setLocale, getMessages } from '../locales';
import { announceToScreenReader, trapFocus, generateId } from '../index';

/**
 * Integration tests for the complete a11y-core package
 * Tests the interaction between different modules
 */

describe('a11y-core Integration Tests', () => {
  describe('Locale + Screen Reader Integration', () => {
    it('should use localized messages in screen reader announcements', async () => {
      // Set Swedish locale
      await setLocale('sv');
      const messages = getMessages();
      
      // Use localized message in announcement
      announceToScreenReader(messages.loading, 'polite');
      
      const announcement = document.querySelector('[role="status"]');
      expect(announcement?.textContent).toBe('Laddar'); // Swedish for "Loading"
    });

    it('should handle locale switching during announcements', async () => {
      await setLocale('en');
      const enMessages = getMessages();
      announceToScreenReader(enMessages.success, 'polite');
      
      await setLocale('sv');
      const svMessages = getMessages();
      announceToScreenReader(svMessages.error, 'assertive');
      
      const announcements = document.querySelectorAll('[role="status"]');
      expect(announcements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Focus Management + ID Generation', () => {
    it('should trap focus using generated IDs', () => {
      document.body.innerHTML = `
        <div id="container">
          <button id="${generateId('btn')}">Button 1</button>
          <button id="${generateId('btn')}">Button 2</button>
          <button id="${generateId('btn')}">Button 3</button>
        </div>
      `;
      
      const container = document.getElementById('container') as HTMLElement;
      const cleanup = trapFocus(container);
      
      // Verify focus trap was set up
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);
      expect(document.activeElement).toBe(buttons[0]);
      
      cleanup();
    });

    it('should handle multiple focus traps with unique IDs', () => {
      const id1 = generateId('trap');
      const id2 = generateId('trap');
      
      document.body.innerHTML = `
        <div id="${id1}">
          <button>Trap 1 Button</button>
        </div>
        <div id="${id2}">
          <button>Trap 2 Button</button>
        </div>
      `;
      
      const trap1 = document.getElementById(id1) as HTMLElement;
      const trap2 = document.getElementById(id2) as HTMLElement;
      
      const cleanup1 = trapFocus(trap1);
      const cleanup2 = trapFocus(trap2);
      
      expect(trap1).toBeDefined();
      expect(trap2).toBeDefined();
      expect(id1).not.toBe(id2);
      
      cleanup1();
      cleanup2();
    });
  });

  describe('Error Handling + Announcements', () => {
    it('should announce form errors with proper ARIA', async () => {
      await setLocale('en');
      const messages = getMessages();
      
      const fieldId = generateId('email');
      document.body.innerHTML = `
        <input id="${fieldId}" aria-invalid="true" aria-describedby="${fieldId}-error" />
        <span id="${fieldId}-error">${messages.error}: Invalid email</span>
      `;
      
      announceToScreenReader(`${messages.error}: Please correct the form`, 'assertive');
      
      const input = document.getElementById(fieldId);
      const errorSpan = document.getElementById(`${fieldId}-error`);
      
      expect(input?.getAttribute('aria-invalid')).toBe('true');
      expect(input?.getAttribute('aria-describedby')).toBe(`${fieldId}-error`);
      expect(errorSpan?.textContent).toContain('Error');
    });
  });

  describe('Complete Workflow Tests', () => {
    it('should handle modal open/close workflow', async () => {
      // Setup locale
      await setLocale('en');
      const messages = getMessages();
      
      // Create modal
      const modalId = generateId('modal');
      document.body.innerHTML = `
        <button id="trigger">Open</button>
        <div id="${modalId}" role="dialog" aria-modal="true" style="display: none;">
          <h2>${messages.close}</h2>
          <button id="close">Close</button>
        </div>
      `;
      
      const modal = document.getElementById(modalId) as HTMLElement;
      const trigger = document.getElementById('trigger') as HTMLButtonElement;
      
      // Open modal
      trigger.focus();
      modal.style.display = 'block';
      const cleanup = trapFocus(modal);
      announceToScreenReader('Modal opened', 'polite');
      
      // Verify modal state
      expect(modal.style.display).toBe('block');
      expect(document.querySelectorAll('[role="status"]').length).toBeGreaterThan(0);
      
      // Close modal
      modal.style.display = 'none';
      cleanup();
      announceToScreenReader('Modal closed', 'polite');
      
      expect(modal.style.display).toBe('none');
    });

    it('should handle internationalized form submission', async () => {
      // Setup form in Swedish
      await setLocale('sv');
      const messages = getMessages();
      
      const formId = generateId('form');
      const emailId = generateId('email');
      
      document.body.innerHTML = `
        <form id="${formId}">
          <label for="${emailId}">${messages.required}</label>
          <input id="${emailId}" type="email" />
          <button type="submit">${messages.submit}</button>
        </form>
      `;
      
      // Simulate validation error
      const input = document.getElementById(emailId) as HTMLInputElement;
      input.setAttribute('aria-invalid', 'true');
      announceToScreenReader(`${messages.error}: Invalid email`, 'assertive');
      
      let announcements = document.querySelectorAll('[role="status"]');
      expect(announcements[announcements.length - 1]?.textContent).toContain('Fel');
      
      // Simulate success
      input.setAttribute('aria-invalid', 'false');
      announceToScreenReader(`${messages.success}: Form submitted`, 'polite');
      
      announcements = document.querySelectorAll('[role="status"]');
      expect(announcements[announcements.length - 1]?.textContent).toContain('Lyckades');
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid locale switching', async () => {
      const iterations = 10;
      
      for (let i = 0; i < iterations; i++) {
        await setLocale(i % 2 === 0 ? 'en' : 'sv');
        const messages = getMessages();
        expect(messages.close).toBeDefined();
      }
      
      // Final check
      const messages = getMessages();
      expect(messages.close).toBeDefined();
    });

    it('should handle multiple simultaneous announcements', () => {
      const count = 5;
      
      for (let i = 0; i < count; i++) {
        announceToScreenReader(`Message ${i}`, i % 2 === 0 ? 'polite' : 'assertive');
      }
      
      const announcements = document.querySelectorAll('[role="status"]');
      expect(announcements.length).toBeGreaterThanOrEqual(count);
    });

    it('should generate many unique IDs efficiently', () => {
      const ids = new Set<string>();
      const count = 1000;
      
      for (let i = 0; i < count; i++) {
        ids.add(generateId('test'));
      }
      
      // All IDs should be unique
      expect(ids.size).toBe(count);
    });
  });
});
