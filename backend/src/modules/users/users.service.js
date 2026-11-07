const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const { requireFields } = require("../../shared/utils/validators");
const { pick } = require("../../shared/utils/sanitize");

const allowedFields = [];

exports.list = async () => {
  const data = await db('usuarios')
    .select('id', ...allowedFields)
    .orderBy('username');
  return data;
};

exports.get = async (id) => {
    const row = await db('usuarios').where({ id }).first();
    if(!row) throw httpError(404, 'Usuario no encontrado');
    return row;
};

exports.create = async (data) => {
    if(!data) throw httpError(400, 'Datos inválidos');
    const cleanData = pick(data, allowedFields);
    requireFields(cleanData, ['tipo_doc', 'num_doc']);
    const [id] = await db('personas').insert(cleanData);
    return { id };
};

exports.update = async (id, data) => {
    if(!data) throw httpError(400, 'Datos inválidos');
    const cleanData = pick(data, allowedFields);
    requireFields(cleanData, ['tipo_doc', 'num_doc']);
    const num = await db('usuarios').where({ id }).update(cleanData);
    if(!num) throw httpError(404, 'Usuario no encontrado');
};

exports.remove = async (id) => {
    const num = await db('usuarios').where({ id }).del();
    if(!num) throw httpError(404, 'Usuario no encontrado');  
};