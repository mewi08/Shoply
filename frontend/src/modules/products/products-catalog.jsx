import { useId, useState } from "react";
import {
  CardCarousel,
  CrudCard,
  CrudPage,
  ItemCard,
  SearchBar,
} from "../../components/crud";
import { useProducts } from "./use-products";

const trail = [{ label: "Menú", to: "/" }, { label: "Productos" }];

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

function FilterSelect(props) {
  const { label, value, options, onChange } = props;
  const id = useId();

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select id={id} className="form-input" value={value} onChange={onChange}>
        <option value="">Todas</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ProductsCatalog() {
  const [buscar, setBuscar] = useState("");
  const [idmarca, setIdmarca] = useState("");
  const [idcategoria, setIdcategoria] = useState("");
  const [page, setPage] = useState(1);

  const { products, total, totalPages, catalogs, loading, loadError } =
    useProducts({ buscar, idmarca, idcategoria, estado: 1, page });

  const carouselKey = `${page}-${buscar}-${idmarca}-${idcategoria}`;

  const handleSearch = (text) => {
    setBuscar(text);
    setPage(1);
  };

  const changeFilter = (setFilter) => (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  return (
    <CrudPage
      titulo="Productos"
      subtitulo="Consulta el catálogo de tu tienda."
      ruta={trail}
    >
      <SearchBar
        etiqueta="Buscar un producto"
        placeholder="Nombre o código"
        alBuscar={handleSearch}
      />

      <div className="catalog-filters">
        <FilterSelect
          label="Marca"
          value={idmarca}
          options={catalogs.brands}
          onChange={changeFilter(setIdmarca)}
        />
        <FilterSelect
          label="Categoría"
          value={idcategoria}
          options={catalogs.categories}
          onChange={changeFilter(setIdcategoria)}
        />
      </div>

      <CrudCard
        titulo="Catálogo"
        subtitulo="Ordenados por código"
        insignia={loading || loadError ? undefined : `${total} productos`}
        pagina={page}
        totalPaginas={totalPages}
        alCambiarPagina={setPage}
      >
        <CardCarousel key={carouselKey} loading={loading} error={loadError}>
          {products.map((product) => (
            <ItemCard
              key={product.id}
              titulo={product.nombre}
              descripcion={product.presentacion}
              detalles={[
                ["Código", product.codigo],
                ["Precio", soles(product.precio_venta)],
                ["Stock", Number(product.stock)],
              ]}
            />
          ))}
        </CardCarousel>
      </CrudCard>
    </CrudPage>
  );
}
