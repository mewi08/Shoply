const { config } = require('../../shared/config/env');
const { comparePassword } = require('../../shared/utils/hash');
const jwt = require('jsonwebtoken');
const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');

exports.login = async (data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  requireFields(data, ['username', 'password']);

  const { username, password } = data;

  if (typeof username != 'string' || typeof password != 'string') {
    throw httpError(400, 'Datos inválidos');
  }

  const user = await db('usuarios').where({ username }).first();

  if (!user || !user.estado) {
    throw httpError(401, 'Usuario o contraseña incorrecto');
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw httpError(401, 'Usuario o contraseña incorrecto');
  }

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
