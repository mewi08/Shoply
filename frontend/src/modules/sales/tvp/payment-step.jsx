import { ArrowLeft, ArrowLeftRight, Banknote, Check, Smartphone } from "lucide-react";
import { Alert } from "../../../components/crud";
import { METHOD_LABELS, formatMoney, parseMoney } from "./format.js";

const METHODS = [
  { value: "efectivo", Icon: Banknote },
  { value: "billetera digital", Icon: Smartphone },
  { value: "transferencia", Icon: ArrowLeftRight },
];

export default function PaymentStep(props) {
  const { total, method, received, onMethod, onReceived, onBack, onFinish, loading, error } = props;

  const isCash = method === "efectivo";
  const receivedCents = parseMoney(received);
  const isEnough = receivedCents >= total;
  const canFinish = !loading && (!isCash || isEnough);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canFinish) onFinish();
  };

  return (
    <form className="tpv-narrow tpv-stack" onSubmit={handleSubmit}>
      <div className="tpv-total-card">
        <span>Total</span>
        <strong>{formatMoney(total)}</strong>
      </div>

      <p><strong>¿Cómo paga el cliente?</strong></p>
      <div className="tpv-methods-grid">
        {METHODS.map(({ value, Icon }) => (
          <button
            key={value}
            type="button"
            className={method === value ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => onMethod(value)}
            disabled={loading}
          >
            <Icon size={20} /> {METHOD_LABELS[value]}
          </button>
        ))}
      </div>

      {isCash && (
        <div className="tpv-stack">
          <div className="form-field">
            <label htmlFor="monto-recibido" className="form-label">Efectivo recibido (S/)</label>
            <input
              id="monto-recibido"
              className="form-input"
              inputMode="decimal"
              placeholder="0.00"
              value={received}
              onChange={(e) => onReceived(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onReceived((total / 100).toFixed(2))}
            disabled={loading}
          >
            Monto exacto
          </button>

          {received.trim() !== "" && !isEnough && (
            <p className="form-error">Falta pagar {formatMoney(total - receivedCents)}.</p>
          )}

          {isEnough && (
            <p className="tpv-change">
              <span>Vuelto para el cliente</span>
              <strong>{formatMoney(receivedCents - total)}</strong>
            </p>
          )}
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}

      <div className="tpv-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={loading}>
          <ArrowLeft size={20} /> Regresar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!canFinish}>
          <Check size={20} /> {loading ? "Procesando…" : "Finalizar venta"}
        </button>
      </div>
    </form>
  );
}