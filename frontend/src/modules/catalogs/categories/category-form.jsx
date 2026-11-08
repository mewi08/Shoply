import { useId, useRef, useState } from "react";
import { Alert } from "../../../components/ui/alert";

export default function CategoryForm({ category, onSave, onCancel }) {
  const errorId = useId();
  const inputRef = useRef(null);

  const [nombre, setNombre] = useState(category?.nombre ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = nombre.trim();

    if (!value) {
      setError("Escribe el nombre de la categoria");
      inputRef.current?.focus();
      return;
    }

    setSaving(true);
    setError("");

    try {
        await onSave(category?.id, value);
    } catch (err) {
        setError(err.message);
        setSaving(false);
        inputRef.current?.focus();
    }
  };

  return (
    <form className="crud-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="category-name" className="form-label">
          Nombre
        </label>
        <input
          id="category-name"
          ref={inputRef}
          className="form-input"
          type="text"
          maxLength={50}
          autoComplete="off"
          data-autofocus
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        <Alert type="error" id={errorId}>
          {error}
        </Alert>
      </div>

      <div className="crud-dialog-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : category ? "Guardar cambios" : "Crear categoria"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
