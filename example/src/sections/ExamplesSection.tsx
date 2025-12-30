import { ModalDemo } from '../demos/ModalDemo';
import { DropdownDemo } from '../demos/DropdownDemo';
import { FormDemo } from '../demos/FormDemo';
import { ReducedMotionDemo } from '../demos/ReducedMotionDemo';
import { I18nDemo } from '../demos/I18nDemo';

export function ExamplesSection() {
  return (
    <section id="examples" className="examples-section">
      <div className="demo-section examples-header">
        <h2>🎯 Interactive Examples</h2>
        <p style={{ marginTop: '0.5rem' }}>
          Try out the accessibility features below. Use keyboard navigation, test with a screen reader, or enable reduced motion preferences.
        </p>
      </div>

      <I18nDemo />
      <ModalDemo />
      <DropdownDemo />
      <FormDemo />
      <ReducedMotionDemo />

      <div className="demo-section">
        <h2>Testing Checklist</h2>
        <p>Try these accessibility tests:</p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
          <li>
            <strong>Keyboard Navigation:</strong> Use Tab, Enter, Escape, Arrow keys
          </li>
          <li>
            <strong>Screen Reader:</strong> Test with NVDA (Windows) or VoiceOver (Mac)
          </li>
          <li>
            <strong>Focus Visible:</strong> All interactive elements should show focus indicators
          </li>
          <li>
            <strong>Skip Link:</strong> Press Tab on page load to reveal skip navigation
          </li>
          <li>
            <strong>Announcements:</strong> Status changes are announced to screen readers
          </li>
          <li>
            <strong>Zoom:</strong> Test at 200% zoom level
          </li>
        </ul>
      </div>
    </section>
  );
}
