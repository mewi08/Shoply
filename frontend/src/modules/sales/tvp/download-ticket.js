import { jsPDF } from "jspdf";
import { buildTicketLines } from "./ticket.js";

const TICKET_WIDTH_MM = 80;
const LINE_HEIGHT_MM = 4;
const MARGIN_MM = 4;

export function downloadTicket(sale) {
  const lines = buildTicketLines(sale);
  const pageHeight = MARGIN_MM * 2 + lines.length * LINE_HEIGHT_MM;

  const doc = new jsPDF({
    unit: "mm",
    format: [TICKET_WIDTH_MM, pageHeight],
  });

  doc.setFont("courier", "normal");
  doc.setFontSize(8);

  lines.forEach((line, index) => {
    if (line.bold) doc.setFont("courier", "bold");
    else doc.setFont("courier", "normal");

    const y = MARGIN_MM + (index + 1) * LINE_HEIGHT_MM;
    doc.text(line.text, MARGIN_MM, y);
  });

  doc.save(`${sale.number}.pdf`);
}