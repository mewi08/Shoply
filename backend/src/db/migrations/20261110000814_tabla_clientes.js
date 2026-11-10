/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable("clientes", (t) => {
    t.increments("id").primary();
    t.integer("idtienda").unsigned().notNullable().references("id").inTable("tiendas").onDelete("RESTRICT");
    t.integer("idpersona").unsigned().notNullable().references("id").inTable("personas").onDelete("RESTRICT");
    t.boolean("estado").notNullable().defaultTo(true);
    t.timestamps(true, true);

    t.unique(["idtienda", "idpersona"]);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTableIfExists("clientes");
};
