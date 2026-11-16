import { useId, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import { Alert } from "../ui/alert";

const CLASE_BOTON = {
  peligro: "btn btn-danger",
  normal: "btn btn-primary",
};

export function ConfirmDialog(props) {
  const {
    abierto,
    titulo,
    textoConfirmar = "Confirmar",
    textoCargando = "Procesando…",
    tipo = "normal",
    IconoConfirmar,
    cargando = false,
    error = "",
    alConfirmar,
    alCancelar,
    children,
  } = props;

  const referenciaDialogo = useRef(null);
  const idTitulo = useId();

  useLayoutEffect(() => {
    const dialogo = referenciaDialogo.current;
    if (!dialogo) return;

    if (abierto && !dialogo.open) {
      dialogo.showModal();
      dialogo.querySelector("[data-autofocus]")?.focus();
    }

    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={referenciaDialogo}
      className="crud-dialog"
    >
      <button
        type="button"
        className="crud-dialog-close"
        onClick={alCancelar}
      >
        <X size={22} />
      </button>

      <h2 id={idTitulo} className="crud-dialog-title">{titulo}</h2>

      {children}

      {error && <Alert type="error">{error}</Alert>}

      <div className="crud-dialog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          data-autofocus
          onClick={alCancelar}
        >
          Cancelar
        </button>

        <button
          type="button"
          className={CLASE_BOTON[tipo]}
          onClick={alConfirmar}
          disabled={cargando}
        >
          {IconoConfirmar && <IconoConfirmar size={20} />}
          {cargando ? textoCargando : textoConfirmar}
        </button>
      </div>
    </dialog>
  );
}