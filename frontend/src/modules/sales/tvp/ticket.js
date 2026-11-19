import { formatMoney, formatQty, lineTotal, toCents } from "./format.js";

export const TICKET_COLS = 36;

const SEPARATOR = "-".repeat(TICKET_COLS);

const wrap = (text, width = TICKET_COLS) => {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (let word of words) {
    while (word.length > width) {
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(word.slice(0, width));
      word = word.slice(width);
    }

    if (!current) current = word;
    else if (current.length + 1 + word.length <= width) current += ` ${word}`;
    else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
};

const center = (text) =>
  " ".repeat(Math.max(0, Math.floor((TICKET_COLS - text.length) / 2))) + text;

const sides = (left, right) =>
  left.slice(0, Math.max(0, TICKET_COLS - right.length - 1)).padEnd(TICKET_COLS - right.length) +
  right;

const pad = (n) => String(n).padStart(2, "0");

export const formatDateTime = (date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function buildTicketLines(sale) {
  const lines = [];
  const add = (text, bold = false) => lines.push({ text, bold });
  const addCentered = (text, bold = false) =>
    wrap(text).forEach((line) => add(center(line), bold));
  const addWrapped = (text) => wrap(text).forEach((line) => add(line));

  if (sale.store.nombre) addCentered(sale.store.nombre.toUpperCase(), true);
  if (sale.store.ruc) addCentered(`RUC ${sale.store.ruc}`);
  if (sale.store.direccion) addCentered(sale.store.direccion);
  if (sale.store.telefono) addCentered(`Tel. ${sale.store.telefono}`);

  add(SEPARATOR);
  addCentered("TICKET DE VENTA", true);
  addCentered("No es comprobante de pago");
  addCentered("Sin validez tributaria (SUNAT)");
  add(SEPARATOR);

  add(sides("Ticket:", sale.number));
  add(sides("Fecha:", formatDateTime(sale.date)));
  addWrapped(`Vendedor: ${sale.seller}`);
  addWrapped(`Cliente: ${sale.customer}`);
  add(SEPARATOR);

  sale.items.forEach((item) => {
    const name = item.presentation ? `${item.name} ${item.presentation}` : item.name;
    addWrapped(name);

    const quantity = formatQty(item.quantity) + (item.fractional ? ` ${item.unit}` : "");
    add(sides(`  ${quantity} x ${formatMoney(toCents(item.price))}`, formatMoney(lineTotal(item))));
  });

  add(SEPARATOR);
  add(sides("TOTAL", formatMoney(sale.total)), true);
  add(sides("Pago", sale.methodLabel));

  if (sale.received != null) {
    add(sides("Recibido", formatMoney(sale.received)));
    add(sides("Vuelto", formatMoney(sale.change)));
  }

  add(SEPARATOR);
  addCentered("¡Gracias por su compra!");

  return lines;
}