import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CrudPage } from "../../../components/crud";
import "../../../style/tpv.css";
import CartStep from "./cart-step";
import PaymentStep from "./payment-step";
import ReviewStep from "./review-step";
import ScanStep from "./scan-step";
import TicketStep from "./ticket-step";
import { METHOD_LABELS, customerName, parseMoney } from "./format.js";
import { useTpv } from "./use-tpv";
import { useMyStore } from "../../stores/use-my-store.js";
import * as salesService from "../sales.service";
import * as productsService from "../../products/products.service";

const TRAIL = [{ label: "Menú", to: "/" }, { label: "Punto de venta" }];

const STEPS = {
  scan: { title: "Escanear", subtitle: "Escanea o busca el código del producto." },
  cart: { title: "Venta", subtitle: "Lista de productos" },
  review: { title: "Resumen para el cliente", subtitle: "Confirma la compra." },
  payment: { title: "Cobro", subtitle: "Detalle de venta y forma de pago." },
  ticket: { title: "Venta registrada", subtitle: "Descarga el ticket." },
};

// Busca productos activos en el servidor (máximo 6)
const searchProducts = async (text) => {
  const res = await productsService.list({ buscar: text, estado: 1, limit: 6 });
  return res.data.items;
};

export default function Tpv() {
  const { user } = useOutletContext() ?? {};
  const { store } = useMyStore();
  const { items, total, addProduct, setQuantity, removeProduct, clear } = useTpv();

  const [step, setStep] = useState("scan");
  const [customer, setCustomer] = useState(null);
  const [method, setMethod] = useState("efectivo");
  const [received, setReceived] = useState("");
  const [notice, setNotice] = useState(null);
  const [sale, setSale] = useState(null);
  const [loadingSale, setLoadingSale] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const goTo = (next) => {
    setNotice(null);
    setPaymentError("");
    setStep(next);
  };

  const handleScan = async (code) => {
    const cleanCode = code.trim();

    try {
      const found = await searchProducts(cleanCode);
      const product = found.find((p) => p.codigo === cleanCode);

      if (product) {
        addProduct(product);
        setNotice({ type: "success", text: `${product.nombre} agregado a la venta.` });
      } else {
        setNotice({ type: "error", text: `No se encontró un producto con el código ${cleanCode}.` });
      }
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    }
  };

  const handleFinish = async () => {
    const isCash = method === "efectivo";
    const receivedCents = isCash ? parseMoney(received) : null;

    setLoadingSale(true);
    setPaymentError("");

    try {
      const res = await salesService.create({
        metodo_pago: method,
        idcliente: customer?.id ?? null,
        monto_recibido: isCash ? receivedCents / 100 : undefined,
        items: items.map((item) => ({ idproducto: item.id, cantidad: item.quantity })),
      });

      setSale({
        number: `T-${res.data.id}`,
        date: new Date(),
        store: store ?? {},
        seller: user?.username ?? "Vendedor",
        customer: customerName(customer),
        items,
        total: Math.round(res.data.total * 100),
        methodLabel: METHOD_LABELS[method],
        received: receivedCents,
        change: Math.round(res.data.vuelto * 100),
      });
      goTo("ticket");
    } catch (err) {
      setPaymentError(err.message);
    } finally {
      setLoadingSale(false);
    }
  };

  const handleNewSale = () => {
    clear();
    setCustomer(null);
    setMethod("efectivo");
    setReceived("");
    setSale(null);
    goTo("scan");
  };

  const { title, subtitle } = STEPS[step];

  return (
    <CrudPage titulo={title} subtitulo={subtitle} ruta={TRAIL}>
      {step === "scan" && (
        <ScanStep
          count={items.length}
          notice={notice}
          onScan={handleScan}
          onContinue={() => goTo("cart")}
        />
      )}

      {step === "cart" && (
        <CartStep
          items={items}
          total={total}
          customer={customer}
          onCustomer={setCustomer}
          onAdd={addProduct}
          onQuantity={setQuantity}
          onRemove={removeProduct}
          onClear={clear}
          onScan={() => goTo("scan")}
          onReview={() => goTo("review")}
          searchProducts={searchProducts}
        />
      )}

      {step === "review" && (
        <ReviewStep
          items={items}
          total={total}
          customer={customer}
          onBack={() => goTo("cart")}
          onConfirm={() => goTo("payment")}
        />
      )}

      {step === "payment" && (
        <PaymentStep
          total={total}
          method={method}
          received={received}
          onMethod={setMethod}
          onReceived={setReceived}
          onBack={() => goTo("review")}
          onFinish={handleFinish}
          loading={loadingSale}
          error={paymentError}
        />
      )}

      {step === "ticket" && sale && <TicketStep sale={sale} onNewSale={handleNewSale} />}
    </CrudPage>
  );
}