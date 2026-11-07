/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('categorias').insert([
    { id: 1, nombre: 'Lacteos' },
    { id: 2, nombre: 'Bebidas' },
    { id: 3, nombre: 'Abarrotes' },
    { id: 4, nombre: 'Snacks' },
    { id: 5, nombre: 'Limpieza' },
    { id: 6, nombre: 'Aceites' },
    { id: 7, nombre: 'Panaderia' },
  ]);
};
