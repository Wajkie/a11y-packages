/**
 * React hooks for accessibility features
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { trapFocus, FocusManager } from '@wajkie/a11y-core';
import type { A11yMessages, Locale } from '@wajkie/a11y-core/locales';

/**
 * Hook to trap focus within a component (for modals/dialogs)
 * Implements WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
 *
 * @param isActive - Whether the focus trap is active
 * @returns A ref to attach to the container element
 *
 * @example
 * ```tsx
 * function Modal({ isOpen }) {
 *   const modalRef = useFocusTrap(isOpen);
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={modalRef} role="dialog">
 *       <h2>Modal Title</h2>
 *       <button>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap(isActive: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const cleanup = trapFocus(elementRef.current);
    return cleanup;
  }, [isActive]);

  return elementRef;
}

/**
 * Hook to manage focus restoration
 * Useful for modals that need to return focus to the trigger element
 *
 * @returns Object with saveFocus and restoreFocus functions
 *
 * @example
 * ```tsx
 * function ModalTrigger() {
 *   const { saveFocus, restoreFocus } = useFocusRestoration();
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   const handleOpen = () => {
 *     saveFocus();
 *     setIsOpen(true);
 *   };
 *
 *   const handleClose = () => {
 *     setIsOpen(false);
 *     restoreFocus();
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleOpen}>Open Modal</button>
 *       {isOpen && <Modal onClose={handleClose} />}
 *     </>
 *   );
 * }
 * ```
 */
export function useFocusRestoration() {
  const focusManager = useRef(new FocusManager());

  const saveFocus = useCallback(() => {
    focusManager.current.saveFocus();
  }, []);

  const restoreFocus = useCallback(() => {
    focusManager.current.restoreFocus();
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Hook to auto-focus an element on mount
 * Useful for focusing the first input in a form or modal
 *
 * @returns A ref to attach to the element that should be focused
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const inputRef = useAutoFocus<HTMLInputElement>();
 *
 *   return (
 *     <form>
 *       <input ref={inputRef} type="email" placeholder="Email" />
 *       <input type="password" placeholder="Password" />
 *     </form>
 *   );
 * }
 * ```
 */
export function useAutoFocus<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    elementRef.current?.focus();
  }, []);

  return elementRef;
}

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 * WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions)
 *
 * @returns True if user prefers reduced motion
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReduced = useReducedMotion();
 *
 *   return (
 *     <div className={prefersReduced ? 'no-animation' : 'with-animation'}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for keyboard navigation (arrow keys)
 * Useful for custom dropdowns, menus, and lists
 *
 * @param itemCount - Total number of items
 * @param onSelect - Callback when an item is selected
 * @param options - Configuration options
 * @returns Object with handleKeyDown function and currentIndex
 *
 * @example
 * ```tsx
 * function Dropdown({ items }) {
 *   const [selectedIndex, setSelectedIndex] = useState(0);
 *   const { handleKeyDown } = useKeyboardNavigation(
 *     items.length,
 *     (index) => setSelectedIndex(index),
 *     { loop: true, orientation: 'vertical' }
 *   );
 *
 *   return (
 *     <ul role="listbox" onKeyDown={handleKeyDown}>
 *       {items.map((item, index) => (
 *         <li
 *           key={index}
 *           role="option"
 *           aria-selected={index === selectedIndex}
 *         >
 *           {item}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useKeyboardNavigation(
  itemCount: number,
  onSelect: (index: number) => void,
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}
) {
  const { loop = true, orientation = 'vertical' } = options;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const nextKeys = orientation === 'vertical' ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight'];
      const prevKeys = orientation === 'vertical' ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft'];

      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        const nextIndex = currentIndex + 1;
        const newIndex = loop ? nextIndex % itemCount : Math.min(nextIndex, itemCount - 1);
        setCurrentIndex(newIndex);
        onSelect(newIndex);
      } else if (prevKeys.includes(event.key)) {
        event.preventDefault();
        const prevIndex = currentIndex - 1;
        const newIndex = loop ? (prevIndex + itemCount) % itemCount : Math.max(prevIndex, 0);
        setCurrentIndex(newIndex);
        onSelect(newIndex);
      } else if (event.key === 'Home') {
        event.preventDefault();
        setCurrentIndex(0);
        onSelect(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setCurrentIndex(itemCount - 1);
        onSelect(itemCount - 1);
      }
    },
    [currentIndex, itemCount, onSelect, loop, orientation]
  );

  return { handleKeyDown, currentIndex };
}

/**
 * Hook to announce messages to screen readers
 * Uses ARIA live regions to communicate dynamic updates
 * WCAG 2.1 Success Criterion 4.1.3 (Status Messages)
 *
 * @returns Function to announce messages
 *
 * @example
 * ```tsx
 * function Form() {
 *   const announce = useAnnouncer();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await submitForm(data);
 *       announce('Form submitted successfully', 'polite');
 *     } catch (error) {
 *       announce('Error submitting form', 'assertive');
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useAnnouncer() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');

    // Apply screen reader only styles
    Object.assign(announcement.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });

    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (announcement.parentNode) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return announce;
}

/**
 * Hook for managing locale in React components
 * Provides access to localized messages and locale switching
 *
 * @returns Object with current locale, messages, setLocale function, and loading state
 *
 * @example
 * ```tsx
 * function LanguageSwitcher() {
 *   const { locale, messages, setLocale, isLoading } = useA11yLocale();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <button onClick={() => setLocale('en')}>English</button>
 *       <button onClick={() => setLocale('sv')}>Svenska</button>
 *       <nav aria-label={messages.mainNavigation}>...</nav>
 *     </div>
 *   );
 * }
 * ```
 */
export interface UseA11yLocaleReturn {
  locale: Locale;
  messages: A11yMessages;
  setLocale: (newLocale: Locale) => Promise<void>;
  isLoading: boolean;
}

export function useA11yLocale(): UseA11yLocaleReturn {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<A11yMessages>({
    // Initialize with default values that will be replaced on mount
    // Navigation
    skipToContent: '',
    mainNavigation: '',
    userMenu: '',
    breadcrumb: '',
    pagination: '',
    siteNavigation: '',
    footerNavigation: '',
    // Common actions
    close: '',
    open: '',
    save: '',
    cancel: '',
    delete: '',
    edit: '',
    submit: '',
    search: '',
    loading: '',
    menu: '',
    // Pagination
    nextPage: '',
    previousPage: '',
    currentPage: '',
    goToPage: '',
    // Navigation links
    home: '',
    dashboard: '',
    settings: '',
    profile: '',
    // User menu
    login: '',
    logout: '',
    register: '',
    account: '',
    // Company
    customers: '',
    companies: '',
    modules: '',
    // States & Status
    required: '',
    optional: '',
    error: '',
    success: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial messages on mount
    import('@wajkie/a11y-core/locales')
      .then(({ getMessages, getCurrentLocale }) => {
        setMessages(getMessages());
        setLocaleState(getCurrentLocale());
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Failed to load locales:', error);
        setIsLoading(false);
      });
  }, []);

  const setLocale = useCallback(async (newLocale: Locale) => {
    setIsLoading(true);
    try {
      const { setLocale: setCoreLocale, getMessages } = await import('@wajkie/a11y-core/locales');
      await setCoreLocale(newLocale);
      setLocaleState(newLocale);
      setMessages(getMessages());
    } catch (error: unknown) {
      console.error('Failed to set locale:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { locale, messages, setLocale, isLoading };
}
