import { useEffect, useRef } from 'react';

export function useModal(onClose) {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const prevFocus = document.activeElement;
    modal.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (prevFocus && typeof prevFocus.focus === 'function') {
        prevFocus.focus();
      }
    };
  }, [onClose]);

  return modalRef;
}
