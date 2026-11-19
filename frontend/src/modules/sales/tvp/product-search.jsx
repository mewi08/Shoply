import { useState } from "react";
import { QrCode, Search } from "lucide-react";
import { Alert } from "../../../components/crud";
import { formatMoney, toCents } from "./format.js";

export default function ProductSearch(props) {
  const { onSearch, onAdd, onScan } = props;

  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;

    setError("");
    try {
      setResults(await onSearch(clean));
      setSearched(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const add = (product) => {
    onAdd(product);
    setText("");
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="tpv-search">
      <form className="tpv-search-form" onSubmit={handleSubmit}>
        <input
          type="search"
          className="form-input"
          placeholder="Nombre o código del producto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-secondary">
          <Search size={20} /> Buscar
        </button>
      </form>

      <button type="button" className="btn btn-secondary btn-block" onClick={onScan}>
        <QrCode size={20} /> Escanear código
      </button>

      {error && <Alert type="error">{error}</Alert>}

      {searched && results.length === 0 && (
        <p className="crud-empty">No hay productos con ese nombre o código.</p>
      )}

      {results.length > 0 && (
        <ul className="tpv-results">
          {results.map((product) => (
            <li key={product.id}>
              <button type="button" className="tpv-result" onClick={() => add(product)}>
                <span className="tpv-result-info">
                  <span className="tpv-result-name">{product.nombre}</span>
                  <span className="tpv-result-meta">
                    {product.presentacion ? `${product.presentacion} · ` : ""}
                    {product.codigo}
                  </span>
                </span>
                <span className="tpv-result-price">
                  {formatMoney(toCents(product.precio_venta))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}