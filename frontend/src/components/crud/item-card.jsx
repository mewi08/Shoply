export function ItemCard(props) {
  const { titulo, descripcion, detalles = [], children } = props;

  return (
    <article className="item-card">
      <div className="item-card-main">
        <h3 className="item-card-title">{titulo}</h3>
        {descripcion && <p className="item-card-description">{descripcion}</p>}
      </div>

      {detalles.length > 0 && (
        <dl className="item-card-details">
          {detalles.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className="item-card-actions">{children}</div>}
    </article>
  );
}