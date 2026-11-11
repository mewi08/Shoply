import { useId, useState } from "react";
import { Alert } from "../../components/ui/alert";

const FIELDS = [
  { name: "nombre", label: "Nombre", max: 100, required: true },
  { name: "descripcion", label: "Descripción", max: 200 },
  { name: "direccion", label: "Dirección", max: 255, required: true },
  { name: "telefono", label: "Teléfono", max: 9, required: true, inputMode: "numeric"},
  { name: "ruc", label: "RUC", max: 11, inputMode: "numeric" },
];

const validate = (v) => {
  const errors = {};
  if (!v.nombre) errors.nombre = "Escribe el nombre de la tienda";
  if (!v.direccion) errors.direccion = "Escribe la dirección";
  if (!v.telefono) errors.telefono = "Escribe el teléfono";
  else if (!/^\d{9}$/.test(v.telefono)) errors.telefono = "El teléfono debe tener 9 dígitos";
  if (v.ruc && !/^\d{11}$/.test(v.ruc)) errors.ruc = "El RUC debe tener 11 dígitos";
  return errors;
};

export default function StoreForm({ store, onSave, onCancel }) {
  const formId = useId();

  const [values, setValues] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.name, store?.[f.name] ?? ""])),
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v.trim()]),
    );

    const found = validate(data);
    setErrors(found);
    setFormError("");

    const firstInvalid = FIELDS.find((f) => found[f.name]);
    if (firstInvalid) {
      e.currentTarget.elements[firstInvalid.name]?.focus();
      return;
    }

    data.descripcion ||= null;
    data.ruc ||= null;

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
        const errorId = `${id}-error`;
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
              data-autofocus={i === 0 ? true : undefined}
              value={values[f.name]}
              onChange={handleChange}
              aria-invalid={!!errors[f.name]}
              aria-describedby={errors[f.name] ? errorId : undefined}
            />
            <Alert type="error" id={errorId}>
              {errors[f.name]}
            </Alert>
          </div>
        );
      })}

      <Alert type="error">{formError}</Alert>

      <div className="crud-dialog-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : store ? "Guardar cambios" : "Crear tienda"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
