/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('productos', (t) => {
    t.increments('id');
    t.integer('idtienda').unsigned().notNullable().references('id').inTable('tiendas').onDelete('RESTRICT');
    t.integer('idmarca').unsigned().references('id').inTable('marcas').onDelete('RESTRICT');
    t.integer('idcategoria').unsigned().notNullable().references('id').inTable('categorias').onDelete('RESTRICT');
    t.integer('idunidadmedida').unsigned().notNullable().references('id').inTable('unidades_medida').onDelete('RESTRICT');
    t.string('nombre', 120).notNullable();
    t.string('codigo', 8).notNullable();
    t.string('descripcion', 200);
    t.string('presentacion', 20);
    t.decimal('precio_venta', 7, 2).notNullable();
    t.decimal('cantidad_minima', 6, 3).notNullable().defaultTo(0);
    t.boolean('estado').notNullable().defaultTo(true);
    t.timestamps(true, true);

    t.unique(['idtienda', 'codigo']);
    t.unique(['idtienda', 'nombre', 'idmarca', 'presentacion']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('productos');
};