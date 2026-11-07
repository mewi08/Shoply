/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('ventas', (t) => {
    t.increments('id').primary();
    t.integer('idtienda').unsigned().notNullable().references('id').inTable('tiendas').onDelete('RESTRICT');
    t.integer('idvendedor').unsigned().notNullable().references('id').inTable('usuarios').onDelete('RESTRICT');
    t.integer('idcliente').unsigned().references('id').inTable('personas').onDelete('RESTRICT');
    t.enu('metodo_pago', ['efectivo', 'transferencia', 'billetera digital']).notNullable().defaultTo('efectivo');
    t.enu('estado', ['completada', 'anulada']).notNullable().defaultTo('completada');
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
   await knex.schema.dropTableIfExists('ventas');
};
