import { useId, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar(props) {
  const { etiqueta, placeholder, alBuscar } = props;

  const idInput = useId();
  const [texto, setTexto] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    alBuscar(texto.trim());
  };

  const manejarCambio = (e) => {
    const nuevoTexto = e.target.value;
    setTexto(nuevoTexto);
    if (!nuevoTexto) alBuscar("");
  };

  return (
    <form className="searchbar" role="search" onSubmit={manejarEnvio}>
      <label htmlFor={idInput} className="form-label">{etiqueta}</label>

      <div className="searchbar-row">
        <div className="searchbar-field">
          <Search size={20} className="searchbar-icon" />
          <input
            id={idInput}
            className="form-input searchbar-input"
            type="search"
            placeholder={placeholder}
            value={texto}
            onChange={manejarCambio}
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Buscar
        </button>
      </div>
    </form>
  );
}