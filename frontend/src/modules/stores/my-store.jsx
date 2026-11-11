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

export default function MyStore({ canEdit }) {
  const { store, loading, loadError, saveMyStore } = useMyStore();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

  const handleSave = async (_, data) => {
    const res = await saveMyStore(data);
    setStatus(res.message);
    setEditing(false);
  };

  return (
    <CrudPage
      config={{ title: "Mi tienda", subtitle: "Los datos de tu negocio." }}
      navigation={{ trail }}
      feedback={{ status }}
      refs={{}}
      action={
        canEdit && store && (
          <button type="button" className="btn btn-primary btn-block" onClick={() => setEditing(true)}>
            <Pencil aria-hidden="true" size={20} />
            Editar tienda
          </button>
        )
      }
    >
      {loading && <p className="crud-empty" role="status">Cargando…</p>}
      <Alert type="error">{loadError}</Alert>

      {store && (
        <CrudCard config={{ title: store.nombre }}>
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
        open={editing}
        config={{ title: "Editar tienda" }}
        events={{ onClose: () => setEditing(false) }}
      >
        {editing && (
          <StoreForm store={store} onSave={handleSave} onCancel={() => setEditing(false)} />
        )}
      </Dialog>
    </CrudPage>
  );
}