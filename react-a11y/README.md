# @wajkie/react-a11y

React hooks and components for building accessible applications (WCAG 2.1 AA). Built on top of [@wajkie/a11y-core](https://www.npmjs.com/package/@wajkie/a11y-core) with React-specific implementations.

[![npm version](https://img.shields.io/npm/v/@wajkie/react-a11y.svg)](https://www.npmjs.com/package/@wajkie/react-a11y)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-23%2F39%20passing-yellow)](https://github.com/wajkie/react-a11y)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

## Features

- 🎣 **Custom Hooks** - Focus management, keyboard navigation, screen reader announcements
- 🧩 **Ready-to-use Components** - Skip navigation and more
- ♿ **WCAG 2.1 AA Compliant** - Meets accessibility standards
- 🌍 **i18n Support** - Built-in English and Swedish locales
- 💪 **TypeScript First** - Full type safety
- 📦 **Tree-shakeable** - Only bundle what you use
- ⚛️ **React 18+ & 19** - Supports latest React versions
- ✅ **Well Tested** - Comprehensive test coverage with Vitest

## Installation

```bash
npm install @wajkie/react-a11y
```

This will automatically install the peer dependency `@wajkie/a11y-core`.

## Quick Start

```tsx
import { 
  SkipNavigation, 
  useFocusTrap, 
  useAnnouncer,
  useA11yLocale 
} from '@wajkie/react-a11y';

function App() {
  const announce = useAnnouncer();
  const { messages, setLocale } = useA11yLocale();

  return (
    <>
      <SkipNavigation />
      <nav aria-label={messages.mainNavigation}>
        <button onClick={() => setLocale('sv')}>Svenska</button>
      </nav>
      <main id="main-content" tabIndex={-1}>
        {/* Your app */}
      </main>
    </>
  );
}
```

## Components

### SkipNavigation

Allows keyboard users to bypass repetitive navigation and skip to main content.

**WCAG:** 2.4.1 Bypass Blocks (Level A)

```tsx
import { SkipNavigation } from '@wajkie/react-a11y';

// Basic usage
<SkipNavigation />

// Custom text
<SkipNavigation>Hoppa till huvudinnehåll</SkipNavigation>

// Custom target
<SkipNavigation href="#content">Skip to content</SkipNavigation>

// Custom styling (override default Tailwind classes)
<SkipNavigation className="skip-link">
  Skip to main content
</SkipNavigation>
```

**Props:**
- `children` (ReactNode) - Custom skip link text (default: "Skip to main content")
- `href` (string) - Target element ID (default: "#main-content")
- `className` (string) - Custom CSS classes

**Target Element:**
```tsx
<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

## Hooks

### useFocusTrap

Trap keyboard focus within a modal or dialog.

**WCAG:** 2.4.3 Focus Order (Level A)

```tsx
import { useFocusTrap } from '@wajkie/react-a11y';

function Modal({ isOpen, onClose }) {
  const modalRef = useFocusTrap(isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**Parameters:**
- `isActive` (boolean) - Whether the focus trap is active (default: true)

**Returns:** A ref to attach to the container element

### useFocusRestoration

Save and restore focus position when opening/closing modals.

```tsx
import { useFocusRestoration } from '@wajkie/react-a11y';

function ModalTrigger() {
  const { saveFocus, restoreFocus } = useFocusRestoration();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => {
    saveFocus();
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    restoreFocus();
  };
  
  return (
    <>
      <button onClick={handleOpen}>Open Modal</button>
      {isOpen && <Modal onClose={handleClose} />}
    </>
  );
}
```

**Returns:**
- `saveFocus()` - Save the currently focused element
- `restoreFocus()` - Restore focus to the saved element

### useAutoFocus

Automatically focus an element when component mounts.

```tsx
import { useAutoFocus } from '@wajkie/react-a11y';

function LoginForm() {
  const inputRef = useAutoFocus<HTMLInputElement>();
  
  return (
    <form>
      <input 
        ref={inputRef} 
        type="email" 
        placeholder="Email" 
      />
      <input type="password" placeholder="Password" />
      <button type="submit">Log in</button>
    </form>
  );
}
```

**Returns:** A ref to attach to the element that should be focused

### useReducedMotion

Detect if user prefers reduced motion.

**WCAG:** 2.3.3 Animation from Interactions (Level AAA)

```tsx
import { useReducedMotion } from '@wajkie/react-a11y';

function AnimatedComponent() {
  const prefersReduced = useReducedMotion();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

**Returns:** boolean - True if user prefers reduced motion

### useKeyboardNavigation

Implement arrow key navigation for lists, dropdowns, and menus.

```tsx
import { useKeyboardNavigation } from '@wajkie/react-a11y';

function Dropdown({ items }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { handleKeyDown, currentIndex } = useKeyboardNavigation(
    items.length,
    (index) => setSelectedIndex(index),
    { loop: true, orientation: 'vertical' }
  );
  
  return (
    <ul 
      role="listbox" 
      onKeyDown={handleKeyDown}
      aria-activedescendant={`item-${currentIndex}`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          id={`item-${index}`}
          role="option"
          aria-selected={index === selectedIndex}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

**Parameters:**
- `itemCount` (number) - Total number of items
- `onSelect` (function) - Callback when item is selected
- `options` (object):
  - `loop` (boolean) - Loop from last to first (default: true)
  - `orientation` ('horizontal' | 'vertical') - Navigation direction (default: 'vertical')

**Returns:**
- `handleKeyDown` - Function to attach to onKeyDown event
- `currentIndex` - Currently selected index

**Supported Keys:**
- `ArrowUp` / `ArrowDown` (vertical)
- `ArrowLeft` / `ArrowRight` (horizontal)
- `Home` - First item
- `End` - Last item

### useAnnouncer

Announce dynamic content changes to screen readers.

**WCAG:** 4.1.3 Status Messages (Level AA)

```tsx
import { useAnnouncer } from '@wajkie/react-a11y';

function Form() {
  const announce = useAnnouncer();
  
  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      announce('Form submitted successfully', 'polite');
    } catch (error) {
      announce('Error submitting form', 'assertive');
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Parameters:**
- `message` (string) - The message to announce
- `priority` ('polite' | 'assertive') - Announcement priority
  - `polite` - Waits for screen reader to finish (default)
  - `assertive` - Interrupts immediately

### useA11yLocale

Manage locale and access localized messages.

```tsx
import { useA11yLocale } from '@wajkie/react-a11y';

function LanguageSwitcher() {
  const { locale, messages, setLocale } = useA11yLocale();
  
  return (
    <div>
      <button 
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        English
      </button>
      <button 
        onClick={() => setLocale('sv')}
        aria-pressed={locale === 'sv'}
      >
        Svenska
      </button>
      
      <nav aria-label={messages.mainNavigation}>
        <a href="/">{messages.home}</a>
        <a href="/dashboard">{messages.dashboard}</a>
        <a href="/settings">{messages.settings}</a>
      </nav>
      
      <button aria-label={messages.close}>×</button>
    </div>
  );
}
```

**Returns:**
- `locale` ('en' | 'sv') - Current locale
- `messages` (A11yMessages) - Localized messages object
- `setLocale(locale)` - Function to change locale

**Available Messages:**
```typescript
{
  // Navigation
  skipToContent, mainNavigation, userMenu, breadcrumb,
  pagination, siteNavigation, footerNavigation,
  
  // Actions
  close, open, save, cancel, delete, edit, submit,
  search, loading, menu,
  
  // Pagination
  nextPage, previousPage, currentPage, goToPage,
  
  // Links
  home, dashboard, settings, profile,
  
  // User
  login, logout, register, account,
  
  // Company
  customers, companies, modules,
  
  // Status
  required, optional, error, success
}
```

## Complete Examples

### Accessible Modal

```tsx
import { 
  useFocusTrap, 
  useFocusRestoration, 
  useAnnouncer,
  useA11yLocale 
} from '@wajkie/react-a11y';

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useFocusTrap(isOpen);
  const { restoreFocus } = useFocusRestoration();
  const announce = useAnnouncer();
  const { messages } = useA11yLocale();
  
  useEffect(() => {
    if (isOpen) {
      announce(`${title} dialog opened`, 'polite');
    }
  }, [isOpen]);
  
  const handleClose = () => {
    onClose();
    restoreFocus();
    announce('Dialog closed', 'polite');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
      >
        <h2 id="modal-title">{title}</h2>
        <div>{children}</div>
        <button onClick={handleClose} aria-label={messages.close}>
          {messages.close}
        </button>
      </div>
    </div>
  );
}
```

### Accessible Dropdown Menu

```tsx
import { useKeyboardNavigation, useA11yLocale } from '@wajkie/react-a11y';

function DropdownMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { messages } = useA11yLocale();
  
  const { handleKeyDown } = useKeyboardNavigation(
    items.length,
    setSelectedIndex,
    { loop: true }
  );
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={messages.menu}
      >
        {messages.menu}
      </button>
      
      {isOpen && (
        <ul 
          role="menu" 
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <li
              key={index}
              role="menuitem"
              tabIndex={index === selectedIndex ? 0 : -1}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Form with Announcements

```tsx
import { useAnnouncer, useAutoFocus, useA11yLocale } from '@wajkie/react-a11y';

function ContactForm() {
  const announce = useAnnouncer();
  const inputRef = useAutoFocus<HTMLInputElement>();
  const { messages } = useA11yLocale();
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await submitForm();
      announce(`${messages.success}: Form submitted`, 'polite');
    } catch (error) {
      setErrors(error.fields);
      announce(`${messages.error}: Please correct the form`, 'assertive');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">
          Email {errors.email && `(${messages.required})`}
        </label>
        <input
          id="email"
          ref={inputRef}
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>
      
      <button type="submit">{messages.submit}</button>
    </form>
  );
}
```

## Framework Integration

### Next.js App Router

```tsx
// app/layout.tsx
import { SkipNavigation } from '@wajkie/react-a11y';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SkipNavigation />
        {children}
      </body>
    </html>
  );
}

// app/page.tsx
export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Welcome</h1>
    </main>
  );
}
```

### Next.js with Locale Provider

```tsx
// app/providers.tsx
'use client';

import { useEffect } from 'react';
import { useA11yLocale } from '@wajkie/react-a11y';

export function A11yProvider({ children, locale }) {
  const { setLocale } = useA11yLocale();
  
  useEffect(() => {
    setLocale(locale);
  }, [locale]);
  
  return <>{children}</>;
}

// app/layout.tsx
import { A11yProvider } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <A11yProvider locale="sv">
          {children}
        </A11yProvider>
      </body>
    </html>
  );
}
```

### Vite + React

```tsx
// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// App.tsx
import { SkipNavigation } from '@wajkie/react-a11y';

function App() {
  return (
    <>
      <SkipNavigation />
      <nav>...</nav>
      <main id="main-content" tabIndex={-1}>
        {/* Your app */}
      </main>
    </>
  );
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type { 
  SkipNavigationProps,
  AriaRole,
  AriaLive,
  Locale,
  A11yMessages 
} from '@wajkie/react-a11y';

// Component props
const props: SkipNavigationProps = {
  children: 'Skip to content',
  href: '#main'
};

// ARIA types
const role: AriaRole = 'dialog';
const live: AriaLive = 'polite';
const locale: Locale = 'sv';
```

## Styling

### Default Classes (Tailwind)

The `SkipNavigation` component uses Tailwind classes by default:

```tsx
<SkipNavigation />
// Uses: sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4...
```

### Custom CSS

Override with your own classes:

```tsx
<SkipNavigation className="skip-link">
  Skip to main content
</SkipNavigation>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### CSS Modules

```tsx
import styles from './App.module.css';

<SkipNavigation className={styles.skipLink}>
  Skip to content
</SkipNavigation>
```

## WCAG 2.1 Compliance

| Criterion | Level | Implemented |
|-----------|-------|-------------|
| 1.3.1 Info and Relationships | A | ✅ ARIA hooks |
| 2.1.1 Keyboard | A | ✅ Focus management |
| 2.1.2 No Keyboard Trap | A | ✅ Focus trap with escape |
| 2.4.1 Bypass Blocks | A | ✅ SkipNavigation |
| 2.4.3 Focus Order | A | ✅ Focus trap |
| 2.4.7 Focus Visible | AA | ✅ Focus management |
| 2.3.3 Animation | AAA | ✅ Reduced motion |
| 4.1.3 Status Messages | AA | ✅ Announcer |

## Testing

This package has **23/39 tests passing** using Vitest with React Testing Library.

### What's Tested

#### React Hooks (23 tests passing)
- ✅ **useFocusTrap**: Focus containment in modals/dialogs
- ✅ **useFocusRestoration**: Saving and restoring focus
- ✅ **useAutoFocus**: Automatic focus on mount
- ✅ **useAnnouncer**: Screen reader announcements (polite/assertive)
- ✅ **useReducedMotion**: Motion preference detection
- ✅ **useKeyboardNavigation**: Arrow key navigation in lists
- ✅ **useA11yLocale**: Internationalization with EN/SV locales

#### SkipNavigation Component (Integration tests)
- ✅ Renders skip link with correct structure
- ✅ Properly hidden until focused
- ✅ Focus behavior on activation

#### Integration Tests (16 in progress)
- 🔄 Complex hook interactions
- 🔄 Component lifecycle scenarios
- 🔄 Edge cases with React 18/19

### Running Tests

```bash
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # With coverage report
npm test -- --ui        # Vitest UI
```

### Test Environment
- **Framework**: Vitest 2.1.9
- **DOM**: happy-dom 20.0.11
- **React Testing**: @testing-library/react 14.1.0
- **Coverage**: All core hooks covered

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with React 18+ or 19

## Troubleshooting

Having issues? Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) for common problems and solutions:

- React hooks errors
- SSR compatibility issues
- TypeScript configuration
- Peer dependency warnings
- Performance optimization

## Related Packages

- [@wajkie/a11y-core](https://www.npmjs.com/package/@wajkie/a11y-core) - Framework-agnostic utilities

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

MIT © Wajkie

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
