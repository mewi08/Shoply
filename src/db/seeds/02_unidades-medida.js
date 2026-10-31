/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('unidades_medida').insert([
    { id: 1, nombre: 'Unidad', abreviatura: 'und' },
    { id: 2, nombre: 'Kilogramo', abreviatura: 'kg' },
    { id: 3, nombre: 'Gramo', abreviatura: 'g' },
    { id: 4, nombre: 'Litro', abreviatura: 'l' },
    { id: 5, nombre: 'Mililitro', abreviatura: 'ml' },
    { id: 6, nombre: 'Paquete', abreviatura: 'paq' },
  ]);
};
