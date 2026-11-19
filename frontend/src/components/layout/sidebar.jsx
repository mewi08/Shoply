import { NavLink } from "react-router-dom";
import '../../style/sidebar.css';

const SECCIONES = [
  {
    title: "Operaciones",
    items: [
      { to: "/tiendas", label: "Tiendas", roles: ["superadmin"] },
      { to: "/catalogo-productos", label: "Productos", roles: ["admin", "user"] },
      { to: "/ventas", label: "Ventas", roles: ["admin", "user"] },
      { to: "/tpv", label: "Punto de venta", roles: ["admin", "user"] },
    ],
  },
  {
    title: "Gestión",
    items: [
      { to: "/reportes", label: "Reportes", roles:["admin"]},
      { to: "/administracion", label: "Administración", roles: ["superadmin", "admin"] },
    ],
  },
];

export function Sidebar(props) {
  const { user, onLogout } = props;

  const seccionesVisibles = SECCIONES.map((seccion) => ({
    ...seccion,
    items: seccion.items.filter(
      (item) => item.roles?.includes(user.rol) ?? true
    )
  })).filter((seccion) => seccion.items.length);

  return (
    <aside className="sidebar">
      <p className="sidebar-brand">Shoply</p>

      <nav>
        {seccionesVisibles.map((seccion) => (
          <div key={seccion.title}>
            <p className="sidebar-title">{seccion.title}</p>

            <ul className="sidebar-list">
              {seccion.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="sidebar-link">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <button type="button" className="sidebar-link sidebar-logout" onClick={onLogout }>
        Cerrar sesión
      </button>
    </aside>
  );
}