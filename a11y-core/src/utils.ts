/**
 * General accessibility utility functions
 */

/**
 * WCAG color contrast checker (simplified)
 * Returns true if contrast ratio is at least 4.5:1 (AA standard for normal text)
 * 
 * @param _color1 - First color (for future implementation)
 * @param _color2 - Second color (for future implementation)
 * @returns Whether the colors meet minimum contrast
 * 
 * @remarks
 * This is a placeholder. In production, use a proper color contrast library
 * like 'color-contrast-checker' or 'wcag-contrast'
 */
export const hasMinimumContrast = (_color1?: string, _color2?: string): boolean => {
  // Simplified - in production, use a proper color contrast library
  // This is a placeholder that always returns true
  // Implement with a library like 'color-contrast-checker' or 'wcag-contrast'
  return true;
};

/**
 * Check if reduced motion is preferred
 * Respects user's prefers-reduced-motion setting
 * WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions)
 * 
 * @returns True if user prefers reduced motion
 * 
 * @example
 * ```ts
 * if (prefersReducedMotion()) {
 *   // Skip animations
 *   element.classList.add('no-transition');
 * }
 * ```
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
