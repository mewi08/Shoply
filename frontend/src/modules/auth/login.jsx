import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./auth.service";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const errorId = useId();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Inicia sesión</h1>
        <p className="auth-subtitle">
          Entra a tu tienda para ver tu inventario y tus ventas.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p id={errorId} className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-field">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              className="form-input"
              type="text"
              autoComplete="username"
              required
              value={form.username}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="form-password">
              <input
                id="password"
                name="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
              />
              <button
                type="button"
                className="form-toggle"
                aria-label="Mostrar contraseña"
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={20} />
                ) : (
                  <Eye aria-hidden="true" size={20} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Aún no tienes tienda?{" "}
          <Link to="/registro" className="auth-link">
            Crea tu cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}
