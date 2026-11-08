import { Alert } from "./alert";
import { Dialog } from "../crud/dialog";

export function ConfirmDialog({ config, actions, state, children }) {
  const {
    title,
    confirmLabel = "Eliminar",
    busyLabel = "Eliminando…",
    ConfirmIcon,
  } = config;

  const { onConfirm, onCancel, onClosed } = actions;

  const { open, loading = false, error = "" } = state;
  return (
    <Dialog
      open={open}
      config={{ title }}
      events={{ onClose: onCancel, onClosed }}
    >
      {children}

      <Alert type="error">{error}</Alert>

      <div className="crud-dialog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          data-autofocus
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {ConfirmIcon && <ConfirmIcon aria-hidden="true" size={20} />}
          {loading ? busyLabel : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
