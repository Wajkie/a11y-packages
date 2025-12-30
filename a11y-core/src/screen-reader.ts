/**
 * Screen reader utilities
 * WCAG 2.1 Success Criterion 4.1.3 (Status Messages)
 */

/**
 * Screen reader only styles documentation
 * Apply these CSS properties to hide content visually while keeping it accessible to screen readers
 *
 * @example CSS
 * ```css
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border-width: 0;
 * }
 * ```
 *
 * @example Tailwind CSS
 * ```tsx
 * <span className="sr-only">Hidden text for screen readers</span>
 * ```
 */
export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;

/**
 * Announce message to screen readers
 * Uses ARIA live regions to communicate updates to assistive technology
 *
 * @param message - The message to announce
 * @param priority - 'polite' (default) waits for pause, 'assertive' interrupts immediately
 *
 * @example
 * ```ts
 * // Polite announcement (doesn't interrupt)
 * announceToScreenReader('Form saved successfully');
 *
 * // Assertive announcement (interrupts current speech)
 * announceToScreenReader('Error: Please correct the form', 'assertive');
 * ```
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  if (typeof document === 'undefined') {
    console.warn(
      '[a11y-core] announceToScreenReader: Running in non-browser environment. Announcement will be skipped.'
    );
    return;
  }

  if (!message) {
    console.warn('[a11y-core] announceToScreenReader: Empty message provided.');
    return;
  }

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
    document.body.removeChild(announcement);
  }, 1000);
};
