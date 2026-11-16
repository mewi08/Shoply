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
import BrandForm from "./brand-form";
import { useBrands } from "./use-brands";

const trail = [
  { label: "Menú", to: "/" },
  { label: "Administración", to: "/administracion" },
  { label: "Marcas" }
];

const COLUMNS = [{ key: "nombre", header: "Nombre" }];
const PAGE_SIZE = 5;

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const countLabel = (n) => `${n} ${n === 1 ? "Marca" : "Marcas"}`;

export default function Brands() {
  const titleRef = useRef(null);
  const { brands, loading, loadError, getBrand, saveBrand, removeBrand } =
    useBrands();

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
    brands.filter((b) => normalize(b.nombre).includes(normalize(text)));

  const visible = filterBy(query);

  const totalPages = Math.ceil(visible.length / PAGE_SIZE );
  const index = (page - 1) * PAGE_SIZE ;
  const paginatedItems  = visible.slice(index, index + PAGE_SIZE );

  const handleSearch = (texto) => {
    setQuery(texto);
    setPage(1);
  };

  const openCreate = () => {
    setStatus("");
    setActionError("");
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = async (brand) => {
    if (loadingEdit) return;
    setStatus("");
    setActionError("");
    setLoadingEdit(true);

    try {
      setEditing(await getBrand(brand.id));
      setFormOpen(true);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSave = async (id, nombre) => {
    await saveBrand(id, nombre);
    setStatus(`Marca «${nombre}» ${id ? "actualizada" : "creada"}`);
    setFormOpen(false);
  };

  const askDelete = (brand) => {
    setDeleteError("");
    setToDelete(brand);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      await removeBrand(toDelete.id);
      setStatus(`Marca «${toDelete.nombre}» eliminada`);
      setToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CrudPage
      titulo="Marcas"
      subtitulo="Organiza las marcas de los productos de tu tienda."
      ruta={trail}
      estado={status}
      refTitulo={ titleRef }
      accion={
        <button type="button" className="btn btn-primary btn-block" onClick={openCreate}>
          <Plus size={20} />
          Crear marca
        </button>
      }
    >
      {actionError && <Alert type="error">{actionError}</Alert>}

      <SearchBar
        etiqueta="Buscar una marca"
        placeholder="Nombre de la marca"
        alBuscar={handleSearch}
      />

      <CrudCard
        titulo="Marcas de tu tienda"
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
        titulo={editing ? "Editar marca" : "Crear marca"}
        alCerrar={() => setFormOpen(false)}
      >
        {formOpen && (
          <BrandForm
            brand={editing}
            onSave={handleSave}
            onCancel={() => { setToDelete(null)}}
          />
        )}
      </Dialog>

      <ConfirmDialog
        abierto={toDelete !== null}
        titulo="¿Eliminar esta marca?"
        textoConfirmar="Eliminar marca"
        textoCargando="Eliminando…"
        tipo="peligro"
        IconoConfirmar={Trash2}
        cargando={deleting}
        error={deleteError}
        alConfirmar={confirmDelete}
        alCancelar={() => setToDelete(null)}
      >
        <p>Esta marca «{toDelete?.nombre}» se quitará de tu tienda. No podrás deshacer esta acción.</p>
      </ConfirmDialog>
    </CrudPage>
  );
}