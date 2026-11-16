import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Alert,
  ConfirmDialog,
  CrudCard,
  CrudPage,
  DataTable,
  Dialog,
  SearchBar,
} from "../../../components/crud";
import UnitForm from "./unit-form";
import { useUnits } from "./use-unit";

const trail = [
  { label: "Menú", to: "/" },
  { label: "Administración", to: "/administracion"},
  { label: "Unidades de medida" }
];

const COLUMNS = [
  { key: "nombre", header: "Nombre" },
  { key: "abreviatura", header: "Abreviatura"}
];
const PAGE_SIZE = 5;

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const countLabel = (n) => `${n} ${n === 1 ? "Unidad" : "Unidades"}`;

export default function Units() {
  const titleRef = useRef(null);

  const { units, loading, loadError, getUnit, saveUnit, removeUnit, } = 
    useUnits();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [actionError, setActionError] = useState("");

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [page, setPage] = useState(1);

  const filterBy = (text) =>
    units.filter((unit) =>
      normalize(unit.nombre).includes(normalize(text))
    );

  const visible = filterBy(query);

  const totalPages = Math.ceil(visible.length / PAGE_SIZE );
  const index = (page - 1) * PAGE_SIZE ;
  const paginatedItems  = visible.slice(index, index + PAGE_SIZE );

  const handleSearch = (text) => {
    setQuery(text);
    setPage(1);
  };

  const openCreate = () => {
    setStatus("");
    setActionError("");
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = async (unit) => {
    if (loadingEdit) return;
    setStatus("");
    setActionError("");
    setLoadingEdit(true);

    try {
      setEditing(await getUnit(unit.id));
      setFormOpen(true);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSave = async (id, data) => {
    await saveUnit(id, data);
    setStatus(`Unidad «${data.nombre}» ${id ? "actualizada" : "creada"}`);
    setFormOpen(false);
  };

  const askDelete = (unit) => {
    setDeleteError("");
    setToDelete(unit);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      await removeUnit(toDelete.id);
      setStatus(`Unidad «${toDelete.nombre}» eliminada`);
      setToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CrudPage
      titulo= "Unidades de medida"
      subtitulo= "Administra las unidades de medida de los productos de tu tienda."
      
      ruta={trail}
      estado={status}
      refTitulo={titleRef}
      accion={
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={openCreate}
        >
          <Plus size={20} />
          Crear unidad
        </button>
      }
    >
      {actionError && <Alert type="error">{actionError}</Alert>}

      <SearchBar
        etiqueta="Buscar una unidad"
        placeholder="Nombre de la unidad"
        alBuscar={handleSearch}
      />

      <CrudCard
        titulo="Unidades de medida de tu tienda"
        subtitulo="Ordenadas de la A a la Z"
        insignia={loading || loadError ? undefined : countLabel(visible.length)}
        pagina={page}
        totalPaginas={totalPages}
        alCambiarPagina={setPage}
      >
        <DataTable
          columnas={COLUMNS}
          filas={paginatedItems}
          cargando={loading}
          error={loadError}
          idEnEdicion={editing?.id}
          alEditar={openEdit}
          alEliminar={askDelete}
        />
      </CrudCard>

      <Dialog
        abierto={formOpen}
        titulo={editing ? "Editar unidad" : "Crear unidad"}
        alCerrar={() => setFormOpen(false)}
      >
        {formOpen && (
          <UnitForm
            unit={editing}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Dialog>

      <ConfirmDialog
        abierto={toDelete !== null}
        titulo="¿Eliminar esta unidad?"
        textoConfirmar="Eliminar unidad"
        textoCargando="Eliminando…"
        tipo="peligro"
        IconoConfirmar={Trash2}
        cargando={deleting}
        error={deleteError}
        alConfirmar={confirmDelete}
        alCancelar={() => setToDelete(null)}
      >
        <p>
          Esta unidad de medida «{toDelete?.nombre}»se quitará de tu tienda. No podrás deshacer
          esta acción.
        </p>
      </ConfirmDialog>
    </CrudPage>
  );
}