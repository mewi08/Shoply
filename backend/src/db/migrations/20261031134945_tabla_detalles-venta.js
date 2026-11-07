/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('detalles_venta', (t) => {
    t.increments('id').primary();
    t.integer('idventa').unsigned().notNullable().references('id').inTable('ventas').onDelete('RESTRICT');
    t.integer('idlote').unsigned().notNullable().references('id').inTable('lotes').onDelete('RESTRICT');
    t.decimal('cantidad', 10, 3).notNullable();
    t.decimal('precio_unitario', 7, 2).notNullable();
    t.decimal('descuento', 5, 2).notNullable().defaultTo(0).checkBetween([0,100]);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('detalles_venta');
};
