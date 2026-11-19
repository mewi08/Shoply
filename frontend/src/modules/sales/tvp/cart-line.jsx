import { Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney, lineTotal, roundQty, toCents } from "./format.js";

export default function CartLine(props) {
  const { item, onQuantity, onRemove } = props;

  const step = item.fractional ? 0.1 : 1;
  const changeBy = (amount) => onQuantity(item.id, Math.max(1, roundQty(item.quantity + amount)));
  const typeQuantity = (e) => {
    const value = Number(e.target.value);
    if (value > 0) onQuantity(item.id, value);
  };

  return (
    <li className="tpv-line">
      <div className="tpv-line-info">
        <p className="tpv-line-name">{item.name}</p>
        <p className="tpv-line-meta">
          {item.presentation ? `${item.presentation} · ` : ""}
          {formatMoney(toCents(item.price))}
          {item.fractional ? ` por ${item.unit}` : ""}
        </p>
      </div>

      <div className="tpv-qty">
        <button type="button" className="tpv-icon-btn" onClick={() => changeBy(-step)}>
          <Minus size={18} />
        </button>
        <input
          type="number"
          className="form-input tpv-qty-input"
          value={item.quantity}
          step={step}
          min={step}
          onChange={typeQuantity}
        />
        <button type="button" className="tpv-icon-btn" onClick={() => changeBy(step)}>
          <Plus size={18} />
        </button>
      </div>

      <p className="tpv-line-total">{formatMoney(lineTotal(item))}</p>

      <button
        type="button"
        className="tpv-icon-btn tpv-line-remove"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
}