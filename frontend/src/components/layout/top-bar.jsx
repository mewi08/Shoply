import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function TopBar(props) {
  const { trail=[] } = props;

  return (
    <header className="topbar">
      <nav>
        <ol className="topbar-trail">
          {trail.map((step) => (
            <li key={step.label} className="topbar-step">
              {step.to 
              ? ( <Link to={step.to}>{step.label}</Link> ) 
              : ( <span >{step.label}</span> )
              }
              {step.to && <ChevronRight size={16} />}
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}