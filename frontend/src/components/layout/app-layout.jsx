import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { logout, me } from "../../modules/auth/auth.service";
import { Sidebar } from "./sidebar";

export default function AppLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    me()
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login", { replace: true }));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (!user) return <p>Cargando…</p>;

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="app-content">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}