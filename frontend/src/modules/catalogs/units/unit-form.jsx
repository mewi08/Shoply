import { useId, useRef, useState } from "react";
import { Alert } from "../../../components/ui/alert";

export default function UnitForm({ unit, onSave, onCancel }) {
  const errorId = useId();
  const nombreRef = useRef(null);

  const [inputNombre, setNombre] = useState(unit?.nombre ?? "");
  const [inputAbreviatura, setAbreviatura] = useState(unit?.abreviatura ?? "");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = inputNombre.trim();
    const abreviatura = inputAbreviatura.trim();

    if (!nombre) {
      setError("Escribe el nombre de la unidad de medida");
      nombreRef.current?.focus();
      return;
    }

    const data = { nombre, abreviatura };

    setSaving(true);
    setError("");

    try {
      await onSave(unit?.id, data);
    } catch (err) {
      setError(err.message);
      setSaving(false);
      nombreRef.current?.focus();
    }
  };

  return (
    <form className="crud-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="unit-name" className="form-label">
          Nombre
        </label>

        <input
          id="unit-name"
          ref={nombreRef}
          className="form-input"
          type="text"
          maxLength={20}
          autoComplete="off"
          data-autofocus
          value={inputNombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />

        <Alert type="error" id={errorId}>
          {error}
        </Alert>
      </div>

      <div className="form-field">
        <label htmlFor="unit-abbreviation" className="form-label">
          Abreviatura
        </label>

        <input
          id="unit-abbreviation"
          className="form-input"
          type="text"
          maxLength={5}
          autoComplete="off"
          value={inputAbreviatura}
          onChange={(e) => setAbreviatura(e.target.value)}
        />
      </div>

      <div className="crud-dialog-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving
            ? "Guardando…"
            : unit
              ? "Guardar cambios"
              : "Crear unidad"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}