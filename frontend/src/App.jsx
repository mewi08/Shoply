import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./modules/auth/login";
import Panel from "./modules/panel/panel";
import Brands from "./modules/catalogs/brands/brands";
import ProtectedRoute from "./components/protected-route";
import Categories from "./modules/catalogs/categories/categories";
import Units from "./modules/catalogs/units/units";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Panel />} />
        <Route path="/marcas" element={<Brands />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/unidades-medida" element={<Units />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}