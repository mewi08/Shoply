/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('marcas').insert([
    { id: 1, nombre: 'Gloria' },
    { id: 2, nombre: 'Laive' },
    { id: 3, nombre: 'Inca Kola' },
    { id: 4, nombre: 'Coca-Cola' },
    { id: 5, nombre: 'Alicorp' },
    { id: 6, nombre: 'Costeno' },
    { id: 7, nombre: 'Field' },
    { id: 8, nombre: 'Nestle' },
    { id: 9, nombre: 'Primor' },
    { id: 10, nombre: 'Sapolio' },
  ]);
};
