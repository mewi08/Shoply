import { useRef, useState } from "react";
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

const normalize = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const estadoColumn = {
  key: "estado",
  header: "Estado",
  render: (s) => (
    <span className={`status-tag ${STATUS[s.estado].cls}`}>
      {STATUS[s.estado].label}
    </span>
  ),
};

const BASE_COLUMNS = [
  { key: "nombre", header: "Nombre" },
  { key: "direccion", header: "Dirección" },
  { key: "telefono", header: "Teléfono" },
];

const REQUEST_COLUMNS = [...BASE_COLUMNS, estadoColumn];
const STORE_COLUMNS = [
  ...BASE_COLUMNS,
  { key: "ruc", header: "RUC", render: (s) => s.ruc ?? "—" },
  estadoColumn,
];

export default function Stores() {
  const titleRef = useRef(null);
  const focusTitleOnClose = useRef(false);
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
  const list = isRequests ? requests : stores;
  const pendingCount = requests.filter((s) => s.estado === "pendiente").length;

  const countLabel = (n) => {
    const [one, many] = isRequests ? ["solicitud", "solicitudes"] : ["tienda", "tiendas"];
    return `${n} ${n === 1 ? one : many}`;
  };

  const filterBy = (text) =>
    list.filter((s) =>
      normalize(`${s.nombre} ${s.ruc ?? ""}`).includes(normalize(text)),
    );
  const visible = filterBy(query);

  const handleSearch = (text) => {
    setQuery(text);
    const n = filterBy(text).length;
    setStatus(
      text ? `${countLabel(n)} ${n === 1 ? "encontrada" : "encontradas"} para «${text}»` : "",
    );
  };

  const changeTab = (next) => {
    setTab(next);
    setQuery("");
    setStatus("");
    setActionError("");
  };

  const perform = async (action, id) => {
    setStatus("");
    setActionError("");
    try {
      const res = await action(id);
      setStatus(res.message);
      titleRef.current?.focus();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const ask = (s, { title, text, confirmLabel, Icon, action }) => {
    setConfirmError("");
    setConfirming({ id: s.id, title, text, confirmLabel, Icon, action });
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setConfirmError("");
    try {
      const res = await confirming.action(confirming.id);
      setStatus(res.message);
      focusTitleOnClose.current = true;
      setConfirming(null);
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmClosed = () => {
    if (!focusTitleOnClose.current) return;
    focusTitleOnClose.current = false;
    titleRef.current?.focus();
  };

  const handleSave = async (id, data) => {
    const res = await updateStore(id, data);
    setStatus(res.message);
    setEditing(null);
  };

  const requestActions = (s) =>
    s.estado === "pendiente" && (
      <>
        <button type="button" className="btn btn-primary" onClick={() => perform(approve, s.id)}>
          Aprobar
        </button>
        <button
          type="button"
          className="btn btn-danger-soft"
          onClick={() =>
            ask(s, {
              title: `¿Rechazar la solicitud de ${s.nombre}?`,
              text: "Esta acción no se puede deshacer.",
              confirmLabel: "Rechazar solicitud",
              Icon: X,
              action: reject,
            })
          }
        >
          Rechazar
        </button>
      </>
    );

  const storeActions = (s) =>
    s.estado === "activa" ? (
      <button
        type="button"
        className="btn btn-danger-soft"
        onClick={() =>
          ask(s, {
            title: `¿Desactivar la tienda ${s.nombre}?`,
            text: "La tienda y sus usuarios perderán el acceso hasta que la reactives.",
            confirmLabel: "Desactivar tienda",
            Icon: Ban,
            action: deactivate,
          })
        }
      >
        Desactivar
      </button>
    ) : (
      <button type="button" className="btn btn-secondary" onClick={() => perform(reactivate, s.id)}>
        Reactivar
      </button>
    );

  return (
    <CrudPage
      config={{
        title: "Tiendas",
        subtitle: "Revisa las solicitudes y administra las tiendas.",
      }}
      navigation={{ trail }}
      feedback={{ status }}
      refs={{ titleRef }}
    >
      <div className="crud-tabs">
        <button type="button" className="crud-tab" aria-pressed={isRequests} onClick={() => changeTab("requests")}>
          Solicitudes{pendingCount > 0 && ` (${pendingCount})`}
        </button>
        <button type="button" className="crud-tab" aria-pressed={!isRequests} onClick={() => changeTab("stores")}>
          Tiendas
        </button>
      </div>

      <Alert type="error">{actionError}</Alert>

      <SearchBar
        key={tab}
        config={{
          label: isRequests ? "Buscar una solicitud" : "Buscar una tienda",
          placeholder: isRequests ? "Nombre de la tienda" : "Nombre o RUC",
        }}
        actions={{ onSearch: handleSearch }}
      />

      <CrudCard
        config={{
          title: isRequests ? "Solicitudes" : "Tiendas",
          subtitle: isRequests ? "Tiendas que esperan aprobación" : "Tiendas ya aprobadas",
          badge: loading || loadError ? undefined : countLabel(visible.length),
        }}
      >
        <DataTable
          table={{
            columns: isRequests ? REQUEST_COLUMNS : STORE_COLUMNS,
            rows: visible,
            label: isRequests ? "Solicitudes" : "Tiendas",
            getRowName: (s) => s.nombre,
          }}
          state={{ loading, error: loadError }}
          actions={
            isRequests
              ? { renderActions: requestActions }
              : { onEdit: setEditing, renderActions: storeActions }
          }
        />
      </CrudCard>

      <Dialog
        open={editing !== null}
        config={{ title: "Editar tienda" }}
        events={{ onClose: () => setEditing(null) }}
      >
        {editing && (
          <StoreForm store={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Dialog>

      <ConfirmDialog
        config={{
          title: confirming?.title ?? "",
          ConfirmIcon: confirming?.Icon,
          confirmLabel: confirming?.confirmLabel,
          busyLabel: "Procesando…",
        }}
        actions={{
          onConfirm: handleConfirm,
          onCancel: () => setConfirming(null),
          onClosed: handleConfirmClosed,
        }}
        state={{
          open: confirming !== null,
          loading: confirmLoading,
          error: confirmError,
        }}
      >
        <p>{confirming?.text}</p>
      </ConfirmDialog>
    </CrudPage>
  );
}