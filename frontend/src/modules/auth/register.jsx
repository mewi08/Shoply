import { useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { register } from "./auth.service";
import { DOC_INFO, validateStep } from "./register.validators";
import "./auth.css";

const STEPS = ["Tus datos", "Tu acceso", "Tu tienda"];

const INITIAL = {
  tipo_doc: "DNI", num_doc: "", nombres: "", ape_paterno: "", ape_materno: "",
  razon_social: "", correo: "", telefono: "",
  username: "", password: "",
  tienda_nombre: "", tienda_descripcion: "", tienda_direccion: "", tienda_telefono: "",
};

function Field({ label, name, form, errors, onChange, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        name={name}
        className="form-input"
        value={form[name]}
        onChange={onChange}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? errorId : undefined}
        {...props}
      />
      {errors[name] && <p id={errorId} className="form-error">{errors[name]}</p>}
    </div>
  );
}

function PasswordField({ label, name, form, errors, onChange }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [show, setShow] = useState(false);

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="form-password">
        <input
          id={id}
          name={name}
          className="form-input"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={form[name]}
          onChange={onChange}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? errorId : undefined}
        />
        <button
          type="button"
          className="form-toggle"
          aria-label="Mostrar contraseña"
          aria-pressed={show}
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}
        </button>
      </div>
      {errors[name] && <p id={errorId} className="form-error">{errors[name]}</p>}
    </div>
  );
}

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    if (step > 0) titleRef.current?.focus();
  }, [step]);

  const isRuc = form.tipo_doc === "RUC";
  const doc = DOC_INFO[form.tipo_doc];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "tipo_doc") return { ...prev, tipo_doc: value, num_doc: "" };
      if (name === "num_doc") {
        const { numeric, max } = DOC_INFO[prev.tipo_doc];
        const clean = numeric
          ? value.replace(/\D/g, "")
          : value.replace(/[^A-Za-z0-9]/g, "");
        return { ...prev, num_doc: clean.slice(0, max) };
      }
      return { ...prev, [name]: value };
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const field = (label, name, props) => (
    <Field label={label} name={name} form={form} errors={errors} onChange={handleChange} {...props} />
  );

  const back = () => {
    setError("");
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const found = validateStep(step, form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.elements[first]?.focus();
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    const t = (v) => v.trim();
    setLoading(true);
    try {
      const res = await register({
        persona: {
          tipo_doc: form.tipo_doc,
          num_doc: t(form.num_doc),
          correo: t(form.correo),
          telefono: t(form.telefono),
          ...(isRuc
            ? { razon_social: t(form.razon_social) }
            : {
                nombres: t(form.nombres),
                ape_paterno: t(form.ape_paterno),
                ape_materno: t(form.ape_materno),
              }),
        },
        usuario: { username: t(form.username), password: form.password },
        tienda: {
          nombre: t(form.tienda_nombre),
          descripcion: t(form.tienda_descripcion),
          direccion: t(form.tienda_direccion),
          telefono: t(form.tienda_telefono),
        },
      });
      setMessage(res.message);
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

        <ol className="stepper" aria-label="Progreso del registro">
          {STEPS.map((name, i) => (
            <li
              key={name}
              className={i < step ? "is-done" : i === step ? "is-current" : undefined}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="stepper-dot" aria-hidden="true">{i < step ? "✓" : i + 1}</span>
              <span className="stepper-label">{name}</span>
            </li>
          ))}
        </ol>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error" role="alert">{error}</p>}

          <h2 className="auth-step-title" ref={titleRef} tabIndex={-1}>
            Paso {step + 1} de {STEPS.length}: {STEPS[step]}
          </h2>

          {step === 0 && (
            <>
              <div className="form-field">
                <label htmlFor="tipo_doc" className="form-label">Tipo de documento</label>
                <select
                  id="tipo_doc"
                  name="tipo_doc"
                  className="form-input"
                  value={form.tipo_doc}
                  onChange={handleChange}
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de extranjería</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>
              {field(`Número de documento (${doc.hint})`, "num_doc", {
                maxLength: doc.max,
                inputMode: doc.numeric ? "numeric" : "text",
                autoComplete: "off",
              })}
              {isRuc ? (
                field("Razón social", "razon_social")
              ) : (
                <>
                  {field("Nombres", "nombres", { autoComplete: "given-name" })}
                  {field("Apellido paterno", "ape_paterno")}
                  {field("Apellido materno (opcional)", "ape_materno")}
                </>
              )}
              {field("Correo (opcional)", "correo", { type: "email", autoComplete: "email" })}
              {field("Teléfono (opcional)", "telefono", { inputMode: "numeric", maxLength: 9, autoComplete: "tel" })}
            </>
          )}

          {step === 1 && (
            <>
              {field("Usuario", "username", { autoComplete: "username" })}
              <PasswordField
                label="Contraseña"
                name="password"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <PasswordField
                label="Confirmar contraseña"
                name="confirm_password"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
            </>
          )}

          {step === 2 && (
            <>
              {field("Nombre de la tienda", "tienda_nombre")}
              {field("Descripción (opcional)", "tienda_descripcion", { maxLength: 200 })}
              {field("Dirección", "tienda_direccion")}
              {field("Teléfono de la tienda", "tienda_telefono", { inputMode: "numeric", maxLength: 9 })}
              <p className="auth-note">
                Revisaremos tu solicitud antes de activar la tienda. Podrás ingresar cuando sea aprobada.
              </p>
            </>
          )}

          <div className="auth-actions">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={back} disabled={loading}>
                Atrás
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {step < STEPS.length - 1 ? "Siguiente" : loading ? "Enviando…" : "Enviar solicitud"}
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