/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('ventas').insert([
    { id: 1, idtienda: 1, idvendedor: 2, idcliente: 4, metodo_pago: 'efectivo', estado: 'completada' },
    { id: 2, idtienda: 1, idvendedor: 2, idcliente: null, metodo_pago: 'efectivo', estado: 'completada' },
    { id: 3, idtienda: 1, idvendedor: 1, idcliente: 5, metodo_pago: 'trasferencia', estado: 'completada' },
    { id: 4, idtienda: 1, idvendedor: 2, idcliente: 6, metodo_pago: 'billetera digital', estado: 'completada' },
    { id: 5, idtienda: 2, idvendedor: 3, idcliente: null, metodo_pago: 'efectivo', estado: 'completada' },
    { id: 6, idtienda: 1, idvendedor: 1, idcliente: 8, metodo_pago: 'efectivo', estado: 'anulada' },
    { id: 7, idtienda: 2, idvendedor: 3, idcliente: 7, metodo_pago: 'billetera digital', estado: 'completada' },
    { id: 8, idtienda: 1, idvendedor: 2, idcliente: 4, metodo_pago: 'efectivo', estado: 'completada' },
  ]);
};
