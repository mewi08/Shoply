import { useId, useRef, useState } from "react";
import { Alert } from "../../components/ui/alert";

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", maxLength: 120, required: true, autoFocus: true },
  { name: "codigo", label: "Código", type: "text", maxLength: 8, required: true },
  { name: "descripcion", label: "Descripción (opcional)", type: "text", maxLength: 200 },
  { name: "presentacion", label: "Presentación (opcional)", type: "text", maxLength: 20 },
  { name: "idmarca", label: "Marca (opcional)", type: "select", catalog: "brands", empty: "Sin marca" },
  { name: "idcategoria", label: "Categoría", type: "select", catalog: "categories", empty: "Selecciona…", required: true },
  { name: "idunidadmedida", label: "Unidad de medida", type: "select", catalog: "units", empty: "Selecciona…", required: true },
  { name: "precio_venta", label: "Precio de venta (S/)", type: "number", min: 0, max: 99999.99, step: 0.01, required: true },
  { name: "cantidad_minima", label: "Cantidad mínima", type: "number", min: 0, max: 999.999, step: 0.001, initial: "0" },
];

const toForm = (product) =>
  Object.fromEntries(
    FIELDS.map((f) => [
      f.name,
      product?.[f.name] != null ? String(product[f.name]) : (f.initial ?? ""),
    ]),
  );

const toPayload = (form) => ({
  nombre: form.nombre.trim(),
  codigo: form.codigo.trim(),
  descripcion: form.descripcion.trim() || null,
  presentacion: form.presentacion.trim() || null,
  idmarca: form.idmarca ? Number(form.idmarca) : null,
  idcategoria: Number(form.idcategoria),
  idunidadmedida: Number(form.idunidadmedida),
  precio_venta: Number(form.precio_venta),
  cantidad_minima: Number(form.cantidad_minima || 0),
});

function Field({ id, field, value, options, onChange }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {field.label}
      </label>

      {field.type === "select" ? (
        <select id={id} className="form-input" value={value} onChange={onChange}>
          <option value="">{field.empty}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nombre}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          className="form-input"
          type={field.type}
          maxLength={field.maxLength}
          min={field.min}
          max={field.max}
          step={field.step}
          autoComplete="off"
          data-autofocus={field.autoFocus ? "" : undefined}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default function ProductForm({ product, catalogs, onSave, onCancel }) {
  const uid = useId();
  const errorId = `${uid}-error`;
  const formRef = useRef(null);

  const [form, setForm] = useState(() => toForm(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const focusFirst = () => formRef.current?.querySelector("[data-autofocus]")?.focus();

  const handleChange = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = FIELDS.some((f) => f.required && !form[f.name].trim());
    if (missing) {
      setError("Completa nombre, código, categoría, unidad y precio");
      focusFirst();
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(product?.id, toPayload(form));
    } catch (err) {
      setError(err.message);
      setSaving(false);
      focusFirst();
    }
  };

  return (
    <form
      ref={formRef}
      className="crud-form"
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={error ? errorId : undefined}
    >
      {FIELDS.map((field) => (
        <Field
          key={field.name}
          id={`${uid}-${field.name}`}
          field={field}
          value={form[field.name]}
          options={catalogs[field.catalog]}
          onChange={handleChange(field.name)}
        />
      ))}

      <Alert type="error" id={errorId}>
        {error}
      </Alert>

      <div className="crud-dialog-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}