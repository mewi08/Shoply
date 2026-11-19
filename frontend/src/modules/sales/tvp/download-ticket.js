import { buildTicketLines } from "./ticket.js";

export function downloadTicket(sale) {
  const text = buildTicketLines(sale).map((line) => line.text).join("\n");
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${sale.number}.txt`;
  link.click();

  URL.revokeObjectURL(url);
}