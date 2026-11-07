/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { hashPassword } = require('../../shared/utils/hash');

exports.seed = async function(knex) {
  await knex('usuarios').insert([
    { id: 1, idpersona: 1, idtienda: 1, username: 'admin', password: hashPassword('?admin*123*'), rol: 'admin' },
    { id: 2, idpersona: 2, idtienda: 1, username: 'maria', password: hashPassword('maria1?'), rol: 'user' },
    { id: 3, idpersona: 3, idtienda: 2, username: 'jose', password: hashPassword('pass12**'), rol: 'user' },
  ]);
};
