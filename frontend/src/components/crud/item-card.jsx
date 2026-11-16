export function ItemCard(props) {
  const { titulo, descripcion, detalle , children } = props
  return (
    <article className="item-card">
      <div className="item-card-main">
        <h3 className="item-card-title">{titulo}</h3>

        {descripcion && (
          <p className="item-card-description">{descripcion}</p>
        )}
      </div>

      {detalle && <p className="item-card-meta">{detalle}</p>}

      {children && (
        <div className="item-card-actions">
          {children}
        </div>
      )}
    </article>
  );
}