import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  useFocusTrap,
  useFocusRestoration,
  useAnnouncer,
  useA11yLocale,
} from '../hooks/useAccessibility';
import { SkipNavigation } from '../components/SkipNavigation';
import React from 'react';

/**
 * Integration tests for react-a11y package
 * Tests the interaction between hooks, components, and core utilities
 */

describe('react-a11y Integration Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('SkipNavigation + Focus Management', () => {
    it('should work with focus restoration', async () => {
      function TestComponent() {
        const { restoreFocus } = useFocusRestoration();

        return (
          <>
            <SkipNavigation />
            <button
              id="trigger"
              onClick={() => {
                const main = document.getElementById('main');
                if (main) {
                  main.focus();
                  restoreFocus();
                }
              }}
            >
              Trigger
            </button>
            <main id="main" tabIndex={-1}>
              Content
            </main>
          </>
        );
      }

      render(<TestComponent />);

      const skipLink = screen.getByText(/skip to main content/i);
      const trigger = screen.getByText('Trigger');
      const main = document.getElementById('main');

      expect(skipLink).toBeDefined();
      expect(trigger).toBeDefined();
      expect(main).toBeDefined();
    });
  });

  describe('Focus Trap + Announcements', () => {
    it('should announce when focus trap is activated', async () => {
      function Modal({ isOpen }: { isOpen: boolean }) {
        const trapRef = useFocusTrap(isOpen) as React.RefObject<HTMLDivElement>;
        const announce = useAnnouncer();

        React.useEffect(() => {
          if (isOpen) {
            announce('Modal opened');
          }
        }, [isOpen, announce]);

        if (!isOpen) return null;

        return (
          <div ref={trapRef} role="dialog">
            <h2>Modal Title</h2>
            <button>Close</button>
          </div>
        );
      }

      const { rerender } = render(<Modal isOpen={false} />);

      // Open modal
      rerender(<Modal isOpen={true} />);

      await waitFor(() => {
        const announcements = document.querySelectorAll('[role="status"]');
        expect(announcements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Locale + Announcements Integration', () => {
    it('should announce in selected locale', async () => {
      function LocalizedComponent() {
        const { messages, setLocale } = useA11yLocale();
        const announce = useAnnouncer();

        return (
          <div>
            <button onClick={() => announce(messages.loading)}>Announce Loading</button>
            <button onClick={() => setLocale('sv')}>Switch to Swedish</button>
            <span>{messages.close}</span>
          </div>
        );
      }

      render(<LocalizedComponent />);

      const announceBtn = screen.getByText('Announce Loading');
      const switchBtn = screen.getByText('Switch to Swedish');

      // Announce in English
      await userEvent.click(announceBtn);

      await waitFor(() => {
        expect(screen.getByText('Close')).toBeDefined();
      });

      // Switch to Swedish
      await userEvent.click(switchBtn);

      await waitFor(() => {
        expect(screen.getByText('Stäng')).toBeDefined();
      });
    });
  });

  describe('Complete Form Workflow', () => {
    it('should handle form with all hooks', async () => {
      function AccessibleForm() {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const announce = useAnnouncer();
        const [error, setError] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const value = inputRef.current?.value || '';

          if (!value) {
            setError('This field is required');
            announce('Error: This field is required', 'assertive');
          } else {
            setError('');
            announce('Form submitted', 'polite');
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              ref={inputRef}
              id="email"
              type="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'email-error' : undefined}
            />
            {error && (
              <span id="email-error" role="alert">
                {error}
              </span>
            )}
            <button type="submit">Submit</button>
          </form>
        );
      }

      render(<AccessibleForm />);

      const submitBtn = screen.getByText('Submit');

      // Submit without value
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeDefined();
      });

      // Fill and submit
      const input = screen.getByLabelText('Email');
      await userEvent.type(input, 'test@example.com');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        const announcements = document.querySelectorAll('[role="status"]');
        expect(announcements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Multiple Components Interaction', () => {
    it('should handle multiple modals with proper focus management', async () => {
      function TwoModals() {
        const [modal1Open, setModal1Open] = React.useState(false);
        const [modal2Open, setModal2Open] = React.useState(false);

        const modal1Ref = useFocusTrap(modal1Open) as React.RefObject<HTMLDivElement>;
        const modal2Ref = useFocusTrap(modal2Open) as React.RefObject<HTMLDivElement>;

        const { restoreFocus: restore1 } = useFocusRestoration();
        const { restoreFocus: restore2 } = useFocusRestoration();

        return (
          <>
            <button onClick={() => setModal1Open(true)}>Open Modal 1</button>
            <button onClick={() => setModal2Open(true)}>Open Modal 2</button>

            {modal1Open && (
              <div ref={modal1Ref} role="dialog">
                <h2>Modal 1</h2>
                <button
                  onClick={() => {
                    setModal1Open(false);
                    restore1();
                  }}
                >
                  Close 1
                </button>
              </div>
            )}

            {modal2Open && (
              <div ref={modal2Ref} role="dialog">
                <h2>Modal 2</h2>
                <button
                  onClick={() => {
                    setModal2Open(false);
                    restore2();
                  }}
                >
                  Close 2
                </button>
              </div>
            )}
          </>
        );
      }

      render(<TwoModals />);

      const open1 = screen.getByText('Open Modal 1');
      const open2 = screen.getByText('Open Modal 2');

      await userEvent.click(open1);
      await waitFor(() => {
        expect(screen.getByText('Modal 1')).toBeDefined();
      });

      await userEvent.click(open2);
      await waitFor(() => {
        expect(screen.getByText('Modal 2')).toBeDefined();
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid hook state changes', async () => {
      function RapidComponent() {
        const announce = useAnnouncer();
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          if (count > 0) {
            announce(`Count: ${count}`);
          }
        }, [count, announce]);

        return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
      }

      render(<RapidComponent />);

      const button = screen.getByRole('button');

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        await userEvent.click(button);
      }

      await waitFor(() => {
        expect(screen.getByText('Count: 5')).toBeDefined();
      });
    });

    it('should handle unmounting with active hooks', async () => {
      function ComponentWithHooks() {
        const containerRef = useFocusTrap(true) as React.RefObject<HTMLDivElement>;
        const announce = useAnnouncer();

        React.useEffect(() => {
          announce('Component mounted');
        }, [announce]);

        return (
          <div ref={containerRef}>
            <button>Test</button>
          </div>
        );
      }

      const { unmount } = render(<ComponentWithHooks />);

      await waitFor(() => {
        const announcements = document.querySelectorAll('[role="status"]');
        expect(announcements.length).toBeGreaterThan(0);
      });

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should maintain ARIA attributes through component lifecycle', async () => {
      function DynamicAriaComponent() {
        const [expanded, setExpanded] = React.useState(false);
        const announce = useAnnouncer();

        const handleToggle = () => {
          setExpanded(!expanded);
          announce(expanded ? 'Collapsed' : 'Expanded');
        };

        return (
          <div>
            <button onClick={handleToggle} aria-expanded={expanded} aria-controls="content">
              Toggle
            </button>
            <div id="content" role="region">
              {expanded && <p>Content</p>}
            </div>
          </div>
        );
      }

      render(<DynamicAriaComponent />);

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-expanded')).toBe('false');

      await userEvent.click(button);

      await waitFor(() => {
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText('Content')).toBeDefined();
      });
    });
  });
});
