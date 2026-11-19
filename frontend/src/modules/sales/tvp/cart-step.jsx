import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog, CrudCard } from "../../../components/crud";
import CartLine from "./cart-line";
import CustomerPicker from "./customer-picker";
import ProductSearch from "./product-search";
import { formatMoney } from "./format.js";

export default function CartStep(props) {
  const {
    items, total, customer, onCustomer, onAdd, onQuantity, onRemove,
    onClear, onScan, onReview, searchProducts,
  } = props;

  const [confirmClear, setConfirmClear] = useState(false);
  const count = `${items.length} ${items.length === 1 ? "producto" : "productos"}`;

  return (
    <div className="tpv-narrow tpv-stack">
      <CustomerPicker customer={customer} onSelect={onCustomer} />

      <ProductSearch onSearch={searchProducts} onAdd={onAdd} onScan={onScan} />

      <aside className="tpv-summary">
        <p className="tpv-summary-total">
          <span>Total</span>
          <strong>{formatMoney(total)}</strong>
        </p>

        <div className="tpv-summary-actions">
          <button type="button" className="btn btn-primary" disabled={items.length === 0} onClick={onReview}>
            Mostrar al cliente
          </button>

          {items.length > 0 && (
            <button type="button" className="btn btn-danger-soft" onClick={() => setConfirmClear(true)}>
              <Trash2 size={20} /> Vaciar venta
            </button>
          )}
        </div>
      </aside>

      <CrudCard titulo="Productos de la venta" insignia={count}>
        {items.length === 0 ? (
          <div className="tpv-empty">
            <p><strong>Aún no hay productos en esta venta.</strong></p>
            <p>Busca por nombre o código, o escanea el producto.</p>
          </div>
        ) : (
          <ul className="tpv-lines">
            {items.map((item) => (
              <CartLine key={item.id} item={item} onQuantity={onQuantity} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </CrudCard>

      <ConfirmDialog
        abierto={confirmClear}
        titulo="¿Vaciar la venta?"
        textoConfirmar="Vaciar"
        tipo="peligro"
        IconoConfirmar={Trash2}
        alConfirmar={() => { onClear(); setConfirmClear(false); }}
        alCancelar={() => setConfirmClear(false)}
      >
        <p>Se quitarán los {count} de esta venta.</p>
      </ConfirmDialog>
    </div>
  );
}