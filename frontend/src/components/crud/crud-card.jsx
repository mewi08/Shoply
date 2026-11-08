import { useId } from "react";

export function CrudCard({ config, children }) {
  const { title, subtitle, badge } = config;
  const titleId = useId();

  return (
    <section className="crud-card" aria-labelledby={titleId}>
      <div className="crud-card-head">
        <div>
          <h2 id={titleId} className="crud-card-title">
            {title}
          </h2>
          {subtitle && <p className="crud-card-subtitle">{subtitle}</p>}
        </div>
        {badge && <span className="crud-badge">{badge}</span>}
      </div>
      {children}
    </section>
  );
}