import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function TopBar({ config, children }) {
  const { trail = [], greeting } = config;
  return (
    <header className="topbar">
      <nav aria-label="Ruta de navegación">
        <ol className="topbar-trail">
          {trail.map((step, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={step.label} className="topbar-step">
                {isLast || !step.to ? (
                  <span aria-current={isLast ? "page" : undefined}>
                    {step.label}
                  </span>
                ) : (
                  <Link to={step.to}>{step.label}</Link>
                )}
                {!isLast && <ChevronRight aria-hidden="true" size={16} />}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="topbar-side">
        {greeting && <p className="topbar-greeting">{greeting}</p>}
        {children}
      </div>
    </header>
  );
}
