import { Link } from "react-router-dom";
import { ItemCard, CrudPage } from "../../components/crud";

const trail = [{ label: "Menú", to: "/" }, { label: "Administración" }];

const MODULOS = [
  {
    titulo: "Productos",
    descripcion: "Registrar, modificar y administrar productos.",
    to: "/administracion/productos",
  },
  {
    titulo: "Marcas",
    descripcion: "Gestionar las marcas disponibles.",
    to: "/administracion/marcas",
  },
  {
    titulo: "Categorías",
    descripcion: "Gestionar todas las categorías.",
    to: "/administracion/categorias",
  },
  {
    titulo: "Unidades de medida",
    descripcion: "Administrar las unidades de medida de los productos.",
    to: "/administracion/unidades-medida",
  },
  {
    titulo: "Clientes",
    descripcion: "Administrar la información de los clientes.",
    to: "/administracion/clientes",
  },
];

export default function Administration() {
  return (
    <CrudPage
      titulo="Administración"
      subtitulo="Gestiona la información de tu tienda."
      ruta={trail}
    >
      <div className="admin-grid">
        {MODULOS.map((modulo) => (
          <ItemCard
            key={modulo.to}
            titulo={modulo.titulo}
            descripcion={modulo.descripcion}
          >
            <Link to={modulo.to} className="btn btn-secondary">
              Administrar
            </Link>
          </ItemCard>
        ))}
      </div>
    </CrudPage>
  );
}