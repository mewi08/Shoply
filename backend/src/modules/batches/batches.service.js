const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick, emptyToNull } = require('../../shared/utils/sanitize');
const serviceProducts = require('../products/products.service');

const createFields = [
  'idproducto',
  'cantidad_inicial',
  'costo_unitario',
  'tipo_ingreso',
  'fecha_caducidad',
];
const updateFields = ['costo_unitario', 'fecha_caducidad'];
const types = ['compra', 'inicial', 'devolucion', 'ajuste'];

const baseQuery = (idtienda) =>
  db('lotes as l')
    .join('productos as p', 'p.id', 'l.idproducto')
    .where('p.idtienda', idtienda)
    .select(
      'l.id',
      'l.idproducto',
      'p.nombre',
      'l.cantidad_inicial',
      'l.cantidad_actual',
      'l.costo_unitario',
      'l.tipo_ingreso',
      'l.fecha_caducidad',
    );

const ofStore = (query, idtienda) =>
  query.whereIn('idproducto', db('productos').where({ idtienda }).select('id'));

const checkCost = (cost) => {
  if (cost != null && !(Number(cost) >= 0))
    throw httpError(400, 'Costo inválido');
};

exports.list = (idtienda) => baseQuery(idtienda).orderBy('l.fecha_caducidad');

exports.get = async (id, idtienda) => {
  const row = await baseQuery(idtienda).where('l.id', id).first();
  if (!row) throw httpError(404, 'Lote no encontrado');
  return row;
};

exports.create = async (data, idtienda) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = emptyToNull(pick(data, createFields));
  requireFields(cleanData, ['idproducto', 'cantidad_inicial', 'tipo_ingreso']);

  if (!(Number(cleanData.cantidad_inicial) > 0))
    throw httpError(400, 'Cantidad inválida');
  if (!types.includes(cleanData.tipo_ingreso))
    throw httpError(400, 'Tipo de ingreso inválido');
  checkCost(cleanData.costo_unitario);

  await serviceProducts.get(cleanData.idproducto, idtienda);
  const [id] = await db('lotes').insert({
    ...cleanData,
    cantidad_actual: cleanData.cantidad_inicial,
  });
  return { id };
};

exports.update = async (id, data, idtienda) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = emptyToNull(pick(data, updateFields));
  if (!Object.keys(cleanData).length)
    throw httpError(400, 'No hay datos para actualizar');
  checkCost(cleanData.costo_unitario);

  const num = await ofStore(db('lotes').where({ id }), idtienda).update(cleanData);
  if (!num) throw httpError(404, 'Lote no encontrado');
};

exports.remove = async (id, idtienda) => {
  const num = await ofStore(db('lotes').where({ id }), idtienda).del();
  if (!num) throw httpError(404, 'Lote no encontrado');
};

exports.deductStock = async (trx, { id, cantidad, idtienda }) => {
  if (!(Number(cantidad) > 0)) throw httpError(400, 'Cantidad inválida');
  const lote = await trx('lotes as l')
    .join('productos as p', 'p.id', 'l.idproducto')
    .where({ 'l.id': id, 'p.idtienda': idtienda })
    .forUpdate()
    .first('l.id', 'l.cantidad_actual');

  if (!lote) throw httpError(404, 'Lote no encontrado');
  if (Number(lote.cantidad_actual) < Number(cantidad))
    throw httpError(409, 'Stock insuficiente en el lote');

  await trx('lotes').where({ id }).decrement('cantidad_actual', cantidad);
};

exports.restoreStock = async (trx, { id, cantidad, idtienda }) => {
  if (!(Number(cantidad) > 0)) throw httpError(400, 'Cantidad inválida');
  const lote = await trx('lotes as l')
    .join('productos as p', 'p.id', 'l.idproducto')
    .where({ 'l.id': id, 'p.idtienda': idtienda })
    .forUpdate()
    .first('l.id');

  if (!lote) throw httpError(404, 'Lote no encontrado');
  await trx('lotes').where({ id }).increment('cantidad_actual', cantidad);
};