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
import UnitForm from "./unit-form";
import { useUnits } from "./use-unit";

const trail = [
  { label: "Menú", to: "/" },
  { label: "Unidades de medida" },
];

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const countLabel = (n) =>
  `${n} ${n === 1 ? "unidad" : "unidades"}`;

export default function Units() {
  const titleRef = useRef(null);
  const focusTitleOnClose = useRef(false);

  const {
    units,
    loading,
    loadError,
    getUnit,
    saveUnit,
    removeUnit,
  } = useUnits();

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
    units.filter((unit) =>
      normalize(unit.nombre).includes(normalize(text))
    );

  const visible = filterBy(query);

  const handleSearch = (text) => {
    setQuery(text);

    const n = filterBy(text).length;

    setStatus(
      text
        ? `${countLabel(n)} ${n === 1 ? "encontrada" : "encontradas"} para «${text}»`
        : ""
    );
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

    setStatus(
      `Unidad «${data.nombre}» ${id ? "actualizada" : "creada"}`
    );

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
        title: "Unidades de medida",
        subtitle: "Administra las unidades de medida de los productos de tu tienda.",
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
          Crear unidad
        </button>
      }
    >
      <Alert type="error">{actionError}</Alert>

      <SearchBar
        config={{
          label: "Buscar una unidad",
          placeholder: "Nombre de la unidad",
        }}
        actions={{
          onSearch: handleSearch,
        }}
      />

      <CrudCard
        config={{
          title: "Unidades de medida de tu tienda",
          subtitle: "Ordenadas de la A a la Z",
          badge: loading || loadError ? undefined : countLabel(visible.length),
        }}
      >
        <CardCarousel
          config={{
            label: "Unidades de medida",
          }}
          state={{
            loading,
            error: loadError,
          }}
        >
          {visible.map((unit) => (
            <ItemCard
              key={unit.id}
              config={{
                title: unit.nombre,
                description: unit.abreviatura || "Sin abreviatura",
              }}
              actions={{
                onEdit: () => openEdit(unit),
                onDelete: () => askDelete(unit),
              }}
            />
          ))}
        </CardCarousel>
      </CrudCard>

      <Dialog
        open={formOpen}
        config={{
          title: editing ? "Editar unidad" : "Crear unidad",
        }}
        events={{
          onClose: () => setFormOpen(false),
        }}
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
        config={{
          title: `¿Eliminar la unidad ${toDelete?.nombre ?? ""}?`,
          ConfirmIcon: Trash2,
          confirmLabel: "Eliminar unidad",
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
          Esta unidad de medida se quitará de tu tienda. No podrás deshacer
          esta acción.
        </p>
      </ConfirmDialog>
    </CrudPage>
  );
}