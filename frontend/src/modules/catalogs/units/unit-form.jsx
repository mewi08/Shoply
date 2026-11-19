import { useId, useRef, useState } from "react";
import { Alert } from "../../../components/ui/alert";

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", maxLength: 20, required: true, autoFocus: true },
  { name: "abreviatura", label: "Abreviatura", type: "text", maxLength: 5 },
];

const toForm = (unit) =>
  Object.fromEntries(
    FIELDS.map((f) => [
      f.name,
      unit?.[f.name] ? String(unit[f.name]) : ""
    ]),
  );

const toPayload = (form) => ({
  nombre: form.nombre.trim(),
  abreviatura: form.abreviatura.trim() || null,
});

function Field(props) {
  const { id, field, value, onChange } = props;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {field.label}
      </label>
      <input
        id={id}
        className="form-input"
        type={field.type}
        maxLength={field.maxLength}
        autoComplete="off"
        data-autofocus={field.autoFocus}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function UnitForm(props) {
  const { unit, onSave, onCancel } = props;

  const inputId = useId();
  const formRef = useRef(null);

  const [form, setForm] = useState(() => toForm(unit));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const focusFirst = () =>
    formRef.current?.querySelector("[data-autofocus]")?.focus();

  const handleChange = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      setError("Escribe el nombre de la unidad de medida");
      focusFirst();
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(unit?.id, toPayload(form));
    } catch (err) {
      setError(err.message);
      setSaving(false);
      focusFirst();
    }
  };

  return (
    <form ref={formRef} className="crud-form" onSubmit={handleSubmit} noValidate>
      {FIELDS.map((field) => (
        <Field
          key={field.name}
          id={`${inputId}-${field.name}`}
          field={field}
          value={form[field.name]}
          onChange={handleChange(field.name)}
        />
      ))}

      {error && <Alert type="error">{error}</Alert>}

      <div className="crud-dialog-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}