/**
 * ARIA helpers and utilities
 * WCAG 2.1 Success Criterion 4.1.2 (Name, Role, Value)
 */

/**
 * Generate unique ID for ARIA relationships
 * @param prefix - Optional prefix for the generated ID
 * @returns A unique identifier string
 * 
 * @example
 * ```ts
 * const labelId = generateId('label'); // 'label-x3k9f2m1'
 * ```
 */
export const generateId = (prefix: string = "a11y"): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Get ARIA label for loading state
 * @param isLoading - Whether the element is in loading state
 * @param defaultText - The default button/element text
 * @param loadingText - Optional custom loading text
 * @returns Appropriate label text
 * 
 * @example
 * ```ts
 * const label = getLoadingLabel(isLoading, 'Save', 'Saving...');
 * <button aria-label={label}>{label}</button>
 * ```
 */
export const getLoadingLabel = (isLoading: boolean, defaultText: string, loadingText?: string): string => {
  return isLoading ? (loadingText || `${defaultText}...`) : defaultText;
};

/**
 * Create descriptive button label
 * @param action - The action being performed (e.g., 'Delete', 'Edit')
 * @param target - Optional target of the action (e.g., 'user profile')
 * @returns A descriptive ARIA label
 * 
 * @example
 * ```ts
 * const label = createAriaLabel('Delete', 'user account');
 * // Returns: 'Delete user account'
 * ```
 */
export const createAriaLabel = (action: string, target?: string): string => {
  return target ? `${action} ${target}` : action;
};

/**
 * Create accessible error message ID
 * @param fieldId - The form field ID
 * @returns ID for the error message element
 * 
 * @example
 * ```ts
 * const errorId = getErrorId('email'); // 'email-error'
 * <input id="email" aria-describedby={errorId} />
 * <span id={errorId}>Invalid email</span>
 * ```
 */
export const getErrorId = (fieldId: string): string => {
  return `${fieldId}-error`;
};

/**
 * Create accessible description ID
 * @param fieldId - The form field ID
 * @returns ID for the description element
 * 
 * @example
 * ```ts
 * const descId = getDescriptionId('password');
 * <input id="password" aria-describedby={descId} />
 * <span id={descId}>Must be at least 8 characters</span>
 * ```
 */
export const getDescriptionId = (fieldId: string): string => {
  return `${fieldId}-description`;
};

/**
 * Get proper ARIA attributes for form field
 * @param fieldId - The form field ID
 * @param hasError - Whether the field has an error
 * @param hasDescription - Whether the field has a description
 * @returns Object with appropriate ARIA attributes
 * 
 * @example
 * ```ts
 * const ariaAttrs = getFormFieldAriaAttributes('email', true, false);
 * <input id="email" {...ariaAttrs} />
 * // Renders: <input id="email" aria-invalid="true" aria-describedby="email-error" />
 * ```
 */
export const getFormFieldAriaAttributes = (
  fieldId: string,
  hasError: boolean,
  hasDescription: boolean
): {
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
} => {
  const attributes: ReturnType<typeof getFormFieldAriaAttributes> = {};

  if (hasError) {
    attributes["aria-invalid"] = true;
    attributes["aria-describedby"] = getErrorId(fieldId);
  } else if (hasDescription) {
    attributes["aria-describedby"] = getDescriptionId(fieldId);
  }

  return attributes;
}

/**
 * ARIA role types for improved type safety
 */
export type AriaRole = 'button' | 'link' | 'navigation' | 'main' | 'dialog' | 'alert' | 'status' | 'menu' | 'menuitem' | 'tab' | 'tabpanel';

/**
 * ARIA live region priority levels
 */
export type AriaLive = 'polite' | 'assertive' | 'off';

/**
 * Props for elements with ARIA labels
 */
export interface AriaLabelProps {
  'aria-label': string;
  'aria-labelledby'?: string;
}

/**
 * Props for elements with ARIA descriptions
 */
export interface AriaDescriptionProps {
  'aria-describedby'?: string;
  'aria-description'?: string;
}
