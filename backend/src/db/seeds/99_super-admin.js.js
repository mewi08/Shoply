/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */

const { config } = require('../../shared/config/env');
const { hashPassword } = require('../../shared/utils/hash');

exports.seed = async function (knex) {
  const { username, password, names, apePaterno, tipoDoc, numDoc } =
    config.superadmin;

  const existe = await knex('usuarios').where({ username }).first();
  if (existe) return;

  const persona = await knex('personas')
    .where({ tipo_doc: tipoDoc, num_doc: numDoc })
    .first();

  const idpersona = await knex('personas').insert({
    nombres: names,
    ape_paterno: apePaterno,
    tipo_doc: tipoDoc,
    num_doc: numDoc,
  });

  await knex('usuarios').insert({
    idpersona,
    idtienda: null,
    username: username,
    password: hashPassword(password),
    rol: 'superadmin',
  });
};
