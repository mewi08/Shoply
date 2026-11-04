const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');

const allowedFields = ['idtienda', 'idmarca', 'idcategoria', 'idunidadmedida', 'nombre', 'codigo', 'presentacion', 'precio_venta', 'cantidad_minima'];

exports.list = async (idtienda) => {
  const data = await db('productos').select('id', ...allowedFields).where({ idtienda: idtienda});
  return data;
};

exports.get = async (id) => {
  const row = await db('productos').where({ id: id }).first();
  if(!row) throw httpError(404, 'Producto no encontrado');
  return row;
};

exports.create = async (data) => {
  if(!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['idtienda', 'idcategoria', 'idunidadmedida', 'nombre', 'codigo', 'precio_venta', 'cantidad_minima']);
  const [id] = await db('productos').insert(cleanData);
  return { id };
};

exports.update = async (id, data) => {
  if(!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['idtienda', 'idcategoria', 'idunidadmedida', 'nombre', 'codigo', 'precio_venta', 'cantidad_minima']);
  const num = await db('productos').where({ id: id}).update(cleanData);
  if(!num) throw httpError(404, 'Producto no encontrado');
};

exports.remove = async (id) => {
  const row = await this.get(id);
  await db('productos').where({ id: id }).update({ estado: !row.estado});
};