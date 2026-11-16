import { useId, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";

export function Dialog(props) {
  const { abierto, titulo, alCerrar, alCerrado, children } = props;

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

      onClose={alCerrado}
    >
      <button type="button" className="crud-dialog-close" onClick={alCerrar}>
        <X size={22} />
      </button>

      <h2 id={idTitulo} className="crud-dialog-title">{titulo}</h2>

      {children}
    </dialog>
  );
}