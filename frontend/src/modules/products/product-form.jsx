import { useEffect, useId, useRef, useState } from "react";
import { Alert } from "../../components/ui/alert";

const STEPS = [
  {
    title: "Datos del producto",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", maxLength: 120, required: true, autoFocus: true },
      { name: "codigo", label: "Código", type: "text", maxLength: 8, required: true },
      { name: "descripcion", label: "Descripción (opcional)", type: "text", maxLength: 200 },
      { name: "presentacion", label: "Presentación (opcional)", type: "text", maxLength: 20 },
    ],
  },
  {
    title: "Clasificación",
    fields: [
      { name: "idmarca", label: "Marca (opcional)", type: "select", catalog: "brands", empty: "Sin marca", autoFocus: true },
      { name: "idcategoria", label: "Categoría", type: "select", catalog: "categories", empty: "Selecciona…", required: true },
      { name: "idunidadmedida", label: "Unidad de medida", type: "select", catalog: "units", empty: "Selecciona…", required: true },
    ],
  },
  {
    title: "Precio y stock",
    fields: [
      { name: "precio_venta", label: "Precio de venta (S/)", type: "number", min: 0, max: 99999.99, step: 0.01, required: true, autoFocus: true },
      { name: "cantidad_minima", label: "Cantidad mínima", type: "number", min: 0, max: 999.999, step: 0.001, initial: "0" },
    ],
  },
];

const FIELDS = STEPS.flatMap((step) => step.fields);

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

function Field(props) {
  const { id, field, value, options, onChange } = props;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{field.label}</label>

      {field.type === "select" ? (
        <select
          id={id}
          className="form-input"
          data-autofocus={field.autoFocus ? "" : undefined}
          value={value}
          onChange={onChange}
        >
          <option value="">{field.empty}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.nombre}</option>
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

export default function ProductForm(props) {
  const { product, catalogs, onSave, onCancel } = props;

  const formId = useId();
  const formRef = useRef(null);

  const [form, setForm] = useState(() => toForm(product));
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const focusFirst = () =>
    formRef.current?.querySelector("[data-autofocus]")?.focus();

  useEffect(() => {
    focusFirst();
  }, [stepIndex]);

  const handleChange = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  const goBack = () => {
    setError("");
    setStepIndex(stepIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = step.fields.filter((f) => f.required && !form[f.name].trim());
    if (missing.length > 0) {
      setError(`Falta completar: ${missing.map((f) => f.label).join(", ")}`);
      focusFirst();
      return;
    }

    setError("");

    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }

    setSaving(true);

    try {
      await onSave(product?.id, toPayload(form));
    } catch (err) {
      setError(err.message);
      setSaving(false);
      focusFirst();
    }
  };

  return (
    <form ref={formRef} className="crud-form" onSubmit={handleSubmit} noValidate>
      <p className="form-step">
        Paso {stepIndex + 1} de {STEPS.length}: {step.title}
      </p>

      {step.fields.map((field) => (
        <Field
          key={field.name}
          id={`${formId}-${field.name}`}
          field={field}
          value={form[field.name]}
          options={catalogs[field.catalog]}
          onChange={handleChange(field.name)}
        />
      ))}

      {error && <Alert type="error">{error}</Alert>}

      <div className="crud-dialog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={isFirstStep ? onCancel : goBack}
        >
          {isFirstStep ? "Cancelar" : "Anterior"}
        </button>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {isLastStep ? (saving ? "Guardando…" : "Guardar") : "Siguiente"}
        </button>
      </div>
    </form>
  );
}