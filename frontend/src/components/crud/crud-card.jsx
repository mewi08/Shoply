import { ChevronLeft, ChevronRight } from "lucide-react";

export function CrudCard(props) {
  const {
    titulo,
    subtitulo,
    insignia,
    pagina = 1,
    totalPaginas = 1,
    alCambiarPagina,
    children,
  } = props;

  return (
    <section className="crud-card">
      <div className="crud-card-head">
        <div>
          <h2 className="crud-card-title">{titulo}</h2>
          {subtitulo && <p className="crud-card-subtitle">{subtitulo}</p>}
        </div>
        {insignia && <span className="crud-badge">{insignia}</span>}
      </div>

      {children}

      {totalPaginas > 1 && (
        <div className="crud-pagination">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={pagina === 1}
            onClick={() => alCambiarPagina(pagina - 1)}
          >
            <ChevronLeft size={20} />
          </button>

          <span>Página {pagina} de {totalPaginas}</span>

          <button
            type="button"
            className="btn btn-secondary"
            disabled={pagina === totalPaginas}
            onClick={() => alCambiarPagina(pagina + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}