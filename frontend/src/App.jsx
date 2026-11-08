import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./modules/auth/login";
import Panel from "./modules/panel/panel";
import Brands from "./modules/catalogs/brands/brands";
import ProtectedRoute from "./components/protected-route";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Panel />} />
        <Route path="/marcas" element={<Brands />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}