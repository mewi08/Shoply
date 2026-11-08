import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Alert,
  CardCarousel,
  ConfirmDialog,
  CrudCard,
  CrudPage,
  Dialog,
  ItemCard,
  SearchBar,
} from "../../../components/crud";
import BrandForm from "./brand-form";
import { useBrands } from "./use-brands";

const trail = [{ label: "Menú", to: "/" }, { label: "Marcas" }];

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const countLabel = (n) => `${n} ${n === 1 ? "marca" : "marcas"}`;

export default function Brands() {
  const titleRef = useRef(null);
  const focusTitleOnClose = useRef(false);
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

  const filterBy = (text) =>
    brands.filter((b) => normalize(b.nombre).includes(normalize(text)));
  const visible = filterBy(query);

  const handleSearch = (text) => {
    setQuery(text);
    const n = filterBy(text).length;
    setStatus(
      text
        ? `${countLabel(n)} ${n === 1 ? "encontrada" : "encontradas"} para «${text}»`
        : "",
    );
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
      focusTitleOnClose.current = true;
      setToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteClosed = () => {
    if (!focusTitleOnClose.current) return;
    focusTitleOnClose.current = false;
    titleRef.current?.focus();
  };

  return (
    <CrudPage
      config={{
        title: "Marcas",
        subtitle: "Organiza las marcas de los productos de tu tienda.",
      }}
      navigation={{ trail }}
      feedback={{ status }}
      refs={{ titleRef }}
      action={
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={openCreate}
        >
          <Plus aria-hidden="true" size={20} />
          Crear marca
        </button>
      }
    >
      <Alert type="error">{actionError}</Alert>

      <SearchBar
        config={{
          label: "Buscar una marca",
          placeholder: "Nombre de la marca",
        }}
        actions={{
          onSearch: handleSearch,
        }}
      />

      <CrudCard
        config={{
          title: "Marcas de tu tienda",
          subtitle: "Ordenadas de la A a la Z",
          badge: loading || loadError ? undefined : countLabel(visible.length),
        }}
      >
        <CardCarousel
          config={{
            label: "Marcas",
          }}
          state={{
            loading,
            error: loadError,
          }}
        >
          {visible.map((brand) => (
            <ItemCard
              key={brand.id}
              config={{
                title: brand.nombre,
              }}
              actions={{
                onEdit: () => openEdit(brand),
                onDelete: () => askDelete(brand),
              }}
            />
          ))}
        </CardCarousel>
      </CrudCard>

      <Dialog
        open={formOpen}
        config={{
          title: editing ? "Editar marca" : "Crear marca",
        }}
        events={{ onClose: () => setFormOpen(false) }}
      >
        {formOpen && (
          <BrandForm
            brand={editing}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Dialog>

      <ConfirmDialog
        config={{
          title: `¿Eliminar la marca ${toDelete?.nombre ?? ""}?`,
          ConfirmIcon: Trash2,
          confirmLabel: "Eliminar marca",
        }}
        actions={{
          onConfirm: confirmDelete,
          onCancel: () => setToDelete(null),
          onClosed: handleDeleteClosed,
        }}
        state={{
          open: toDelete !== null,
          loading: deleting,
          error: deleteError,
        }}
      >
        <p>
          Esta marca se quitará de tu tienda. No podrás deshacer esta acción.
        </p>
      </ConfirmDialog>
    </CrudPage>
  );
}
