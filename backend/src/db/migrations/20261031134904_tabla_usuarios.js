/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('usuarios', (t) => {
    t.increments('id').primary();
    t.integer('idpersona').unsigned().notNullable().unique().references('id').inTable('personas').onDelete('RESTRICT');
    t.integer('idtienda').unsigned().references('id').inTable('tiendas').onDelete('RESTRICT');
    t.string('username', 50).notNullable().unique();
    t.string('password', 250).notNullable();
    t.enu('rol', ['admin', 'user', 'superadmin']).notNullable().defaultTo('user');
    t.dateTime('ultimo_acceso');
    t.boolean('estado').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('usuarios');
};
