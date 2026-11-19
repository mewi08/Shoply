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
import ProductsCatalog from "./modules/products/products-catalog";
import Administration from "./modules/panel/administration";
import Tpv from "./modules/sales/tvp/tpv";
import AppLayout from "./components/layout/app-layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Panel />} />
          <Route path="/tiendas" element={<Stores />} />
          <Route path="/tpv" element={<Tpv />} />
          <Route path="/catalogo-productos" element={<ProductsCatalog />} />
          <Route path="/administracion" element={<Administration />} />
          <Route path="/administracion/productos" element={<Products />} />
          <Route path="/administracion/marcas" element={<Brands />} />
          <Route path="/administracion/categorias" element={<Categories />} />
          <Route path="/administracion/unidades-medida" element={<Units />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
