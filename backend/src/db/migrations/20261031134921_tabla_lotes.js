/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('lotes', (t) => {
    t.increments('id').primary();
    t.integer('idproducto').unsigned().notNullable().references('id').inTable('productos').onDelete('RESTRICT');
    t.decimal('cantidad_inicial', 8, 3).notNullable();
    t.decimal('cantidad_actual', 8, 3).notNullable();
    t.decimal('costo_unitario', 8, 2);
    t.enu('tipo_ingreso', ['compra', 'inicial', 'devolucion', 'ajuste']).notNullable();
    t.date('fecha_caducidad').nullable();
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
 await knex.schema.dropTableIfExists('lotes');
};
