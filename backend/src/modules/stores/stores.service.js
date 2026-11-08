const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');
const { scoped } = require('../../shared/utils/permissions');

const allowedFields = ['nombre', 'descripcion', 'direccion', 'telefono', 'ruc'];

exports.list = async (user) => {
  const data = await scoped(db('tiendas'), user)
    .select('id', 'nombre', 'direccion', 'telefono', 'estado')
    .orderBy('nombre');
  return data;
};

exports.get = async (id, user) => {
  const row = await scoped(db('tiendas'), user).where({ id }).first();
  if (!row) throw httpError(404, 'Tienda no encontrada');
  return row;
};

exports.create = async (data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['nombre','direccion', 'telefono']);
  const [id] = await db('tiendas').insert(cleanData);
  return { id };
};

exports.update = async (id, data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['nombre','direccion', 'telefono']);
  const num = await db('tiendas').where({ id }).update(cleanData);
  if (!num) throw httpError(404, 'Tienda no encontrada');
};

exports.remove = async (id) => {
  const num = await db('tiendas')
    .where({ id: id })
    .update({ estado: db.raw('NOT estado') });
  if (!num) throw httpError(404, 'Tienda no encontrada');
};
