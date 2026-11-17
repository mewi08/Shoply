import { useState } from "react";
import { Ban, X } from "lucide-react";
import {
  Alert,
  ConfirmDialog,
  CrudCard,
  CrudPage,
  DataTable,
  Dialog,
  SearchBar,
} from "../../components/crud";
import StoreForm from "./store-form";
import { useStores } from "./use-stores";

const trail = [{ label: "Menú", to: "/" }, { label: "Tiendas" }];

const STATUS = {
  pendiente: { label: "Pendiente", cls: "is-pending" },
  activa: { label: "Activa", cls: "is-active" },
  inactiva: { label: "Inactiva", cls: "is-inactive" },
  rechazada: { label: "Rechazada", cls: "is-rejected" },
};

const COLUMNS = [
  { key: "nombre", header: "Nombre" },
  { key: "direccion", header: "Dirección" },
  { key: "telefono", header: "Teléfono" },
  { key: "ruc", header: "RUC", render: (s) => s.ruc ?? "—" },
  {
    key: "estado",
    header: "Estado",
    render: (s) => (
      <span className={`status-tag ${STATUS[s.estado].cls}`}>
        {STATUS[s.estado].label}
      </span>
    ),
  },
];

const normalize = (text) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function Stores() {
  const {
    requests, stores, loading, loadError,
    updateStore, approve, reject, deactivate, reactivate,
  } = useStores();

  const [tab, setTab] = useState("requests");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [actionError, setActionError] = useState("");

  const [editing, setEditing] = useState(null);

  const [confirming, setConfirming] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const isRequests = tab === "requests";
  const requestList = requests.filter((s) => s.estado !== "activa");
  const list = isRequests ? requestList : stores;



  const visible = list.filter((s) =>
    normalize(`${s.nombre} ${s.ruc ?? ""}`).includes(normalize(query)),
  );

  const pendingCount = requests.filter((s) => s.estado === "pendiente").length;

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setQuery("");
    setStatus("");
    setActionError("");
  };

  const perform = async (action, id) => {
    setStatus("");
    setActionError("");

    try {
      const response = await action(id);
      setStatus(response.message);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const ask = (store, config) => {
    setConfirmError("");
    setConfirming({ id: store.id, ...config });
  };

  const askReject = (store) =>
    ask(store, {
      title: `¿Rechazar la solicitud de ${store.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      confirmText: "Rechazar solicitud",
      Icon: X,
      action: reject,
    });

  const askDeactivate = (store) =>
    ask(store, {
      title: `¿Desactivar la tienda ${store.nombre}?`,
      text: "La tienda y sus usuarios perderán el acceso hasta que la reactives.",
      confirmText: "Desactivar tienda",
      Icon: Ban,
      action: deactivate,
    });

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setConfirmError("");

    try {
      const response = await confirming.action(confirming.id);
      setStatus(response.message);
      setConfirming(null);
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSave = async (id, data) => {
    const response = await updateStore(id, data);
    setStatus(response.message);
    setEditing(null);
  };

const renderActions = (store) => {
  if (isRequests && store.estado !== "pendiente") return null;

  if (isRequests) {
    return (
      <>
        <button type="button" className="btn btn-primary" onClick={() => perform(approve, store.id)}>
          Aprobar
        </button>
        <button type="button" className="btn btn-danger-soft" onClick={() => askReject(store)}>
          Rechazar
        </button>
      </>
    );
  }

    if (store.estado === "activa") {
      return (
        <button type="button" className="btn btn-danger-soft" onClick={() => askDeactivate(store)}>
          Desactivar
        </button>
      );
    }

    return (
      <button type="button" className="btn btn-secondary" onClick={() => perform(reactivate, store.id)}>
        Reactivar
      </button>
    );
  };

  return (
    <CrudPage
      titulo="Tiendas"
      subtitulo="Revisa las solicitudes y administra las tiendas."
      ruta={trail}
      estado={status}
    >
      <div className="crud-tabs">
        <button type="button" className="crud-tab" onClick={() => changeTab("requests")}>
          Solicitudes{pendingCount > 0 && ` (${pendingCount})`}
        </button>
        <button type="button" className="crud-tab" onClick={() => changeTab("stores")}>
          Tiendas
        </button>
      </div>

      {actionError && <Alert type="error">{actionError}</Alert>}

      <SearchBar
        key={tab}
        etiqueta={isRequests ? "Buscar una solicitud" : "Buscar una tienda"}
        placeholder="Nombre o RUC"
        alBuscar={setQuery}
      />

      <CrudCard
        titulo={isRequests ? "Solicitudes" : "Tiendas"}
        subtitulo={isRequests ? "Tiendas que esperan aprobación" : "Tiendas ya aprobadas"}
        insignia={loading || loadError ? undefined : `${visible.length}`}
      >
        <DataTable
          columnas={COLUMNS}
          filas={visible}
          cargando={loading}
          error={loadError}
          alEditar={isRequests ? undefined : setEditing}
          accionesExtra={renderActions}
        />
      </CrudCard>

      <Dialog
        abierto={editing !== null}
        titulo="Editar tienda"
        alCerrar={() => setEditing(null)}
      >
        {editing && (
          <StoreForm
            store={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Dialog>

      <ConfirmDialog
        abierto={confirming !== null}
        titulo={confirming?.title ?? ""}
        textoConfirmar={confirming?.confirmText}
        textoCargando="Procesando…"
        tipo="peligro"
        IconoConfirmar={confirming?.Icon}
        cargando={confirmLoading}
        error={confirmError}
        alConfirmar={handleConfirm}
        alCancelar={() => setConfirming(null)}
      >
        <p>{confirming?.text}</p>
      </ConfirmDialog>
    </CrudPage>
  );
}