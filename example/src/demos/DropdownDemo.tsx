import { useState, useEffect, useRef } from 'react';
import { useKeyboardNavigation, useA11yLocale } from '@wajkie/react-a11y';
import { announceToScreenReader } from '@wajkie/a11y-core';

export function DropdownDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { messages } = useA11yLocale();
  const menuRef = useRef<HTMLUListElement>(null);

  const items = [
    { id: 1, label: messages.profile || 'Profile' },
    { id: 2, label: messages.settings || 'Settings' },
    { id: 3, label: messages.account || 'Account' },
    { id: 4, label: messages.logout || 'Logout' },
  ];

  const { handleKeyDown } = useKeyboardNavigation(
    items.length,
    (index) => setSelectedIndex(index),
    { loop: true }
  );

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    handleKeyDown(e);
  };

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="demo-section">
      <h2>Keyboard Navigation Demo</h2>
      <p>
        Demonstrates <code>useKeyboardNavigation</code> hook. When the menu is open, arrow keys, Home, and End navigate within the menu only.
      </p>
      <div className="dropdown">
        <button
          className="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={messages.menu || 'Menu'}
        >
          {messages.menu || 'Menu'}
        </button>

        {isOpen && (
          <ul
            ref={menuRef}
            className="dropdown-menu"
            role="menu"
            tabIndex={0}
            onKeyDown={handleMenuKeyDown}
            aria-activedescendant={`item-${selectedIndex}`}
          >
            {items.map((item, index) => (
              <li
                key={item.id}
                id={`item-${index}`}
                role="menuitem"
                tabIndex={index === selectedIndex ? 0 : -1}
                aria-selected={index === selectedIndex}
                onClick={() => {
                  setIsOpen(false);
                  announceToScreenReader(`Selected ${item.label}`, 'polite');
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        <strong>When menu is open:</strong> Use ↑↓ arrow keys to navigate, Home/End for first/last item, Escape to close.<br />
        <strong>When menu is closed:</strong> Home/End scroll the page normally.
      </p>
    </div>
  );
}
