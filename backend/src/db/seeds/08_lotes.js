/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('lotes').insert([
    { id: 1, idproducto: 1, cantidad_inicial: 48, cantidad_actual: 46, costo_unitario: 3.60, tipo_ingreso: 'inicial', fecha_caducidad: '2027-06-30' },
    { id: 2, idproducto: 1, cantidad_inicial: 60, cantidad_actual: 57, costo_unitario: 3.70, tipo_ingreso: 'compra', fecha_caducidad: '2027-09-15' },
    { id: 3, idproducto: 2, cantidad_inicial: 16, cantidad_actual: 4, costo_unitario: 6.80, tipo_ingreso: 'compra', fecha_caducidad: '2026-12-10' },
    { id: 4, idproducto: 3, cantidad_inicial: 20, cantidad_actual: 19, costo_unitario: 5.50, tipo_ingreso: 'compra', fecha_caducidad: '2027-03-20' },
    { id: 5, idproducto: 4, cantidad_inicial: 36, cantidad_actual: 35, costo_unitario: 6.50, tipo_ingreso: 'inicial', fecha_caducidad: '2027-05-01' },
    { id: 6, idproducto: 5, cantidad_inicial: 48, cantidad_actual: 42, costo_unitario: 7.20, tipo_ingreso: 'compra', fecha_caducidad: '2027-04-18' },
    { id: 7, idproducto: 6, cantidad_inicial: 14, cantidad_actual: 10, costo_unitario: 2.90, tipo_ingreso: 'compra', fecha_caducidad: '2027-08-01' },
    { id: 8, idproducto: 7, cantidad_inicial: 100, cantidad_actual: 97.5, costo_unitario: 3.40, tipo_ingreso: 'inicial', fecha_caducidad: null },
    { id: 9, idproducto: 8, cantidad_inicial: 80, cantidad_actual: 76.5, costo_unitario: 3.10, tipo_ingreso: 'compra', fecha_caducidad: null },
    { id: 10, idproducto: 9, cantidad_inicial: 36, cantidad_actual: 36, costo_unitario: 4.20, tipo_ingreso: 'compra', fecha_caducidad: '2028-01-15' },
    { id: 11, idproducto: 10, cantidad_inicial: 100, cantidad_actual: 97, costo_unitario: 1.00, tipo_ingreso: 'compra', fecha_caducidad: '2027-02-28' },
    { id: 12, idproducto: 11, cantidad_inicial: 24, cantidad_actual: 12, costo_unitario: 8.80, tipo_ingreso: 'compra', fecha_caducidad: '2027-10-10' },
    { id: 13, idproducto: 12, cantidad_inicial: 30, cantidad_actual: 30, costo_unitario: 3.50, tipo_ingreso: 'compra', fecha_caducidad: null },
    { id: 14, idproducto: 13, cantidad_inicial: 200, cantidad_actual: 190, costo_unitario: 0.18, tipo_ingreso: 'inicial', fecha_caducidad: '2026-11-02' },
    { id: 15, idproducto: 14, cantidad_inicial: 10, cantidad_actual: 10, costo_unitario: 14.50, tipo_ingreso: 'compra', fecha_caducidad: '2026-11-20' },
    { id: 16, idproducto: 15, cantidad_inicial: 48, cantidad_actual: 46, costo_unitario: 3.70, tipo_ingreso: 'compra', fecha_caducidad: '2027-06-30' },
    { id: 17, idproducto: 16, cantidad_inicial: 36, cantidad_actual: 33, costo_unitario: 6.70, tipo_ingreso: 'compra', fecha_caducidad: '2027-05-01' },
    { id: 18, idproducto: 17, cantidad_inicial: 100, cantidad_actual: 95, costo_unitario: 3.50, tipo_ingreso: 'compra', fecha_caducidad: null },
    { id: 19, idproducto: 4, cantidad_inicial: 6, cantidad_actual: 6, costo_unitario: 6.50, tipo_ingreso: 'devolucion', fecha_caducidad: '2027-05-01' },
    { id: 20, idproducto: 1, cantidad_inicial: 5, cantidad_actual: 5, costo_unitario: null, tipo_ingreso: 'ajuste', fecha_caducidad: '2027-06-30' },
  ]);
};
