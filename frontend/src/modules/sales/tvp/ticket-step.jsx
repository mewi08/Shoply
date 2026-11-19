import { CircleCheck, Download, Plus } from "lucide-react";
import { formatMoney } from "./format.js";
import { buildTicketLines } from "./ticket.js";
import { downloadTicket } from "./download-ticket.js";

export default function TicketStep(props) {
  const { sale, onNewSale } = props;

  const lines = buildTicketLines(sale);

  return (
    <div className="tpv-narrow tpv-stack">
      <p className="ticket-done">
        <CircleCheck size={28} aria-hidden="true" />
        <span>
          Total cobrado: <strong>{formatMoney(sale.total)}</strong>
          {sale.received != null && sale.change > 0 && (
            <> · Vuelto: <strong>{formatMoney(sale.change)}</strong></>
          )}
        </span>
      </p>

      <div className="ticket-preview" role="region" aria-label="Vista previa del ticket" tabIndex={0}>
        {lines.map((line, i) => (
          <div key={i} className={line.bold ? "ticket-line is-bold" : "ticket-line"}>
            {line.text || " "}
          </div>
        ))}
      </div>

      <div className="tpv-actions">
        <button type="button" className="btn btn-primary" onClick={() => downloadTicket(sale)}>
          <Download size={20} aria-hidden="true" />
          Descargar ticket
        </button>
        <button type="button" className="btn btn-secondary" onClick={onNewSale}>
          <Plus size={20} aria-hidden="true" />
          Nueva venta
        </button>
      </div>
    </div>
  );
}