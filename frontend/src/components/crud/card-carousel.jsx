import { Children, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert } from "../ui/alert";

export function CardCarousel(props) {
  const { loading = false, error = "", children } = props;

  const items = Children.toArray(children);
  const [index, setIndex] = useState(0);

  if (loading) return <p className="crud-empty" role="status">Cargando…</p>;
  if (error) return <Alert type="error">{error}</Alert>;
  if (items.length === 0) return <p className="crud-empty">No hay registros.</p>;

  const currentIndex  = Math.min(index, items.length - 1);
  const atStart = currentIndex  === 0;
  const atEnd = currentIndex  === items.length - 1;

  return (
    <div className="carousel">
      <ul className="carousel-list">
        {items.map((item, i) => (
          <li
            key={item.key}
            className={`carousel-item ${i === currentIndex  ? "is-active" : ""}`}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="carousel-nav">
        <button
          type="button"
          className="carousel-arrow"
          disabled={atStart}
          onClick={() => setIndex(currentIndex - 1)}
        >
          <ChevronLeft size={22} />
        </button>

        <p className="carousel-count">
          {current + 1} de {items.length}
        </p>

        <button
          type="button"
          className="carousel-arrow"
          disabled={atEnd}
          onClick={() => setIndex(currentIndex + 1)}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}