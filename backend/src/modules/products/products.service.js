const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick, emptyToNull } = require('../../shared/utils/sanitize');

const allowedFields = [
  'idmarca',
  'idcategoria',
  'idunidadmedida',
  'nombre',
  'codigo',
  'descripcion',
  'presentacion',
  'precio_venta',
  'cantidad_minima',
];
const required = [
  'idcategoria',
  'idunidadmedida',
  'nombre',
  'codigo',
  'precio_venta',
  'cantidad_minima',
];

const prepare = (data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = emptyToNull(pick(data, allowedFields));
  requireFields(cleanData, required);
  if (!(Number(cleanData.precio_venta) >= 0))
    throw httpError(400, 'Precio inválido');
  if (!(Number(cleanData.cantidad_minima) >= 0))
    throw httpError(400, 'Cantidad mínima inválida');
  return cleanData;
};

exports.list = (idtienda) =>
  db('productos as p')
    .where('p.idtienda', idtienda)
    .select('p.id', 'p.estado', ...allowedFields.map((f) => `p.${f}`))
    .orderBy('p.codigo');

exports.get = async (id, idtienda) => {
  const row = await db('productos').where({ id, idtienda }).first();
  if (!row) throw httpError(404, 'Producto no encontrado');
  return row;
};

exports.create = async (data, idtienda) => {
  const cleanData = prepare(data);
  const [id] = await db('productos').insert({ ...cleanData, idtienda });
  return { id };
};

exports.update = async (id, data, idtienda) => {
  const cleanData = prepare(data);
  const num = await db('productos').where({ id, idtienda }).update(cleanData);
  if (!num) throw httpError(404, 'Producto no encontrado');
};

exports.toggleStatus = async (id, idtienda) => {
  const num = await db('productos')
    .where({ id, idtienda })
    .update({ estado: db.raw('NOT estado') });
  if (!num) throw httpError(404, 'Producto no encontrado');
};
