import { useEffect, useState } from "react";
import { Alert } from "../ui/alert";
import { TopBar } from "../layout/top-bar";

export function CrudPage(props) {
  const {
    titulo,
    subtitulo,
    ruta,
    estado,
    refTitulo,
    accion,
    children,
  } = props;

  const [mensaje, setMensaje] = useState(estado);

  useEffect(() => {
    setMensaje(estado);
    if (!estado) return;

    const temporizador = setTimeout(() => setMensaje(""), 5000);
    return () => clearTimeout(temporizador);
  }, [estado]);

  return (
    <div className="crud-shell">
      {ruta && <TopBar trail={ruta} />}

      <main className="crud-page">
        <header className="crud-header">
          <h1 ref={refTitulo} tabIndex={-1} className="crud-title">
            {titulo}
          </h1>
          {subtitulo && <p className="crud-subtitle">{subtitulo}</p>}
        </header>

        {accion && <div className="crud-action">{accion}</div>}

        {mensaje && <Alert type="success">{mensaje}</Alert>}

        {children}
      </main>
    </div>
  );
}