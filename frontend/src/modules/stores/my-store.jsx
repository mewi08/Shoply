import { useState } from "react";
import { Pencil } from "lucide-react";
import { Alert, CrudCard, CrudPage, Dialog } from "../../components/crud";
import StoreForm from "./store-form";
import { useMyStore } from "./use-my-store";

const trail = [{ label: "Menú", to: "/" }, { label: "Mi tienda" }];

const FIELDS = [
  ["Descripción", "descripcion"],
  ["Dirección", "direccion"],
  ["Teléfono", "telefono"],
  ["RUC", "ruc"],
];

export default function MyStore(props) {
  const { canEdit } = props;

  const { store, loading, loadError, saveMyStore } = useMyStore();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

  const handleSave = async (_, data) => {
    const response = await saveMyStore(data);
    setStatus(response.message);
    setEditing(false);
  };

  return (
    <CrudPage
      titulo="Mi tienda"
      subtitulo="Los datos de tu negocio."
      ruta={trail}
      estado={status}
      accion={
        canEdit &&
        store && (
          <button type="button" className="btn btn-primary btn-block" onClick={() => setEditing(true)}>
            <Pencil size={20} />
            Editar tienda
          </button>
        )
      }
    >
      {loading && <p className="crud-empty" role="status">Cargando…</p>}
      {loadError && <Alert type="error">{loadError}</Alert>}

      {store && (
        <CrudCard titulo={store.nombre}>
          <dl className="store-info">
            {FIELDS.map(([label, key]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{store[key] ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </CrudCard>
      )}

      <Dialog
        abierto={editing}
        titulo="Editar tienda"
        alCerrar={() => setEditing(false)}
      >
        {editing && (
          <StoreForm store={store} onSave={handleSave} onCancel={() => setEditing(false)} />
        )}
      </Dialog>
    </CrudPage>
  );
}