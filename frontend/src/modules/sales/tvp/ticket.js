import { formatMoney, formatQty, lineTotal, toCents } from "./format.js";

const WIDTH = 36;
const LINE = "-".repeat(WIDTH);

const center = (text) => text.padStart(Math.floor((WIDTH + text.length) / 2)).padEnd(WIDTH);

const row = (left, right) => {
  const space = Math.max(1, WIDTH - left.length - right.length);
  return left + " ".repeat(space) + right;
};

const pad = (n) => String(n).padStart(2, "0");

const formatDate = (date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function buildTicketLines(sale) {
  const lines = [];
  const add = (text, bold = false) => lines.push({ text, bold });

  if (sale.store.nombre) add(center(sale.store.nombre.toUpperCase()), true);
  if (sale.store.ruc) add(center(`RUC ${sale.store.ruc}`));
  if (sale.store.direccion) add(center(sale.store.direccion));
  if (sale.store.telefono) add(center(`Tel. ${sale.store.telefono}`));

  add(LINE);
  add(center("TICKET DE VENTA"), true);
  add(center("No es comprobante de pago"));
  add(center("Sin validez tributaria (SUNAT)"));
  add(LINE);

  add(row("Ticket:", sale.number));
  add(row("Fecha:", formatDate(sale.date)));
  add(`Vendedor: ${sale.seller}`);
  add(`Cliente: ${sale.customer}`);
  add(LINE);

  sale.items.forEach((item) => {
    const name = item.presentation ? `${item.name} ${item.presentation}` : item.name;
    const quantity = formatQty(item.quantity) + (item.fractional ? ` ${item.unit}` : "");

    add(name);
    add(row(`  ${quantity} x ${formatMoney(toCents(item.price))}`, formatMoney(lineTotal(item))));
  });

  // Totales
  add(LINE);
  add(row("TOTAL", formatMoney(sale.total)), true);
  add(row("Pago", sale.methodLabel));

  if (sale.received != null) {
    add(row("Recibido", formatMoney(sale.received)));
    add(row("Vuelto", formatMoney(sale.change)));
  }

  add(LINE);
  add(center("¡Gracias por su compra!"));

  return lines;
}