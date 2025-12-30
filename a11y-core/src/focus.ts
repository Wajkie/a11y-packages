/**
 * Focus management utilities
 * WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
 */

/**
 * Check if element is focusable
 * @param element - The HTML element to check
 * @returns True if the element can receive focus
 * 
 * @example
 * ```ts
 * const button = document.querySelector('button');
 * if (isFocusable(button)) {
 *   button.focus();
 * }
 * ```
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)) {
    return true;
  }

  if (element.hasAttribute("disabled")) {
    return false;
  }

  const focusableTags = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"];
  return focusableTags.includes(element.tagName);
}

/**
 * Trap focus within an element (for modals/dialogs)
 * Implements WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
 * 
 * @param element - The container element to trap focus within
 * @returns A cleanup function to remove the focus trap
 * 
 * @example
 * ```ts
 * const modal = document.querySelector('[role="dialog"]');
 * const cleanup = trapFocus(modal);
 * 
 * // Later, when closing the modal:
 * cleanup();
 * ```
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  if (!element) {
    console.error('[a11y-core] trapFocus: element is null or undefined. Make sure to pass a valid DOM element.');
    return () => {};
  }
  
  if (typeof document === 'undefined') {
    console.warn('[a11y-core] trapFocus: Running in non-browser environment. Focus trap will be disabled.');
    return () => {};
  }
  
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  element.addEventListener("keydown", handleKeyDown);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Manage focus restoration
 * Saves the currently focused element and allows restoring focus to it later
 * Useful for modal dialogs that need to return focus when closed
 * 
 * @example
 * ```ts
 * const focusManager = new FocusManager();
 * 
 * // Before opening modal
 * focusManager.saveFocus();
 * 
 * // After closing modal
 * focusManager.restoreFocus();
 * ```
 */
export class FocusManager {
  private previousElement: HTMLElement | null = null;

  /**
   * Save the currently focused element
   */
  saveFocus() {
    const activeElement = document.activeElement;
    this.previousElement = activeElement instanceof HTMLElement ? activeElement : null;
  }

  /**
   * Restore focus to the previously saved element
   */
  restoreFocus() {
    if (this.previousElement && typeof this.previousElement.focus === "function") {
      this.previousElement.focus();
    }
  }
}
