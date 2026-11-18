import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { logout, me } from "../auth/auth.service";
import { Sidebar } from "../../components/layout/sidebar";

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
    <main className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="app-content">
        <Outlet />
      </div>
    </main>
  );
}