import { Children, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert } from "../ui/alert";

export function CardCarousel({ config, state, children }) {
  const { label } = config;
  const { loading = false, error = "" } = state;
  const items = Children.toArray(children);
  const [index, setIndex] = useState(0);

  if (loading)
    return (
      <p className="crud-empty" role="status">
        Cargando…
      </p>
    );
  if (error) return <Alert type="error">{error}</Alert>;
  if (items.length === 0) return <p className="crud-empty">No hay registros.</p>;

  const current = Math.min(index, items.length - 1);
  const atStart = current === 0;
  const atEnd = current === items.length - 1;
  const name = items[current].props?.title;

  const go = (step) => {
    const next = current + step;
    if (next >= 0 && next < items.length) setIndex(next);
  };

  return (
    <div className="carousel">
      <ul className="carousel-list" aria-label={label}>
        {items.map((item, i) => (
          <li
            key={item.key}
            className={i === current ? "carousel-item is-active" : "carousel-item"}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="carousel-nav">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Anterior"
          aria-disabled={atStart}
          onClick={() => go(-1)}
        >
          <ChevronLeft aria-hidden="true" size={22} />
        </button>

        <p className="carousel-count" aria-live="polite" aria-atomic="true">
          {current + 1} de {items.length}
          {name && <span className="crud-sr-only">: {name}</span>}
        </p>

        <button
          type="button"
          className="carousel-arrow"
          aria-label="Siguiente"
          aria-disabled={atEnd}
          onClick={() => go(1)}
        >
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>
    </div>
  );
}