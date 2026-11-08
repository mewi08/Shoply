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
import CategoryForm from "./category-form";
import { useCategories } from "./use-category";

const trail = [{ label: "Menú", to: "/" }, { label: "Categorias" }];

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const countLabel = (n) => `${n} ${n === 1 ? "categoria" : "categorias"}`;

export default function Categories() {
  const titleRef = useRef(null);
  const focusTitleOnClose = useRef(false);
  const {
    categories,
    loading,
    loadError,
    getCategory,
    saveCategory,
    removeCategory,
  } = useCategories();

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
    categories.filter((c) => normalize(c.nombre).includes(normalize(text)));
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

  const openEdit = async (category) => {
    if (loadingEdit) return;
    setStatus("");
    setActionError("");
    setLoadingEdit(true);

    try {
      setEditing(await getCategory(category.id));
      setFormOpen(true);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSave = async (id, nombre) => {
    await saveCategory(id, nombre);
    setStatus(`Categoria «${nombre}» ${id ? "actualizada" : "creada"}`);
    setFormOpen(false);
  };

  const askDelete = (category) => {
    setDeleteError("");
    setToDelete(category);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      await removeCategory(toDelete.id);
      setStatus(`Categoria «${toDelete.nombre}» eliminada`);
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
        title: "Categorias",
        subtitle: "Organiza las categorias de los productos de tu tienda.",
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
          Crear categoria
        </button>
      }
    >
      <Alert type="error">{actionError}</Alert>

      <SearchBar
        config={{
          label: "Buscar una categoria",
          placeholder: "Nombre de la categoria",
        }}
        actions={{
          onSearch: handleSearch,
        }}
      />

      <CrudCard
        config={{
          title: "Categorias de tu tienda",
          subtitle: "Ordenadas de la A a la Z",
          badge: loading || loadError ? undefined : countLabel(visible.length),
        }}
      >
        <CardCarousel
          config={{
            label: "Categorias",
          }}
          state={{
            loading,
            error: loadError,
          }}
        >
          {visible.map((category) => (
            <ItemCard
              key={category.id}
              config={{
                title: category.nombre,
              }}
              actions={{
                onEdit: () => openEdit(category),
                onDelete: () => askDelete(category),
              }}
            />
          ))}
        </CardCarousel>
      </CrudCard>

      <Dialog
        open={formOpen}
        config={{
          title: editing ? "Editar categoria" : "Crear categoria",
        }}
        events={{ onClose: () => setFormOpen(false) }}
      >
        {formOpen && (
          <CategoryForm
            category={editing}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Dialog>

      <ConfirmDialog
        config={{
          title: `¿Eliminar la categoria ${toDelete?.nombre ?? ""}?`,
          ConfirmIcon: Trash2,
          confirmLabel: "Eliminar categoria",
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
          Esta categoria se quitará de tu tienda. No podrás deshacer esta acción.
        </p>
      </ConfirmDialog>
    </CrudPage>
  );
}
