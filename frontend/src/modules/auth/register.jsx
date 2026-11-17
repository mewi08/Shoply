import { useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { register } from "./auth.service";

const isCompany = (form) => form.tipo_doc === "RUC";
const isPerson = (form) => form.tipo_doc !== "RUC";

const STEPS = [
  {
    title: "Tus datos",
    fields: [
      {
        name: "tipo_doc", label: "Tipo de documento", type: "select", initial: "DNI", required: true,
        options: [["DNI", "DNI"], ["CE", "Carné de extranjería"], ["RUC", "RUC"]],
      },
      { name: "num_doc", label: "Número de documento", inputMode: "numeric", required: true },
      { name: "razon_social", label: "Razón social", required: true, show: isCompany },
      { name: "nombres", label: "Nombres", required: true, show: isPerson },
      { name: "ape_paterno", label: "Apellido paterno", required: true, show: isPerson },
      { name: "ape_materno", label: "Apellido materno (opcional)", show: isPerson },
      { name: "correo", label: "Correo (opcional)", type: "email" },
      { name: "telefono", label: "Teléfono (opcional)", maxLength: 9, inputMode: "numeric" },
    ],
  },
  {
    title: "Tu acceso",
    fields: [
      { name: "username", label: "Usuario", required: true },
      { name: "password", label: "Contraseña", type: "password", required: true },
      { name: "confirm_password", label: "Confirmar contraseña", type: "password", required: true },
    ],
  },
  {
    title: "Tu tienda",
    fields: [
      { name: "tienda_nombre", label: "Nombre de la tienda", required: true },
      { name: "tienda_descripcion", label: "Descripción (opcional)", maxLength: 200 },
      { name: "tienda_direccion", label: "Dirección", required: true },
      { name: "tienda_telefono", label: "Teléfono de la tienda", maxLength: 9, inputMode: "numeric", required: true },
    ],
  },
];


const FIELDS = STEPS.flatMap((step) => step.fields);
const INITIAL = Object.fromEntries(FIELDS.map((f) => [f.name, f.initial ?? ""]));

function Field(props) {
  const { field, value, maxLength, onChange } = props;

  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = field.type === "password";

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{field.label}</label>

      {field.type === "select" ? (
        <select id={id} name={field.name} className="form-input" value={value} onChange={onChange}>
          {field.options.map(([code, text]) => (
            <option key={code} value={code}>{text}</option>
          ))}
        </select>
      ) : (
        <div className={isPassword ? "form-password" : undefined}>
          <input
            id={id}
            name={field.name}
            className="form-input"
            type={isPassword && show ? "text" : field.type}
            maxLength={maxLength}
            inputMode={field.inputMode}
            value={value}
            onChange={onChange}
          />
          {isPassword && (
            <button type="button" className="form-toggle" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Register() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const titleRef = useRef(null);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const buttonText = isLastStep ? "Enviar solicitud" : "Siguiente";
  const visibleFields = step.fields.filter((f) => !f.show || f.show(form));
  const docLength = isCompany(form) ? 11 : 8;

  useEffect(() => {
    if (stepIndex > 0) titleRef.current?.focus();
  }, [stepIndex]);

  const stepClass = (i) => {
    if (i < stepIndex) return "is-done";
    if (i === stepIndex) return "is-current";
    return undefined;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const goBack = () => {
    setError("");
    setStepIndex(stepIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");

    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }

    const data = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );

    const names = isCompany(data)
      ? { razon_social: data.razon_social }
      : { nombres: data.nombres, ape_paterno: data.ape_paterno, ape_materno: data.ape_materno };

    setLoading(true);

    try {
      const response = await register({
        persona: {
          tipo_doc: data.tipo_doc,
          num_doc: data.num_doc,
          correo: data.correo,
          telefono: data.telefono,
          ...names,
        },
        usuario: { username: data.username, password: form.password },
        tienda: {
          nombre: data.tienda_nombre,
          descripcion: data.tienda_descripcion,
          direccion: data.tienda_direccion,
          telefono: data.tienda_telefono,
        },
      });
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (message)
    return (
      <main className="auth-page">
        <section className="auth-card" role="status">
          <h1 className="auth-title">Solicitud enviada</h1>
          <p className="auth-subtitle">
            Revisaremos tus datos y activaremos tu tienda. Podrás ingresar cuando sea aprobada.
          </p>
          <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
        </section>
      </main>
    );

  return (
    <main className="auth-page">
      <section className="auth-card is-wide">
        <h1 className="auth-title">Crea tu cuenta</h1>

        <ol className="stepper">
          {STEPS.map((item, i) => (
            <li key={item.title} className={stepClass(i)}>
              <span className="stepper-dot">{i < stepIndex ? "✓" : i + 1}</span>
              <span className="stepper-label">{item.title}</span>
            </li>
          ))}
        </ol>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error" role="alert">{error}</p>}

          <h2 className="auth-step-title" ref={titleRef} tabIndex={-1}>
            Paso {stepIndex + 1} de {STEPS.length}: {step.title}
          </h2>

          {visibleFields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={form[field.name]}
            maxLength={field.name === "num_doc" ? docLength : field.maxLength}
            onChange={handleChange}
          />
        ))}

          {isLastStep && (
            <p className="auth-note">
              Revisaremos tu solicitud antes de activar la tienda. Podrás ingresar cuando sea aprobada.
            </p>
          )}

          <div className="auth-actions">
            {stepIndex > 0 && (
              <button type="button" className="btn btn-secondary" onClick={goBack} disabled={loading}>
                Atrás
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando…" : buttonText}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </section>
    </main>
  );
}