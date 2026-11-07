const db = require('../../../shared/config/db');
const { httpError } = require('../../../shared/utils/response');
const { requireFields } = require('../../../shared/utils/validators');
const { pick } = require('../../../shared/utils/sanitize');

const allowedFields = ['nombre'];

exports.list = async () => {
  const data = await db('marcas').select('id', 'nombre').orderBy('nombre');
  return data;
};

exports.get = async (id) => {
  const row = await db('marcas').where({ id: id }).first();
  if (!row) throw httpError(404, 'Marca no encontrada');
  return row;
};

exports.create = async (data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['nombre']);
  const [id] = await db('marcas').insert(cleanData);
  return { id };
};

exports.update = async (id, data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['nombre']);
  const num = await db('marcas').where({ id }).update(cleanData);
  if (!num) throw httpError(404, 'Marca no encontrada');
};

exports.remove = async (id) => {
  const num = await db('marcas').where({ id: id }).del();
  if (!num) throw httpError(404, 'Marca no encontrada');
};
