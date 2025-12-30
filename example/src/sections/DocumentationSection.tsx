export function DocumentationSection() {
  return (
    <section id="docs" className="docs-section">
      <div className="demo-section">
        <h2>📚 Documentation</h2>
        
        <h3>Installation</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`# Install core package (framework-agnostic)
npm install @wajkie/a11y-core

# Install React package (includes core as dependency)
npm install @wajkie/react-a11y`}</code>
        </pre>

        <h3>Quick Start - React</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { SkipNavigation, useFocusTrap, useAnnouncer } from '@wajkie/react-a11y';

function App() {
  const announce = useAnnouncer();
  const modalRef = useFocusTrap<HTMLDivElement>(true);

  return (
    <>
      <SkipNavigation>Skip to main content</SkipNavigation>
      <main id="main-content">
        <button onClick={() => announce('Action completed', 'polite')}>
          Click me
        </button>
      </main>
    </>
  );
}`}</code>
        </pre>

        <h3>Adding New Locales</h3>
        <p>To add support for a new language, create a locale file in your project:</p>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`// locales/de.ts
export default {
  skipToContent: 'Zum Hauptinhalt springen',
  close: 'Schließen',
  menu: 'Menü',
  loading: 'Wird geladen...',
  error: 'Fehler',
  success: 'Erfolg',
  // Add more messages...
};

// In your app
import { setLocale } from '@wajkie/a11y-core/locales';
import deMessages from './locales/de';

// Register the locale
setLocale('de', deMessages);`}</code>
        </pre>

        <h3>Using i18n with React Hook</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { useA11yLocale } from '@wajkie/react-a11y';

function MyComponent() {
  const { locale, messages, setLocale, isLoading } = useA11yLocale();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => setLocale('sv')}>Svenska</button>
      <button onClick={() => setLocale('en')}>English</button>
      <p>{messages.welcome}</p>
    </div>
  );
}`}</code>
        </pre>

        <h3>Extending Messages</h3>
        <p>You can extend the default message set with your own custom messages:</p>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`// Custom messages for your app
const customMessages = {
  en: {
    ...enMessages,  // Import from '@wajkie/a11y-core/locales'
    welcomeMessage: 'Welcome to our app',
    loginButton: 'Sign in to continue',
    logoutButton: 'Sign out',
  },
  sv: {
    ...svMessages,
    welcomeMessage: 'Välkommen till vår app',
    loginButton: 'Logga in för att fortsätta',
    logoutButton: 'Logga ut',
  }
};`}</code>
        </pre>

        <h3>Available Hooks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useFocusTrap</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Traps focus within a component (e.g., modals, dropdowns). Returns a ref to attach to the container.
            </p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useFocusRestoration</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Saves and restores focus when opening/closing modals. Use <code>saveFocus()</code> and <code>restoreFocus()</code>.
            </p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useAutoFocus</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Automatically focuses an element on mount. Returns a ref to attach to the target element.
            </p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useAnnouncer</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Announces messages to screen readers. Call <code>announce(message, priority)</code> where priority is 'polite' or 'assertive'.
            </p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useKeyboardNavigation</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Handles arrow key navigation for lists and menus. Returns <code>focusedIndex</code> and <code>props</code> to spread on container.
            </p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useReducedMotion</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Detects user's reduced motion preference. Returns <code>true</code> if user prefers reduced motion.
            </p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4><code>useA11yLocale</code></h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Manages locale state and provides localized messages. Returns <code>locale</code>, <code>messages</code>, <code>setLocale</code>, and <code>isLoading</code>.
            </p>
          </div>
        </div>

        <h3>Core Utilities (Framework-agnostic)</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { 
  announceToScreenReader,
  trapFocus,
  saveFocus,
  restoreFocus,
  autoFocus,
  generateAriaLabel,
  formatErrorMessage
} from '@wajkie/a11y-core';

// Announce to screen reader
announceToScreenReader('Item added to cart', 'polite');

// Manage focus programmatically
const cleanup = trapFocus(modalElement);
// Later: cleanup();

// Generate accessible labels
const label = generateAriaLabel('user', { name: 'John' }); // "User: John"`}</code>
        </pre>

        <h3>Building Custom Accessible Components</h3>
        <p>Here's how to create your own accessible components using the hooks:</p>

        <h4>1. Accessible Alert Component</h4>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { useAnnouncer } from '@wajkie/react-a11y';
import { useEffect } from 'react';

function Alert({ message, type = 'info' }) {
  const announce = useAnnouncer();

  useEffect(() => {
    // Announce when alert appears
    const priority = type === 'error' ? 'assertive' : 'polite';
    announce(message, priority);
  }, [message, type, announce]);

  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={\`alert alert-\${type}\`}
    >
      {message}
    </div>
  );
}

// Usage:
<Alert message="File uploaded successfully" type="success" />
<Alert message="Error: Invalid input" type="error" />`}</code>
        </pre>

        <h4>2. Accessible Tabs Component</h4>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { useKeyboardNavigation, useAnnouncer } from '@wajkie/react-a11y';
import { generateId } from '@wajkie/a11y-core';
import { useState, useRef, useEffect } from 'react';

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const announce = useAnnouncer();
  const tablistRef = useRef(null);

  const { handleKeyDown } = useKeyboardNavigation(
    tabs.length,
    (index) => {
      setActiveTab(index);
      announce(\`\${tabs[index].label} tab selected\`, 'polite');
    },
    { orientation: 'horizontal', loop: true }
  );

  const tabsIds = tabs.map((_, i) => ({
    tab: generateId(\`tab-\${i}\`),
    panel: generateId(\`panel-\${i}\`)
  }));

  return (
    <>
      <div role="tablist" ref={tablistRef} onKeyDown={handleKeyDown}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            id={tabsIds[index].tab}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={tabsIds[index].panel}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={index}
          id={tabsIds[index].panel}
          role="tabpanel"
          aria-labelledby={tabsIds[index].tab}
          hidden={activeTab !== index}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}

// Usage:
<Tabs tabs={[
  { label: 'Profile', content: <ProfileForm /> },
  { label: 'Settings', content: <SettingsForm /> },
  { label: 'Security', content: <SecurityForm /> }
]} />`}</code>
        </pre>

        <h4>3. Accessible Combobox (Autocomplete)</h4>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { useKeyboardNavigation, useAnnouncer } from '@wajkie/react-a11y';
import { generateId } from '@wajkie/a11y-core';
import { useState, useRef, useEffect } from 'react';

function Combobox({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(options);
  const announce = useAnnouncer();
  const inputRef = useRef(null);
  const listboxId = generateId('listbox');

  const { handleKeyDown, currentIndex } = useKeyboardNavigation(
    filtered.length,
    (index) => {
      onSelect(filtered[index]);
      setQuery(filtered[index].label);
      setIsOpen(false);
      announce(\`\${filtered[index].label} selected\`, 'assertive');
    }
  );

  useEffect(() => {
    const results = options.filter(opt =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
    
    if (query && results.length > 0) {
      announce(\`\${results.length} results available\`, 'polite');
    }
  }, [query, options, announce]);

  return (
    <div className="combobox">
      <label htmlFor="combo-input">Search:</label>
      <input
        id="combo-input"
        ref={inputRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && filtered.length > 0 && (
        <ul id={listboxId} role="listbox">
          {filtered.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={index === currentIndex}
              onClick={() => {
                onSelect(option);
                setQuery(option.label);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Usage:
<Combobox
  options={countries}
  onSelect={(country) => console.log(country)}
/>`}</code>
        </pre>

        <h4>4. Accessible Tooltip</h4>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { generateId } from '@wajkie/a11y-core';
import { useState } from 'react';

function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = generateId('tooltip');

  return (
    <span style={{ position: 'relative' }}>
      <button
        aria-describedby={isVisible ? tooltipId : undefined}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </button>
      
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}

// Usage:
<Tooltip content="Click to save your changes">
  <SaveIcon />
</Tooltip>`}</code>
        </pre>

        <h4>5. Accessible Dialog with Focus Lock</h4>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          <code>{`import { useFocusTrap, useFocusRestoration, useAnnouncer } from '@wajkie/react-a11y';
import { generateId } from '@wajkie/a11y-core';
import { useEffect } from 'react';

function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useFocusTrap(isOpen);
  const { saveFocus, restoreFocus } = useFocusRestoration();
  const announce = useAnnouncer();
  const titleId = generateId('dialog-title');
  const descId = generateId('dialog-desc');

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      announce(\`\${title} dialog opened\`, 'polite');
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      restoreFocus();
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, announce, saveFocus, restoreFocus]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        <div id={descId}>{children}</div>
        
        <button onClick={onClose} aria-label="Close dialog">
          ×
        </button>
      </div>
    </div>
  );
}

// Usage:
<Dialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to continue?</p>
  <button onClick={handleConfirm}>Confirm</button>
  <button onClick={() => setShowDialog(false)}>Cancel</button>
</Dialog>`}</code>
        </pre>

        <h4>Best Practices for Custom Components</h4>
        <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
          <li>✅ Use semantic HTML elements (button, nav, main, etc.)</li>
          <li>✅ Add proper ARIA roles, states, and properties</li>
          <li>✅ Implement keyboard navigation (Tab, Arrow keys, Escape, Enter)</li>
          <li>✅ Announce dynamic changes with <code>useAnnouncer</code></li>
          <li>✅ Manage focus with <code>useFocusTrap</code> and <code>useFocusRestoration</code></li>
          <li>✅ Generate unique IDs with <code>generateId</code> for ARIA relationships</li>
          <li>✅ Respect reduced motion preferences with <code>useReducedMotion</code></li>
          <li>✅ Test with keyboard only and screen readers</li>
          <li>✅ Use <code>useA11yLocale</code> for internationalized labels</li>
          <li>✅ Ensure color contrast meets WCAG AA (4.5:1 for text)</li>
        </ul>
      </div>
    </section>
  );
}
