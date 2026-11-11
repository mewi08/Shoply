import { Alert } from "../ui/alert";
import { Pencil, Trash2 } from "lucide-react";

export function DataTable({ table, actions, state }) {
  const { columns, rows, label, getRowName, editingId } = table;

  const { onEdit, onDelete, renderActions } = actions;

  const { loading = false, error = "" } = state;

  if (loading)
    return (
      <p className="crud-empty" role="status">
        Cargando…
      </p>
    );
  if (error) return <Alert type="error">{error}</Alert>;
  if (rows.length === 0) return <p className="crud-empty">No hay registros.</p>;

  const hasActions = Boolean(onEdit || onDelete || renderActions);
  const nameOf = (row) => (getRowName ? ` ${getRowName(row)}` : "");

  return (
    <div className="crud-table-wrap">
      <table className="crud-table" aria-label={label}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {" "}
                {col.header}
              </th>
            ))}
            {hasActions && (
              <th scope="col" className="crud-actions">
                {" "}
                Acciones{" "}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={row.id === editingId ? "is-editing" : undefined}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {" "}
                  {col.render ? col.render(row) : row[col.key]}{" "}
                </td>
              ))}
              <td className="crud-actions">
                {renderActions?.(row)}
                {onEdit && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    aria-label={`Editar${nameOf(row)}`}
                    onClick={() => onEdit(row)}
                  >
                    <Pencil aria-hidden="true" size={13} />
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    aria-label={`Eliminar${nameOf(row)}`}
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 aria-hidden="true" size={13} />
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
