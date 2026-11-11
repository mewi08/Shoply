import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { me } from "../modules/auth/auth.service";

export default function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await me();
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setChecked(true);
      }
    };

    validateSession();
  }, []);

  if (!checked) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet context={{ user }} />;
}
