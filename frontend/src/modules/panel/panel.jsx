import { CrudPage } from "../../components/crud";

const trail = [{ label: "Menú"}];

export default function Panel() {
  return (
    <CrudPage
      titulo="Inicio"
      subtitulo="Bienvenido a Shoply."
      ruta={trail}
    >
      {}
    </CrudPage>
  );
}