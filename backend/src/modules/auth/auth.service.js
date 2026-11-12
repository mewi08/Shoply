const { config } = require('../../shared/config/env');
const { hashPassword, comparePassword } = require('../../shared/utils/hash');
const jwt = require('jsonwebtoken');
const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const {
  requireFields,
  checkCredentials,
  isTelephone,
} = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');
const { checkPersona } = require('../../shared/utils/validators');
const { storeBlock } = require('../../shared/utils/store-status');

const personaFields = [
  'nombres',
  'ape_paterno',
  'ape_materno',
  'razon_social',
  'telefono',
  'correo',
  'direccion',
  'tipo_doc',
  'num_doc',
];
const tiendaFields = ['nombre', 'descripcion', 'direccion', 'telefono', 'ruc'];

exports.login = async (data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  requireFields(data, ['username', 'password']);

  const { username, password } = data;

  if (typeof username != 'string' || typeof password != 'string') {
    throw httpError(400, 'Datos inválidos');
  }

  const user = await db('usuarios as u')
    .leftJoin('tiendas as t', 'u.idtienda', 't.id')
    .where('u.username', username)
    .first('u.*', 't.estado as tienda_estado');

  if (!user || !user.estado) {
    throw httpError(401, 'Usuario o contraseña incorrecto');
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw httpError(401, 'Usuario o contraseña incorrecto');
  }

  const blocked = storeBlock(user.rol, user.tienda_estado);
  if (blocked) throw httpError(403, blocked);

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      rol: user.rol,
      idtienda: user.idtienda,
    },
    config.jwt.secret,
    {
      algorithm: 'HS256',
      expiresIn: config.jwt.expires || '8h',
    },
  );

  await db('usuarios').where({ id: user.id }).update({ ultimo_acceso: db.fn.now() });
  return token;
};

exports.me = async (id) => {
  const user = await db('usuarios as u')
    .join('personas as p', 'p.id', 'u.idpersona')
    .where('u.id', id)
    .select(
      'u.id',
      'u.username',
      'u.rol',
      'u.idtienda',
      'p.nombres',
      'p.ape_paterno',
      'p.ape_materno',
    )
    .first();
  if(!user) throw httpError(401, 'Usuario no encontrado');

  return user;
};

exports.register = async (data) => {
  if (!data) throw httpError(400, 'Datos inválidos');

  const persona = pick(data.persona, personaFields);
  const usuario = pick(data.usuario, ['username', 'password']);
  const tienda = pick(data.tienda, tiendaFields);

  checkPersona(persona);
  checkCredentials(usuario, { passwordRequired: true });
  requireFields(tienda, ['nombre', 'direccion', 'telefono']);
  if (!isTelephone(tienda.telefono))
    throw httpError(400, 'El teléfono debe tener 9 dígitos');

  await db.transaction(async (trx) => {
    const [idpersona] = await trx('personas').insert(persona);
    const [idtienda] = await trx('tiendas').insert(tienda);
    await trx('usuarios').insert({
      username: usuario.username,
      password: hashPassword(usuario.password),
      idpersona,
      idtienda
    });
  });
};
