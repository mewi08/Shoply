import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { me } from "../modules/auth/auth.service";

export default function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        await me();
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      }
    };

    validateSession();
  }, []);

  if (authenticated === null) return;

  if (!authenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}