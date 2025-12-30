# @wajkie/a11y-core

Framework-agnostic accessibility utilities for WCAG 2.1 AA compliance. Build accessible web applications with confidence using battle-tested utilities for focus management, screen reader support, and ARIA patterns.

[![npm version](https://img.shields.io/npm/v/@wajkie/a11y-core.svg)](https://www.npmjs.com/package/@wajkie/a11y-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-61%2F61%20passing-brightgreen)](https://github.com/wajkie/a11y-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

## Features

- 🎯 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- ♿ **WCAG 2.1 AA Compliant** - Implements accessibility best practices
- 🌍 **Internationalized** - Built-in English and Swedish, extensible to any language
- 📦 **Tree-shakeable** - Only bundle what you use
- 💪 **TypeScript First** - Full type safety and IntelliSense
- 🪶 **Lightweight** - Zero dependencies, minimal footprint
- ✅ **Fully Tested** - 61 tests covering all features

## Installation

```bash
npm install @wajkie/a11y-core
```

## Quick Start

```typescript
import { 
  trapFocus, 
  announceToScreenReader, 
  generateId,
  setLocale,
  getMessages 
} from '@wajkie/a11y-core';

// Set language
await setLocale('sv'); // or 'en'
const messages = getMessages();

// Use localized messages
console.log(messages.close); // 'Stäng' (Swedish)

// Trap focus in a modal
const modal = document.querySelector('[role="dialog"]');
const cleanup = trapFocus(modal);

// Announce to screen readers
announceToScreenReader('Form submitted successfully', 'polite');

// Generate unique IDs for ARIA relationships
const labelId = generateId('label');
```

## Core Utilities

### Focus Management

#### `trapFocus(element: HTMLElement): () => void`

Traps keyboard focus within an element. Essential for modal dialogs and dropdown menus.

**WCAG:** 2.4.3 Focus Order (Level A)

```typescript
import { trapFocus } from '@wajkie/a11y-core';

const modal = document.querySelector('[role="dialog"]');
const cleanup = trapFocus(modal);

// When closing modal
cleanup();
```

#### `FocusManager`

Save and restore focus position. Useful when opening/closing modals.

```typescript
import { FocusManager } from '@wajkie/a11y-core';

const focusManager = new FocusManager();

// Before opening modal
focusManager.saveFocus();

// After closing modal
focusManager.restoreFocus();
```

#### `isFocusable(element: HTMLElement): boolean`

Check if an element can receive keyboard focus.

```typescript
import { isFocusable } from '@wajkie/a11y-core';

const element = document.querySelector('button');
if (isFocusable(element)) {
  element.focus();
}
```

### Screen Reader Support

#### `announceToScreenReader(message: string, priority?: 'polite' | 'assertive')`

Announce dynamic content changes to screen readers using ARIA live regions.

**WCAG:** 4.1.3 Status Messages (Level AA)

```typescript
import { announceToScreenReader } from '@wajkie/a11y-core';

// Polite (waits for screen reader to finish)
announceToScreenReader('3 new notifications');

// Assertive (interrupts immediately)
announceToScreenReader('Error: Connection lost', 'assertive');
```

#### `srOnlyStyles`

CSS-in-JS object for screen reader only content (visually hidden but accessible).

```typescript
import { srOnlyStyles } from '@wajkie/a11y-core';

const element = document.createElement('span');
Object.assign(element.style, srOnlyStyles);
element.textContent = 'Loading...';
```

**CSS Implementation:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### ARIA Helpers

#### `generateId(prefix?: string): string`

Generate unique IDs for ARIA relationships.

```typescript
import { generateId } from '@wajkie/a11y-core';

const labelId = generateId('label'); // 'label-x3k9f2m1'
const inputId = generateId('input'); // 'input-p8d2j5k3'
```

#### `getFormFieldAriaAttributes(fieldId, hasError, hasDescription)`

Get proper ARIA attributes for form fields.

**WCAG:** 3.3.1 Error Identification, 3.3.2 Labels or Instructions

```typescript
import { getFormFieldAriaAttributes, getErrorId } from '@wajkie/a11y-core';

const fieldId = 'email';
const attrs = getFormFieldAriaAttributes(fieldId, true, false);
// Returns: { 'aria-invalid': true, 'aria-describedby': 'email-error' }

// In HTML:
// <input id="email" aria-invalid="true" aria-describedby="email-error" />
// <span id="email-error">Invalid email format</span>
```

#### `createAriaLabel(action: string, target?: string): string`

Create descriptive ARIA labels for buttons and links.

```typescript
import { createAriaLabel } from '@wajkie/a11y-core';

const label = createAriaLabel('Delete', 'user account');
// Returns: 'Delete user account'

// Usage:
// <button aria-label="Delete user account">Delete</button>
```

### Utility Functions

#### `prefersReducedMotion(): boolean`

Detect if user prefers reduced motion.

**WCAG:** 2.3.3 Animation from Interactions (Level AAA)

```typescript
import { prefersReducedMotion } from '@wajkie/a11y-core';

if (prefersReducedMotion()) {
  // Disable animations
  element.style.transition = 'none';
}
```

#### `getLoadingLabel(isLoading, defaultText, loadingText?): string`

Get appropriate label for loading states.

```typescript
import { getLoadingLabel } from '@wajkie/a11y-core';

const label = getLoadingLabel(isLoading, 'Submit', 'Submitting...');
// When isLoading=true: 'Submitting...'
// When isLoading=false: 'Submit'
```

## Internationalization (i18n)

Built-in support for English and Swedish, with 36+ pre-translated UI strings.

### Available Locales

- `en` - English (US)
- `sv` - Swedish

### Usage

```typescript
import { setLocale, getMessages, getCurrentLocale } from '@wajkie/a11y-core/locales';

// Set locale (async)
await setLocale('sv');

// Get all messages
const messages = getMessages();

// Use in your app
document.querySelector('button').setAttribute('aria-label', messages.close);
```

### Available Messages

```typescript
interface A11yMessages {
  // Navigation
  skipToContent: string;
  mainNavigation: string;
  userMenu: string;
  breadcrumb: string;
  pagination: string;
  
  // Common actions
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
  
  // Pagination
  nextPage: string;
  previousPage: string;
  currentPage: string;
  goToPage: string;
  
  // Navigation links
  home: string;
  dashboard: string;
  settings: string;
  profile: string;
  
  // User menu
  login: string;
  logout: string;
  register: string;
  account: string;
  
  // States & Status
  required: string;
  optional: string;
  error: string;
  success: string;
}
```

### Add Custom Locale

```typescript
import { registerLocale, setLocale, A11yMessages } from '@wajkie/a11y-core/locales';

// Create your locale file (e.g., de.ts)
const de: A11yMessages = {
  skipToContent: 'Zum Hauptinhalt springen',
  mainNavigation: 'Hauptnavigation',
  close: 'Schließen',
  // ... all other keys (see A11yMessages interface)
};

// Register and use the locale
registerLocale('de', de);
await setLocale('de');
```

### TypeScript Autocomplete for Custom Locales

Add TypeScript autocomplete for your custom locales:

```typescript
// In your project's types/a11y.d.ts
declare module '@wajkie/a11y-core/locales' {
  interface CustomLocales {
    de: 'de';
    fr: 'fr';
    es: 'es';
  }
}

// Now setLocale has autocomplete for 'en', 'sv', 'de', 'fr', 'es'
await setLocale('de'); // ✓ TypeScript knows about 'de'
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
  AriaRole, 
  AriaLive, 
  AriaLabelProps,
  AriaDescriptionProps,
  Locale,
  A11yMessages 
} from '@wajkie/a11y-core';

// Type-safe ARIA props
const props: AriaLabelProps = {
  'aria-label': 'Main navigation',
  'aria-labelledby': 'nav-title'
};

// Type-safe locale
const locale: Locale = 'sv';
```

## WCAG 2.1 Compliance

This package helps you meet the following success criteria:

| Criterion | Level | Feature |
|-----------|-------|---------|
| 1.3.1 Info and Relationships | A | ARIA attributes, semantic helpers |
| 2.1.1 Keyboard | A | Focus management, keyboard traps |
| 2.1.2 No Keyboard Trap | A | Proper focus trap with escape |
| 2.4.1 Bypass Blocks | A | Skip navigation patterns |
| 2.4.3 Focus Order | A | Focus trap utility |
| 2.4.7 Focus Visible | AA | Focus management helpers |
| 3.3.1 Error Identification | A | Form field ARIA attributes |
| 3.3.2 Labels or Instructions | A | ARIA label helpers |
| 3.3.3 Error Suggestion | AA | Error message patterns |
| 4.1.2 Name, Role, Value | A | ARIA attributes |
| 4.1.3 Status Messages | AA | Screen reader announcements |

## Examples

### Modal Dialog

```typescript
import { trapFocus, FocusManager, announceToScreenReader } from '@wajkie/a11y-core';

class Modal {
  private cleanup: (() => void) | null = null;
  private focusManager = new FocusManager();

  open() {
    this.focusManager.saveFocus();
    
    const modal = document.querySelector('[role="dialog"]');
    this.cleanup = trapFocus(modal);
    
    announceToScreenReader('Modal opened', 'polite');
  }

  close() {
    if (this.cleanup) {
      this.cleanup();
    }
    this.focusManager.restoreFocus();
    announceToScreenReader('Modal closed', 'polite');
  }
}
```

### Form Validation

```typescript
import { getFormFieldAriaAttributes, getErrorId, announceToScreenReader } from '@wajkie/a11y-core';

const emailInput = document.getElementById('email');
const hasError = !emailInput.value.includes('@');

// Apply ARIA attributes
const attrs = getFormFieldAriaAttributes('email', hasError, false);
Object.entries(attrs).forEach(([key, value]) => {
  emailInput.setAttribute(key, String(value));
});

// Show error message
if (hasError) {
  const errorElement = document.getElementById(getErrorId('email'));
  errorElement.textContent = 'Please enter a valid email';
  announceToScreenReader('Email field has an error', 'assertive');
}
```

### Keyboard Navigation

```typescript
import { isFocusable } from '@wajkie/a11y-core';

const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));

menuItems.forEach((item, index) => {
  item.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      const next = menuItems[index + 1];
      if (next && isFocusable(next)) {
        next.focus();
      }
    }
  });
});
```

## Framework Integration

### Vanilla JavaScript

```javascript
import { trapFocus, announceToScreenReader } from '@wajkie/a11y-core';

const modal = document.querySelector('.modal');
const cleanup = trapFocus(modal);
```

### React (see @wajkie/react-a11y)

For React-specific hooks and components, use the companion package:

```bash
npm install @wajkie/react-a11y
```

### Vue

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { trapFocus } from '@wajkie/a11y-core';

const modalRef = ref(null);
let cleanup = null;

onMounted(() => {
  cleanup = trapFocus(modalRef.value);
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { trapFocus } from '@wajkie/a11y-core';

  let modal;
  let cleanup;

  onMount(() => {
    cleanup = trapFocus(modal);
  });

  onDestroy(() => {
    if (cleanup) cleanup();
  });
</script>

<div bind:this={modal} role="dialog">
  <!-- Modal content -->
</div>
```

## Testing

This package has comprehensive test coverage with **61/61 tests passing** using Vitest.

### What's Tested

#### Focus Management (15 tests)
- ✅ Focus trap creation and cleanup
- ✅ Tab key navigation within trapped focus
- ✅ Shift+Tab reverse navigation
- ✅ Focus restoration to previous element
- ✅ Auto-focus functionality on mount
- ✅ Edge cases with no focusable elements

#### Screen Reader Support (12 tests)
- ✅ ARIA live region creation (polite & assertive)
- ✅ Message announcement timing
- ✅ Cleanup of announcement elements
- ✅ Multiple simultaneous announcements
- ✅ Empty message handling

#### ARIA Utilities (18 tests)
- ✅ Unique ID generation
- ✅ ARIA label generation with templates
- ✅ Error message formatting
- ✅ Required field indicators
- ✅ Form validation messages
- ✅ Label-input relationships

#### Internationalization (16 tests)
- ✅ Locale switching (en ↔ sv)
- ✅ Message retrieval for both languages
- ✅ Fallback to English on error
- ✅ All 30+ message keys validated
- ✅ Custom locale registration
- ✅ Type safety for message keys

### Running Tests

```bash
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # With coverage report
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with ES2020 support

## Troubleshooting

Having issues? Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) for common problems and solutions:

- TypeScript configuration issues
- Module resolution errors
- SSR/Node.js compatibility
- Custom locale setup
- Build/bundle errors

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT © Wajkie

## Related Packages

- [@wajkie/react-a11y](https://www.npmjs.com/package/@wajkie/react-a11y) - React hooks and components

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
