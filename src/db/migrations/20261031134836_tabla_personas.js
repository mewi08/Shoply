/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("personas", (t) => {
    t.increments("id").primary();
    t.string("nombres", 100);
    t.string("ape_paterno", 60);
    t.string("ape_materno", 60);
    t.string("razon_social", 150);
    t.string("telefono", 9);
    t.string("correo", 100).unique();
    t.string("direccion", 255);
    t.enu("tipo_doc", ["DNI", "CE", "RUC"]).notNullable();
    t.string("num_doc", 20).notNullable();
    t.timestamps(true, true);

    t.unique(["tipo_doc", "num_doc"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("personas");
};
