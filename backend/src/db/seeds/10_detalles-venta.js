/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('detalles_venta').insert([
    { id: 1, idventa: 1, idlote: 1, cantidad: 2, precio_unitario: 4.50, descuento: 0 },
    { id: 2, idventa: 1, idlote: 5, cantidad: 1, precio_unitario: 8.50, descuento: 0 },
    { id: 3, idventa: 1, idlote: 8, cantidad: 2.5, precio_unitario: 4.20, descuento: 0 },
    { id: 4, idventa: 2, idlote: 14, cantidad: 10, precio_unitario: 0.30, descuento: 0 },
    { id: 5, idventa: 2, idlote: 11, cantidad: 3, precio_unitario: 1.50, descuento: 0 },
    { id: 6, idventa: 3, idlote: 6, cantidad: 6, precio_unitario: 9.50, descuento: 5 },
    { id: 7, idventa: 3, idlote: 7, cantidad: 4, precio_unitario: 3.80, descuento: 0 },
    { id: 8, idventa: 3, idlote: 9, cantidad: 3.5, precio_unitario: 3.90, descuento: 0 },
    { id: 9, idventa: 4, idlote: 12, cantidad: 12, precio_unitario: 10.90, descuento: 10 },
    { id: 10, idventa: 4, idlote: 3, cantidad: 12, precio_unitario: 8.90, descuento: 0 },
    { id: 11, idventa: 5, idlote: 16, cantidad: 2, precio_unitario: 4.60, descuento: 0 },
    { id: 12, idventa: 5, idlote: 17, cantidad: 1, precio_unitario: 8.70, descuento: 0 },
    { id: 13, idventa: 6, idlote: 10, cantidad: 2, precio_unitario: 5.50, descuento: 0 },
    { id: 14, idventa: 7, idlote: 18, cantidad: 5, precio_unitario: 4.30, descuento: 0 },
    { id: 15, idventa: 7, idlote: 17, cantidad: 2, precio_unitario: 8.70, descuento: 0 },
    { id: 16, idventa: 8, idlote: 2, cantidad: 3, precio_unitario: 4.50, descuento: 0 },
    { id: 17, idventa: 8, idlote: 4, cantidad: 1, precio_unitario: 8.50, descuento: 0 },
  ]);
};
