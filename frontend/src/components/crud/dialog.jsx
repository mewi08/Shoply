import { useId, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";

export function Dialog({ open, config, events, children }) {
  const { title } = config;
  const { onClose, onClosed } = events;
  const dialogRef = useRef(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("[data-autofocus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="crud-dialog"
      aria-labelledby={titleId}
      onClose={() => {
        onClose?.();
        onClosed?.();
      }}
    >
      <button
        type="button"
        className="crud-dialog-close"
        aria-label="Cerrar"
        onClick={onClose}
      >
        <X aria-hidden="true" size={22} />
      </button>

      <h2 id={titleId} className="crud-dialog-title">
        {title}
      </h2>

      {children}
    </dialog>
  );
}