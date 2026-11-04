const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendError, sendSuccess } = require('../utils/response');
const { config } = require('../config/env');

const unauthorized = (res, msg = 'No autorizado') => {
  return sendError(res, msg, 401);
};

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return unauthorized(res);

  let pyload;

  try {
    pyload = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
  } catch (error) {
    return unauthorized(res, 'Sesión inválida o expirada');
  }

  const user = await db('usuarios').where({ id: pyload.id })
    .select('id', 'username', 'rol', 'estado').first();

  if (!user || !user.estado)
    return unauthorized(res, 'Usuario inactivo o inexistente');

  req.user = user;

  next();
};

exports.requireLevel = (...niveles) => (req, res, next) => {
  niveles.includes(req.user.rol)
    ? next()
    : sendError(res, 'No tienes permiso para esta acción', 403);
};
