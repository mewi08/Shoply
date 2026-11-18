import { Alert } from "../ui/alert";
import { Pencil, Trash2 } from "lucide-react";

export function DataTable(props) {
  const {
    columnas = [],
    filas = [],
    cargando = false,
    error = "",
    idEnEdicion,
    alEditar,
    alEliminar,
    accionesExtra,
  } = props;

  if (error) return <Alert type="error">{error}</Alert>;
  if (cargando) return <p className="crud-empty" role="status">Cargando…</p>;
  if (filas.length === 0) return <p className="crud-empty">No hay registros.</p>;

  const tieneAcciones = alEditar || alEliminar || accionesExtra;

  return (
    <div className="crud-table-wrap">
      <table className="crud-table">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.key} scope="col">{columna.header}</th>
            ))}
            {tieneAcciones && <th scope="col" className="crud-actions">Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id} className={fila.id === idEnEdicion ? "is-editing" : undefined}>
              {columnas.map((columna) => (
                <td key={columna.key}>
                  {columna.render ? columna.render(fila) : fila[columna.key]}
                </td>
              ))}

              {tieneAcciones && (
                <td className="crud-actions">
                  {accionesExtra?.(fila)}

                  {alEditar && (
                    <button type="button" className="btn btn-secondary" onClick={() => alEditar(fila)}>
                      <Pencil size={13} /> Editar
                    </button>
                  )}

                  {alEliminar && (
                    <button type="button" className="btn btn-danger" onClick={() => alEliminar(fila)}>
                      <Trash2 size={13} /> Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}