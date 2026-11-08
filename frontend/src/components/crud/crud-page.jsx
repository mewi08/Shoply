import { Alert } from "../ui/alert";
import { TopBar } from "../layout/top-bar";

export function CrudPage({
  config,
  navigation,
  feedback,
  action,
  refs,
  children,
}) {
  const { title, subtitle } = config;
  const { trail, greeting } = navigation;
  const { status } = feedback
  const { titleRef } = refs;
  return (
    <div className="crud-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      {trail && <TopBar config={{ trail, greeting }} />}

      <main id="contenido" className="crud-page">
        <header className="crud-header">
          <h1 className="crud-title" ref={titleRef} tabIndex={-1}>
            {title}
          </h1>
          {subtitle && <p className="crud-subtitle">{subtitle}</p>}
        </header>

        {action && <div className="crud-action">{action}</div>}

        <Alert type="success">{status}</Alert>

        {children}
      </main>
    </div>
  );
}
