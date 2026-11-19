import { useId, useRef, useState } from "react";
import { Alert } from "../../../components/crud";

const FIELDS = [
  {
    name: "idproducto",
    label: "Producto",
    type: "select",
    options: [],
    required: true,
    autoFocus: true,
  },
  {
    name: "tipo_ingreso",
    label: "Tipo de ingreso",
    type: "select",
    options: [
      { value: "compra", label: "Compra" },
      { value: "inicial", label: "Inventario inicial" },
      { value: "devolucion", label: "Devolución" },
      { value: "ajuste", label: "Ajuste" },
    ],
  },
  {
    name: "cantidad_inicial",
    label: "Cantidad",
    type: "number",
    min: "0",
    step: "0.001",
    required: true,
  },
  {
    name: "costo_unitario",
    label: "Costo unitario, S/ (opcional)",
    type: "number",
    min: "0",
    step: "0.01",
  },
  {
    name: "fecha_caducidad",
    label: "Fecha de caducidad (opcional)",
    type: "date",
  },
];

const toForm = () => ({
  idproducto: "",
  tipo_ingreso: "compra",
  cantidad_inicial: "",
  costo_unitario: "",
  fecha_caducidad: "",
});

const toPayload = (form) => ({
  idproducto: Number(form.idproducto),
  tipo_ingreso: form.tipo_ingreso,
  cantidad_inicial: Number(form.cantidad_inicial),
  costo_unitario: form.costo_unitario ? Number(form.costo_unitario) : null,
  fecha_caducidad: form.fecha_caducidad || null,
});

function Field(props) {
  const { id, field, value, onChange, products } = props;

  const options =
    field.name === "idproducto"
      ? products.map((product) => ({
          value: product.id,
          label: `${product.nombre}${product.presentacion ? ` ${product.presentacion}` : ""}`,
        }))
      : field.options;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {field.label}
      </label>

      {field.type === "select" ? (
        <select
          id={id}
          className="form-input"
          value={value}
          onChange={onChange}
          data-autofocus={field.autoFocus}
        >
          <option value="">Selecciona…</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          className="form-input"
          type={field.type}
          min={field.min}
          step={field.step}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default function BatchForm(props) {
  const { products, onSave, onCancel } = props;

  const inputId = useId();
  const formRef = useRef(null);

  const [form, setForm] = useState(() => toForm());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const focusFirst = () =>
    formRef.current?.querySelector("[data-autofocus]")?.focus();

  const handleChange = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.idproducto || !form.cantidad_inicial) {
      setError("Elige el producto y escribe la cantidad");
      focusFirst();
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(toPayload(form));
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
    >
      {FIELDS.map((field) => (
        <Field
          key={field.name}
          id={`${inputId}-${field.name}`}
          field={field}
          value={form[field.name]}
          onChange={handleChange(field.name)}
          products={products}
        />
      ))}

      {error && <Alert type="error">{error}</Alert>}

      <div className="crud-dialog-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Registrar lote"}
        </button>

        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
