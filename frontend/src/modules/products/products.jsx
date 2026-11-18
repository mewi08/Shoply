import { useState } from "react";
import { Plus, Power, PowerOff } from "lucide-react";
import {
  Alert,
  ConfirmDialog,
  CrudCard,
  CrudPage,
  DataTable,
  Dialog,
  SearchBar,
} from "../../components/crud";
import ProductForm from "./product-form";
import { useProducts } from "./use-products";

const trail = [
  { label: "Menú", to: "/" },
  { label: "Administración", to: "/administracion" },
  { label: "Productos" },
];

const COLUMNS = [
  { key: "codigo", header: "Código" },
  { key: "nombre", header: "Nombre" },
  { key: "presentacion", header: "Presentación" },
  { key: "precio_venta", header: "Precio" },
  { key: "stock", header: "Stock", render: (p) => Number(p.stock) },
  { key: "estado", header: "Estado", render: (p) => (p.estado ? "Activo" : "Inactivo") },
];

const countLabel = (n) => `${n} ${n === 1 ? "producto" : "productos"}`;

export default function Products() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const {
    products,
    total,
    totalPages,
    catalogs,
    loading,
    loadError,
    getProduct,
    saveProduct,
    toggleProductStatus,
  } = useProducts({ buscar: query, page });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [actionError, setActionError] = useState("");

  const [toDisable, setToDisable] = useState(null);
  const [disabling, setDisabling] = useState(false);
  const [disableError, setDisableError] = useState("");

  const isActive = Boolean(toDisable?.estado);
  const action = isActive ? "Desactivar" : "Activar";

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

  const openEdit = async (product) => {
    if (loadingEdit) return;
    setStatus("");
    setActionError("");
    setLoadingEdit(true);

    try {
      setEditing(await getProduct(product.id));
      setFormOpen(true);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSave = async (id, data) => {
    await saveProduct(id, data);
    setStatus(`Producto «${data.nombre}» ${id ? "actualizado" : "creado"}`);
    setFormOpen(false);
  };

  const askDisable = (product) => {
    setDisableError("");
    setToDisable(product);
  };

  const confirmDisable = async () => {
    setDisabling(true);
    setDisableError("");

    try {
      await toggleProductStatus(toDisable.id);
      setStatus(`Producto «${toDisable.nombre}» ${isActive ? "desactivado" : "activado"}`);
      setToDisable(null);
    } catch (err) {
      setDisableError(err.message);
    } finally {
      setDisabling(false);
    }
  };

  const renderStatusAction = (product) => {
    const active = Boolean(product.estado);

    return (
      <button
        type="button"
        className={active ? "btn btn-danger-soft" : "btn btn-secondary"}
        onClick={() => askDisable(product)}
      >
        {active ? <PowerOff size={13} /> : <Power size={13} />}
      </button>
    );
  };

  return (
    <CrudPage
      titulo="Productos"
      subtitulo="Administra el catálogo de productos de tu tienda."
      ruta={trail}
      estado={status}
      accion={
        <button type="button" className="btn btn-primary btn-block" onClick={openCreate}>
          <Plus size={20} />
          Crear producto
        </button>
      }
    >
      {actionError && <Alert type="error">{actionError}</Alert>}

      <SearchBar
        etiqueta="Buscar un producto"
        placeholder="Nombre o código"
        alBuscar={handleSearch}
      />

      <CrudCard
        titulo="Productos de tu tienda"
        subtitulo="Ordenados por código"
        insignia={loading || loadError ? undefined : countLabel(total)}
        pagina={page}
        totalPaginas={totalPages}
        alCambiarPagina={setPage}
      >
        <DataTable
          columnas={COLUMNS}
          filas={products}
          cargando={loading}
          error={loadError}
          alEditar={openEdit}
          accionesExtra={renderStatusAction}
        />
      </CrudCard>

      <Dialog
        abierto={formOpen}
        titulo={editing ? "Editar producto" : "Crear producto"}
        alCerrar={() => setFormOpen(false)}
      >
        {formOpen && (
          <ProductForm
            product={editing}
            catalogs={catalogs}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Dialog>

      <ConfirmDialog
        abierto={toDisable !== null}
        titulo={`¿${action} el producto ${toDisable?.nombre ?? ""}?`}
        textoConfirmar={`${action} producto`}
        textoCargando={isActive ? "Desactivando…" : "Activando…"}
        tipo={isActive ? "peligro" : "normal"}
        IconoConfirmar={isActive ? PowerOff : Power}
        cargando={disabling}
        error={disableError}
        alConfirmar={confirmDisable}
        alCancelar={() => setToDisable(null)}
      >
        <p>
          {isActive
            ? "Este producto dejará de aparecer en el catálogo."
            : "Este producto volverá a aparecer en el catálogo."}
        </p>
      </ConfirmDialog>
    </CrudPage>
  );
}