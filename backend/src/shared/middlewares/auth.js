const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendError } = require('../utils/response');
const { storeBlock } = require('../utils/store-status');
const { config } = require('../config/env');

const unauthorized = (res, msg = 'No autorizado') => {
  return sendError(res, msg, 401);
};

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return unauthorized(res);

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
  } catch {
    return unauthorized(res, 'Sesión inválida o expirada');
  }

  const row = await db('usuarios as u')
    .leftJoin('tiendas as t', 'u.idtienda', 't.id')
    .where('u.id', payload.id)
    .first('u.id', 'u.username', 'u.rol', 'u.estado', 'u.idtienda', 't.estado as tienda_estado');

  if (!row || !row.estado)
    return unauthorized(res, 'Usuario inactivo o inexistente');

  const { tienda_estado, ...user } = row;

  const blocked = storeBlock(user.rol, tienda_estado);
  if (blocked) return sendError(res, blocked, 403);

  req.user = user;

  next();
};

exports.requireLevel = (...niveles) => (req, res, next) => {
  niveles.includes(req.user.rol)
    ? next()
    : sendError(res, 'No tienes permiso para esta acción', 403);
};
