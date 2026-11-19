import { useId, useRef, useState } from "react";
import { Alert } from "../../components/crud";
import * as clientsService from "./clients.service";

const DOC_LENGTH = { DNI: 8, CE: 9, RUC: 11 };

const FIELDS = [
  {
    name: "tipo_doc",
    label: "Tipo de documento",
    type: "select",
    options: [
      { value: "DNI", label: "DNI" },
      { value: "CE", label: "Carné de extranjería" },
      { value: "RUC", label: "RUC" },
    ],
  },
  {
    name: "num_doc",
    label: "Número de documento",
    type: "text",
    required: true,
    autoFocus: true,
  },
  { name: "razon_social", label: "Razón social", type: "text", maxLength: 100 },
  { name: "nombres", label: "Nombres", type: "text", maxLength: 50 },
  {
    name: "ape_paterno",
    label: "Apellido paterno",
    type: "text",
    maxLength: 50,
  },
  {
    name: "ape_materno",
    label: "Apellido materno",
    type: "text",
    maxLength: 50,
  },
  { name: "correo", label: "Correo (opcional)", type: "email", maxLength: 100 },
  {
    name: "telefono",
    label: "Teléfono (opcional)",
    type: "text",
    maxLength: 9,
  },
];

const toForm = (client) =>
  Object.fromEntries(FIELDS.map((f) => [f.name, client?.[f.name] || ""]));

const toPayload = (form) =>
  Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );

function Field(props) {
  const { id, field, value, onChange, maxLength } = props;

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
        >
          {field.options.map((option) => (
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
          maxLength={maxLength ?? field.maxLength}
          inputMode={
            field.name === "num_doc" || field.name === "telefono"
              ? "numeric"
              : undefined
          }
          autoComplete="off"
          data-autofocus={field.autoFocus}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default function ClientForm(props) {
  const { onSaved, onCancel } = props;

  const inputId = useId();
  const formRef = useRef(null);

  const [form, setForm] = useState(() => ({ ...toForm(), tipo_doc: "DNI" }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isCompany = form.tipo_doc === "RUC";

  const visibleFields = FIELDS.filter((f) => {
    if (f.name === "razon_social") return isCompany;

    if (["nombres", "ape_paterno", "ape_materno"].includes(f.name)) {
      return !isCompany;
    }

    return true;
  });

  const focusFirst = () =>
    formRef.current?.querySelector("[data-autofocus]")?.focus();

  const handleChange = (name) => (e) => {
    const { value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === "tipo_doc" ? { num_doc: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = toPayload(form);

    const hasName = isCompany
      ? data.razon_social
      : data.nombres && data.ape_paterno;

    if (!data.num_doc || !hasName) {
      setError("Completa el documento y el nombre del cliente");
      focusFirst();
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await clientsService.create(data);

      onSaved({ id: res.data.id, ...data });
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
      {visibleFields.map((field) => (
        <Field
          key={field.name}
          id={`${inputId}-${field.name}`}
          field={field}
          value={form[field.name]}
          maxLength={
            field.name === "num_doc" ? DOC_LENGTH[form.tipo_doc] : undefined
          }
          onChange={handleChange(field.name)}
        />
      ))}

      {error && <Alert type="error">{error}</Alert>}

      <div className="crud-dialog-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Guardar y elegir"}
        </button>

        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
