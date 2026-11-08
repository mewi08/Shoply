import { Alert } from "../ui/alert";

export function DataTable({ table, actions, state }) {
  const { columns, rows, label, getRowName, editingId } = table;

  const { onEdit, onDelete } = actions;

  const { loading = false, error = "" } = state;

  if (loading)
    return (
      <p className="crud-empty" role="status">
        Cargando…
      </p>
    );
  if (error) return <Alert type="error">{error}</Alert>;
  if (rows.length === 0) return <p className="crud-empty">No hay registros.</p>;

  const hasActions = Boolean(onEdit || onDelete);
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
              {hasActions && (
                <td className="crud-actions">
                  {onEdit && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      aria-label={`Editar${nameOf(row)}`}
                      onClick={() => onEdit(row)}
                    >
                      
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      aria-label={`Eliminar${nameOf(row)}`}
                      onClick={() => onDelete(row)}
                    >
                      
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
