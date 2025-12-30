import { useState } from 'react';
import { useAnnouncer, useA11yLocale } from '@wajkie/react-a11y';

export function FormDemo() {
  const announce = useAnnouncer();
  const { messages } = useA11yLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setSuccess('');
      announce(`${messages.error || 'Error'}: Invalid email address`, 'assertive');
      return;
    }

    setError('');
    setSuccess('Form submitted successfully!');
    announce(`${messages.success || 'Success'}: Form submitted`, 'polite');
  };

  return (
    <div className="demo-section">
      <h2>Form with Validation & Announcements</h2>
      <p>
        Demonstrates <code>useAnnouncer</code> hook for screen reader feedback.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">
            Email Address <span aria-label={messages.required || 'required'}>*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'email-error' : 'email-hint'}
            placeholder="your@email.com"
          />
          {!error && (
            <span id="email-hint" className="form-hint">
              We'll never share your email.
            </span>
          )}
          {error && (
            <span id="email-error" className="form-error" role="alert">
              ⚠️ {error}
            </span>
          )}
          {success && (
            <span className="form-success" role="status">
              ✓ {success}
            </span>
          )}
        </div>
        <button type="submit" className="button">
          {messages.submit}
        </button>
      </form>
    </div>
  );
}
