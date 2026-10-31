/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('usuarios').insert([
    { id: 1, idpersona: 1, idtienda: 1, username: 'admin', password: '?admin*123*', rol: 'admin' },
    { id: 2, idpersona: 2, idtienda: 1, username: 'maria', password: 'maria1?', rol: 'user' },
    { id: 3, idpersona: 3, idtienda: 2, username: 'jose', password: 'pass12**', rol: 'user' },
  ]);
};
