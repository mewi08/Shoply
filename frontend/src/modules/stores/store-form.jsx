import { useId, useState } from "react";
import { Alert } from "../../components/ui/alert";

const FIELDS = [
  { name: "nombre", label: "Nombre", max: 100, required: true },
  { name: "descripcion", label: "Descripción", max: 200 },
  { name: "direccion", label: "Dirección", max: 255, required: true },
  { name: "telefono", label: "Teléfono", max: 9, required: true, inputMode: "numeric" },
  { name: "ruc", label: "RUC", max: 11, inputMode: "numeric" },
];

const toForm = (store) =>
  Object.fromEntries(
    FIELDS.map((f) => [f.name, String(store?.[f.name] ?? "")]),
  );

export default function StoreForm(props) {
  const { store, onSave, onCancel } = props;

  const formId = useId();

  const [values, setValues] = useState(() => toForm(store));
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );

    const missing = FIELDS.filter((f) => f.required && !data[f.name]);
    if (missing.length > 0) {
      setFormError(`Falta completar: ${missing.map((f) => f.label).join(", ")}`);
      e.currentTarget.elements[missing[0].name]?.focus();
      return;
    }

    data.descripcion ||= null;
    data.ruc ||= null;

    setFormError("");
    setSaving(true);

    try {
      await onSave(store?.id, data);
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="crud-form" onSubmit={handleSubmit} noValidate>
      {FIELDS.map((f, i) => {
        const id = `${formId}-${f.name}`;

        return (
          <div className="form-field" key={f.name}>
            <label htmlFor={id} className="form-label">
              {f.label}
              {!f.required && " (opcional)"}
            </label>
            <input
              id={id}
              name={f.name}
              className="form-input"
              type="text"
              maxLength={f.max}
              inputMode={f.inputMode}
              autoComplete="off"
              data-autofocus={i === 0 ? "" : undefined}
              value={values[f.name]}
              onChange={handleChange}
            />
          </div>
        );
      })}

      {formError && <Alert type="error">{formError}</Alert>}

      <div className="crud-dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}