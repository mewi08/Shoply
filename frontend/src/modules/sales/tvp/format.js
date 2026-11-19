export const toCents = (value) => Math.round(Number(value) * 100);
export const formatMoney = (cents) => `S/ ${(cents / 100).toFixed(2)}`;

export const parseMoney = (text) => {
  const clean = String(text).trim().replace(",", ".");
  if (!/^\d+(\.\d{0,2})?$/.test(clean)) return NaN;
  return Math.round(parseFloat(clean) * 100);
};

export const roundQty = (n) => Math.round(n * 1000) / 1000;
export const formatQty = (n) => String(roundQty(n));
export const lineTotal = (item) => Math.round(toCents(item.price) * item.quantity);
export const saleTotal = (items) => items.reduce((sum, item) => sum + lineTotal(item), 0);

export const normalize = (text) =>
  String(text ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export const customerName = (person) => {
  if (!person) return "Público general";
  return (
    person.razon_social ||
    [person.nombres, person.ape_paterno, person.ape_materno].filter(Boolean).join(" ") ||
    `${person.tipo_doc} ${person.num_doc}`
  );
};

export const FRACTIONAL_UNITS = ["kg", "g", "l", "ml"];

export const METHOD_LABELS = {
  efectivo: "Efectivo",
  "billetera digital": "billetera digital",
  transferencia: "Transferencia",
};