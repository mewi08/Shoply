/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('clientes').insert([
    {id: 1, idtienda: '1', idpersona: '3',},
    {id: 2, idtienda: '1', idpersona: '4',},
    {id: 3, idtienda: '2', idpersona: '1',}
  ]);
};
