import { useRef, useState } from "react";
import { Plus, PowerOff } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import {
  Alert,
  CardCarousel,
  ConfirmDialog,
  CrudCard,
  CrudPage,
  DataTable,
  Dialog,
  ItemCard,
  SearchBar,
} from "../../components/crud";
import ProductForm from "./product-form";
import { useProducts } from "./use-products";

const trail = [{ label: "Menú", to: "/" }, { label: "Productos" }];

const normalize = (text) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const countLabel = (n) => `${n} ${n === 1 ? "producto" : "productos"}`;
const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

const COLUMNS = [
  { key: "codigo", header: "Código" },
  { key: "nombre", header: "Nombre" },
  { key: "presentacion", header: "Presentación", render: (p) => p.presentacion ?? "—" },
  { key: "precio_venta", header: "Precio", render: (p) => soles(p.precio_venta) },
  { key: "tienda", header: "Tienda" },
];

export default function Products() {
  const { user } = useOutletContext();
  const isSuperadmin = user.rol === "superadmin";

  const titleRef = useRef(null);
  const focusTitleOnClose = useRef(false);
  const {
    products,
    catalogs,
    loading,
    loadError,
    getProduct,
    saveProduct,
    toggleProductStatus,
  } = useProducts();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [actionError, setActionError] = useState("");

  const [toDisable, setToDisable] = useState(null);
  const [disabling, setDisabling] = useState(false);
  const [disableError, setDisableError] = useState("");

  const filterBy = (text) =>
    products.filter(
      (p) =>
        normalize(p.nombre).includes(normalize(text)) ||
        normalize(p.codigo).includes(normalize(text)),
    );
  const visible = filterBy(query);

  const handleSearch = (text) => {
    setQuery(text);
    const n = filterBy(text).length;
    setStatus(
      text
        ? `${countLabel(n)} ${n === 1 ? "encontrado" : "encontrados"} para «${text}»`
        : "",
    );
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
    const payload = isSuperadmin ? { ...data, idtienda: editing.idtienda } : data;
    await saveProduct(id, payload);
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
      setStatus(`Producto «${toDisable.nombre}» desactivado`);
      focusTitleOnClose.current = true;
      setToDisable(null);
    } catch (err) {
      setDisableError(err.message);
    } finally {
      setDisabling(false);
    }
  };

  const handleDisableClosed = () => {
    if (!focusTitleOnClose.current) return;
    focusTitleOnClose.current = false;
    titleRef.current?.focus();
  };

  return (
    <CrudPage
      config={{
        title: "Productos",
        subtitle: isSuperadmin
          ? "Productos de todas las tiendas."
          : "Administra el catálogo de productos de tu tienda.",
      }}
      navigation={{ trail }}
      feedback={{ status }}
      refs={{ titleRef }}
      action={
        !isSuperadmin && (
          <button type="button" className="btn btn-primary btn-block" onClick={openCreate}>
            <Plus aria-hidden="true" size={20} />
            Crear producto
          </button>
        )
      }
    >
      <Alert type="error">{actionError}</Alert>

      <SearchBar
        config={{ label: "Buscar un producto", placeholder: "Nombre o código" }}
        actions={{ onSearch: handleSearch }}
      />

      <CrudCard
        config={{
          title: isSuperadmin ? "Productos" : "Productos de tu tienda",
          subtitle: "Ordenados por código",
          badge: loading || loadError ? undefined : countLabel(visible.length),
        }}
      >
        {isSuperadmin ? (
          <DataTable
            table={{
              columns: COLUMNS,
              rows: visible,
              label: "Productos",
              getRowName: (p) => p.nombre,
            }}
            state={{ loading, error: loadError }}
            actions={{
              onEdit: openEdit,
              renderActions: (p) => (
                <button
                  type="button"
                  className="btn btn-danger-soft"
                  onClick={() => askDisable(p)}
                >
                  <PowerOff aria-hidden="true" size={13} />
                  Desactivar
                </button>
              ),
            }}
          />
        ) : (
          <CardCarousel config={{ label: "Productos" }} state={{ loading, error: loadError }}>
            {visible.map((product) => (
              <ItemCard
                key={product.id}
                config={{
                  title: product.nombre,
                  description: product.presentacion || undefined,
                  meta: `${soles(product.precio_venta)} · Cód. ${product.codigo}`,
                }}
                actions={{
                  onEdit: () => openEdit(product),
                  onDelete: () => askDisable(product),
                }}
              />
            ))}
          </CardCarousel>
        )}
      </CrudCard>

      <Dialog
        open={formOpen}
        config={{ title: editing ? "Editar producto" : "Crear producto" }}
        events={{ onClose: () => setFormOpen(false) }}
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
        config={{
          title: `¿Desactivar el producto ${toDisable?.nombre ?? ""}?`,
          ConfirmIcon: PowerOff,
          confirmLabel: "Desactivar producto",
          busyLabel: "Desactivando…",
        }}
        actions={{
          onConfirm: confirmDisable,
          onCancel: () => setToDisable(null),
          onClosed: handleDisableClosed,
        }}
        state={{ open: toDisable !== null, loading: disabling, error: disableError }}
      >
        <p>Este producto dejará de aparecer en el catálogo.</p>
      </ConfirmDialog>
    </CrudPage>
  );
}