import { useReducedMotion } from '@wajkie/react-a11y';

export function ReducedMotionDemo() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="demo-section">
      <h2>Reduced Motion Detection</h2>
      <p>
        Demonstrates <code>useReducedMotion</code> hook (WCAG 2.3.3).
      </p>
      <div className="status-message info">
        <strong>Current preference:</strong>{' '}
        {prefersReduced ? 'Reduced motion enabled ✓' : 'Normal animations'}
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        Change this in your OS settings (Windows: Settings → Accessibility → Visual effects, macOS:
        System Preferences → Accessibility → Display → Reduce motion)
      </p>
    </div>
  );
}
