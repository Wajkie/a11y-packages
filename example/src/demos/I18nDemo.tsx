import { useA11yLocale } from '@wajkie/react-a11y';

export function I18nDemo() {
  const { locale, messages, setLocale, isLoading } = useA11yLocale();

  if (isLoading) {
    return (
      <div className="demo-section">
        <h2>Internationalization (i18n)</h2>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="demo-section">
      <h2>Internationalization (i18n)</h2>
      <p>
        Built-in English and Swedish locales with 36+ translated UI strings.
      </p>
      <div className="language-switcher">
        <button
          onClick={() => setLocale('en')}
          aria-pressed={locale === 'en'}
          className={locale === 'en' ? 'active' : ''}
        >
          English
        </button>
        <button
          onClick={() => setLocale('sv')}
          aria-pressed={locale === 'sv'}
          className={locale === 'sv' ? 'active' : ''}
        >
          Svenska
        </button>
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Common Messages:</h3>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
          <li>
            {messages.close} • {messages.open} • {messages.save} • {messages.cancel}
          </li>
          <li>
            {messages.delete} • {messages.edit} • {messages.submit} • {messages.search}
          </li>
          <li>
            {messages.home} • {messages.dashboard} • {messages.settings} • {messages.profile}
          </li>
          <li>
            {messages.login} • {messages.logout} • {messages.register} • {messages.account}
          </li>
        </ul>
      </div>
    </div>
  );
}
