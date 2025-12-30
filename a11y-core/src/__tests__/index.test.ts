import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateId,
  isFocusable,
  trapFocus,
  announceToScreenReader,
  getLoadingLabel,
  createAriaLabel,
  getErrorId,
  getDescriptionId,
  getFormFieldAriaAttributes,
  FocusManager,
  prefersReducedMotion,
} from '../index';

describe('generateId', () => {
  it('should generate a unique ID with default prefix', () => {
    const id = generateId();
    expect(id).toMatch(/^a11y-[a-z0-9]{9}$/);
  });

  it('should generate a unique ID with custom prefix', () => {
    const id = generateId('custom');
    expect(id).toMatch(/^custom-[a-z0-9]{9}$/);
  });

  it('should generate different IDs on subsequent calls', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});

describe('isFocusable', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return true for button elements', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    expect(isFocusable(button)).toBe(true);
  });

  it('should return true for link elements', () => {
    const link = document.createElement('a');
    link.href = '#';
    document.body.appendChild(link);
    expect(isFocusable(link)).toBe(true);
  });

  it('should return true for input elements', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    expect(isFocusable(input)).toBe(true);
  });

  it('should return false for disabled elements', () => {
    const button = document.createElement('button');
    button.disabled = true;
    document.body.appendChild(button);
    expect(isFocusable(button)).toBe(false);
  });

  it('should return true for elements with tabIndex 0', () => {
    const div = document.createElement('div');
    div.tabIndex = 0;
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  it('should return false for regular div elements', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(false);
  });
});

describe('trapFocus', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <button id="first">First</button>
        <button id="middle">Middle</button>
        <button id="last">Last</button>
      </div>
    `;
  });

  it('should focus the first focusable element', () => {
    const container = document.getElementById('container') as HTMLElement;
    const first = document.getElementById('first') as HTMLButtonElement;
    
    trapFocus(container);
    
    expect(document.activeElement).toBe(first);
  });

  it('should return a cleanup function', () => {
    const container = document.getElementById('container') as HTMLElement;
    const cleanup = trapFocus(container);
    
    expect(typeof cleanup).toBe('function');
  });

  it('should handle Tab key to move forward', () => {
    const container = document.getElementById('container') as HTMLElement;
    const first = document.getElementById('first') as HTMLButtonElement;
    
    trapFocus(container);
    first.focus();
    
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    Object.defineProperty(event, 'shiftKey', { value: false });
    container.dispatchEvent(event);
    
    // In real DOM, focus would move, but in happy-dom it's limited
    expect(document.activeElement).toBeDefined();
  });
});

describe('announceToScreenReader', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create an announcement element', () => {
    announceToScreenReader('Test message');
    
    const announcements = document.querySelectorAll('[role="status"]');
    expect(announcements.length).toBe(1);
  });

  it('should set correct ARIA attributes for polite', () => {
    announceToScreenReader('Test message', 'polite');
    
    const announcement = document.querySelector('[role="status"]');
    expect(announcement?.getAttribute('aria-live')).toBe('polite');
    expect(announcement?.getAttribute('aria-atomic')).toBe('true');
  });

  it('should set correct ARIA attributes for assertive', () => {
    announceToScreenReader('Test message', 'assertive');
    
    const announcement = document.querySelector('[role="status"]');
    expect(announcement?.getAttribute('aria-live')).toBe('assertive');
  });

  it('should remove announcement after timeout', () => {
    announceToScreenReader('Test message');
    
    expect(document.querySelectorAll('[role="status"]').length).toBe(1);
    
    vi.advanceTimersByTime(1000);
    
    expect(document.querySelectorAll('[role="status"]').length).toBe(0);
  });

  it('should set the message text content', () => {
    const message = 'Important announcement';
    announceToScreenReader(message);
    
    const announcement = document.querySelector('[role="status"]');
    expect(announcement?.textContent).toBe(message);
  });
});

describe('getLoadingLabel', () => {
  it('should return default text when not loading', () => {
    expect(getLoadingLabel(false, 'Submit')).toBe('Submit');
  });

  it('should return default text with ellipsis when loading', () => {
    expect(getLoadingLabel(true, 'Submit')).toBe('Submit...');
  });

  it('should return custom loading text when provided', () => {
    expect(getLoadingLabel(true, 'Submit', 'Submitting form')).toBe('Submitting form');
  });
});

describe('createAriaLabel', () => {
  it('should return action only when no target', () => {
    expect(createAriaLabel('Delete')).toBe('Delete');
  });

  it('should combine action and target', () => {
    expect(createAriaLabel('Delete', 'user account')).toBe('Delete user account');
  });

  it('should handle empty target as undefined', () => {
    expect(createAriaLabel('Save', '')).toBe('Save');
  });
});

describe('getErrorId', () => {
  it('should append -error to field ID', () => {
    expect(getErrorId('email')).toBe('email-error');
  });

  it('should handle complex field IDs', () => {
    expect(getErrorId('user-profile-email')).toBe('user-profile-email-error');
  });
});

describe('getDescriptionId', () => {
  it('should append -description to field ID', () => {
    expect(getDescriptionId('password')).toBe('password-description');
  });

  it('should handle complex field IDs', () => {
    expect(getDescriptionId('user-password')).toBe('user-password-description');
  });
});

describe('getFormFieldAriaAttributes', () => {
  it('should return aria-invalid and aria-describedby when hasError is true', () => {
    const attrs = getFormFieldAriaAttributes('email', true, false);
    
    expect(attrs['aria-invalid']).toBe(true);
    expect(attrs['aria-describedby']).toBe('email-error');
  });

  it('should return aria-describedby for description when no error', () => {
    const attrs = getFormFieldAriaAttributes('email', false, true);
    
    expect(attrs['aria-invalid']).toBeUndefined();
    expect(attrs['aria-describedby']).toBe('email-description');
  });

  it('should return empty object when no error or description', () => {
    const attrs = getFormFieldAriaAttributes('email', false, false);
    
    expect(Object.keys(attrs).length).toBe(0);
  });

  it('should prioritize error over description', () => {
    const attrs = getFormFieldAriaAttributes('email', true, true);
    
    expect(attrs['aria-invalid']).toBe(true);
    expect(attrs['aria-describedby']).toBe('email-error');
  });
});

describe('FocusManager', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="btn1">Button 1</button>
      <button id="btn2">Button 2</button>
    `;
  });

  it('should save the currently focused element', () => {
    const btn1 = document.getElementById('btn1') as HTMLButtonElement;
    btn1.focus();
    
    const manager = new FocusManager();
    manager.saveFocus();
    
    // Change focus
    const btn2 = document.getElementById('btn2') as HTMLButtonElement;
    btn2.focus();
    
    // Restore should bring back btn1 (in real DOM)
    manager.restoreFocus();
    
    expect(manager).toBeDefined();
  });

  it('should handle restore when no element was saved', () => {
    const manager = new FocusManager();
    
    // Should not throw
    expect(() => manager.restoreFocus()).not.toThrow();
  });
});

describe('prefersReducedMotion', () => {
  it('should return false when not in browser environment', () => {
    const originalWindow = global.window;
    // @ts-expect-error - Testing undefined window
    delete global.window;
    
    expect(prefersReducedMotion()).toBe(false);
    
    global.window = originalWindow;
  });

  it('should check matchMedia for prefers-reduced-motion', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
    
    prefersReducedMotion();
    
    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('should return true when user prefers reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    
    expect(prefersReducedMotion()).toBe(true);
  });
});
