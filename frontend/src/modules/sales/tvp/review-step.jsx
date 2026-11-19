import { ArrowLeft, Check } from "lucide-react";
import { customerName, formatMoney, formatQty, lineTotal, toCents } from "./format.js";

export default function ReviewStep(props) {
  const { items, total, customer, onBack, onConfirm } = props;

  return (
    <div className="tpv-narrow tpv-stack">
      <section className="review" aria-label="Resumen de la compra">
        <p className="review-customer">
          Cliente: <strong>{customerName(customer)}</strong>
        </p>

        <ul className="review-lines">
          {items.map((item) => (
            <li key={item.id} className="review-line">
              <div>
                <p className="review-name">
                  {item.name}
                  {item.presentation ? ` ${item.presentation}` : ""}
                </p>
                <p className="review-meta">
                  {formatQty(item.quantity)}
                  {item.fractional ? ` ${item.unit}` : ""} × {formatMoney(toCents(item.price))}
                </p>
              </div>
              <p className="review-amount">{formatMoney(lineTotal(item))}</p>
            </li>
          ))}
        </ul>

        <p className="review-total">
          <span>Total a pagar</span>
          <strong>{formatMoney(total)}</strong>
        </p>
      </section>

      <p className="crud-empty">
        ¿El cliente no está de acuerdo? Regresa para quitar o cambiar productos.
      </p>

      <div className="tpv-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={20} aria-hidden="true" />
          Regresar a productos
        </button>
        <button type="button" className="btn btn-primary" onClick={onConfirm}>
          <Check size={20} aria-hidden="true" />
          Confirmar venta
        </button>
      </div>
    </div>
  );
}
