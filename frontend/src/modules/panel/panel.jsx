import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, me } from "../auth/auth.service";

export default function Panel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    me()
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (!user) return <p>Cargando…</p>;

  return (
    <main>
      <h1>Hola, {user.nombres || user.username}</h1>
      <button type="button" className="btn btn-primary" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  );
}