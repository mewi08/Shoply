const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');

const allowedFields = [
  'idtienda',
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

exports.list = async (idtienda) => {
  const data = await db('productos')
    .select('id', ...allowedFields)
    .where({ idtienda, estado: true })
    .orderBy('codigo');
  return data;
};

exports.get = async (id, idtienda) => {
  const row = await db('productos').where({ id, idtienda }).first();
  if (!row) throw httpError(404, 'Producto no encontrado');
  return row;
};

exports.create = async (data, idtienda) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  cleanData.idtienda = idtienda;
  requireFields(cleanData, [
    'idtienda',
    'idcategoria',
    'idunidadmedida',
    'nombre',
    'codigo',
    'precio_venta',
    'cantidad_minima',
  ]);
  const [id] = await db('productos').insert(cleanData);
  return { id };
};

exports.update = async (id, data, idtienda) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  cleanData.idtienda = idtienda;
  requireFields(cleanData, [
    'idtienda',
    'idcategoria',
    'idunidadmedida',
    'nombre',
    'codigo',
    'precio_venta',
    'cantidad_minima',
  ]);
  const num = await db('productos').where({ id: id }).update(cleanData);
  if (!num) throw httpError(404, 'Producto no encontrado');
};

exports.remove = async (id, idtienda) => {
  const num = await db('productos')
    .where({ id, idtienda })
    .update({ estado: db.raw('NOT estado') });

  if (!num) throw httpError(404, 'Producto no encontrado');
};
