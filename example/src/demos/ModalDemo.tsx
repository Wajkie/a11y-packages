import { useState } from 'react';
import { useFocusTrap, useFocusRestoration, useAnnouncer } from '@wajkie/react-a11y';

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const { saveFocus, restoreFocus } = useFocusRestoration();
  const announce = useAnnouncer();

  const handleOpen = () => {
    saveFocus();
    setIsOpen(true);
    announce('Modal opened', 'polite');
  };

  const handleClose = () => {
    setIsOpen(false);
    restoreFocus();
    announce('Modal closed', 'polite');
  };

  return (
    <div className="demo-section">
      <h2>Modal with Focus Management</h2>
      <p>
        Demonstrates <code>useFocusTrap</code> and <code>useFocusRestoration</code> hooks.
      </p>
      <button className="button" onClick={handleOpen}>
        Open Modal
      </button>

      {isOpen && <Modal onClose={handleClose} />}
    </div>
  );
}

function Modal({ onClose }: { onClose: () => void }) {
  const modalRef = useFocusTrap(true) as React.RefObject<HTMLDivElement>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">Example Modal Dialog</h2>
        <p>
          Focus is trapped within this modal. Try pressing Tab to navigate between the buttons.
          Press Escape or click outside to close.
        </p>
        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button" onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
