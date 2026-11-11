import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./modules/auth/login";
import Panel from "./modules/panel/panel";
import Brands from "./modules/catalogs/brands/brands";
import ProtectedRoute from "./components/protected-route";
import Categories from "./modules/catalogs/categories/categories";
import Units from "./modules/catalogs/units/units";
import Register from "./modules/auth/register";
import Stores from "./modules/stores/stores";
import Products from "./modules/products/products";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Panel />} />
        <Route path="/marcas" element={<Brands />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/unidades-medida" element={<Units />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/tiendas" element={<Stores />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}