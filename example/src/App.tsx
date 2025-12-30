import { SkipNavigation, useA11yLocale, useAnnouncer } from '@wajkie/react-a11y';
import { DocumentationSection } from './sections/DocumentationSection';
import { ExamplesSection } from './sections/ExamplesSection';
import './App.css';

export default function App() {
  const { locale, messages, setLocale, isLoading } = useA11yLocale();
  const announce = useAnnouncer();

  const toggleLocale = async () => {
    const newLocale = locale === 'en' ? 'sv' : 'en';
    await setLocale(newLocale);
    announce(`Language changed to ${newLocale === 'en' ? 'English' : 'Swedish'}`, 'polite');
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading accessibility features...</p>
      </div>
    );
  }

  return (
    <>
      <SkipNavigation className="sr-only">{messages.skipToContent || 'Skip to main content'}</SkipNavigation>

      <header>
        <nav role="navigation" aria-label={messages.mainNavigation || 'Main navigation'}>
          <div className="logo">@wajkie/a11y</div>
          <ul className="nav-links">
            <li>
              <a href="#home" aria-current="page">
                {messages.home || 'Home'}
              </a>
            </li>
            <li>
              <a href="#docs">Documentation</a>
            </li>
            <li>
              <a href="#examples">Examples</a>
            </li>
            <li>
              <a href="https://github.com/wajkie" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <button 
                onClick={toggleLocale}
                className="locale-button"
                aria-label={`Switch to ${locale === 'en' ? 'Swedish' : 'English'}`}
                title={`Current language: ${locale === 'en' ? 'English' : 'Svenska'}`}
              >
                🌐 {locale.toUpperCase()}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div id="home" className="hero">
          <h1>Accessibility Packages Demo</h1>
          <p>
            Interactive examples demonstrating <code>@wajkie/a11y-core</code> and{' '}
            <code>@wajkie/react-a11y</code> packages in action.
          </p>
          <div className="status-message success">
            <strong>✓ WCAG 2.1 AA Compliant</strong> - All demos follow accessibility best
            practices
          </div>
        </div>

        <DocumentationSection />

        <ExamplesSection />

        <div className="demo-section">
          <h2>Package Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <h3>@wajkie/a11y-core</h3>
              <ul style={{ marginLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Framework-agnostic</li>
                <li>Focus management</li>
                <li>Screen reader utilities</li>
                <li>ARIA helpers</li>
                <li>i18n support (en, sv)</li>
              </ul>
            </div>
            <div>
              <h3>@wajkie/react-a11y</h3>
              <ul style={{ marginLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>React hooks</li>
                <li>Ready-to-use components</li>
                <li>TypeScript support</li>
                <li>Tree-shakeable</li>
                <li>React 18 & 19 compatible</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
