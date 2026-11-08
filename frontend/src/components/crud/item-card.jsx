import { Pencil, Trash2 } from "lucide-react";

export function ItemCard({ config, actions }) {
  const { title, description, meta } = config;
  const { onEdit, onDelete } = actions;

  return (
    <article className="item-card">
      <div className="item-card-main">
        <span className="item-card-avatar" aria-hidden="true">
          {title.charAt(0).toUpperCase()}
        </span>
        <div>
          <h3 className="item-card-title">{title}</h3>
          {description && <p className="item-card-description">{description}</p>}
        </div>
      </div>

      {meta && <p className="item-card-meta">{meta}</p>}

      {(onEdit || onDelete) && (
        <div className="item-card-actions">
          {onEdit && (
            <button
              type="button"
              className="btn btn-secondary"
              aria-label={`Editar ${title}`}
              onClick={onEdit}
            >
              <Pencil aria-hidden="true" size={18} />
              Editar
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-danger-soft"
              aria-label={`Eliminar ${title}`}
              onClick={onDelete}
            >
              <Trash2 aria-hidden="true" size={18} />
              Eliminar
            </button>
          )}
        </div>
      )}
    </article>
  );
}