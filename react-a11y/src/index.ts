/**
 * @wajkie/react-a11y
 * React hooks and components for accessibility (WCAG 2.1 AA)
 */

// Export hooks
export {
  useFocusTrap,
  useFocusRestoration,
  useAutoFocus,
  useReducedMotion,
  useKeyboardNavigation,
  useAnnouncer,
  useA11yLocale,
  type UseA11yLocaleReturn,
} from './hooks/useAccessibility';

// Export components
export { SkipNavigation } from './components/SkipNavigation';
export type { SkipNavigationProps } from './components/SkipNavigation';

// Re-export types from core
export type { AriaRole, AriaLive, AriaLabelProps, AriaDescriptionProps } from '@wajkie/a11y-core';

export type { Locale, A11yMessages } from '@wajkie/a11y-core/locales';
