/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    const tablas = [
    'detalles_venta', 'ventas', 'lotes', 'productos', 'usuarios',
    'personas', 'categorias', 'marcas', 'unidades_medida', 'tiendas',
  ];

  for (const tabla of tablas){
    await knex(tabla).del();
  }
};
