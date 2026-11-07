/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('tiendas').insert([
    { id: 1, nombre: 'Bodega Don Lucho', descripcion: 'Bodega de barrio', direccion: 'Av. Los Olivos 123, Lima', telefono: '987654321', ruc: '20123456789' },
    { id: 2, nombre: 'Minimarket La Esquina', descripcion: 'Minimarket 24 horas', direccion: 'Jr. Las Flores 456, Lima', telefono: '912345678', ruc: '20987654321' },
  ]);
};
