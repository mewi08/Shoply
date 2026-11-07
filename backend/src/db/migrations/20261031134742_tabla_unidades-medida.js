/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('unidades_medida', (t) => {
    t.increments('id').primary();
    t.string('nombre', 20).notNullable().unique();
    t.string('abreviatura', 5).unique();
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('unidades_medida');
};
