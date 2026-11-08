/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('tiendas', (t) => {
    t.increments('id').primary();
    t.string('nombre', 100).notNullable();
    t.string('descripcion', 200);
    t.string('direccion', 255).notNullable();
    t.string('telefono', 9).notNullable();
    t.string('ruc', 11).unique();
    t.boolean('estado').notNullable().defaultTo(false);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('tiendas');
};
