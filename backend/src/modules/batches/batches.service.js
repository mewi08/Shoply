const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');
const serviceProducts = require('../products/products.service');

const allowedFields = [
  'idproducto',
  'cantidad_inicial',
  'cantidad_actual',
  'costo_unitario',
  'tipo_ingreso',
  'fecha_caducidad',
];

const types = ['compra', 'inicial', 'devolucion', 'ajuste'];

exports.list = async (idtienda) => {
  const data = await db('lotes as l')
    .select(
      'l.id',
      'p.nombre',
      'l.cantidad_inicial',
      'l.cantidad_actual',
      'l.costo_unitario',
      'l.fecha_caducidad',
    )
    .join('productos as p', 'p.id', 'l.idproducto')
    .where({ 'p.idtienda': idtienda });
  return data;
};

exports.get = async (id, idtienda) => {
  const row = await db('lotes as l')
    .select(
      'l.id',
      'l.idproducto',
      'p.nombre',
      'l.cantidad_inicial',
      'l.cantidad_actual',
      'l.costo_unitario',
      'l.fecha_caducidad',
    )
    .join('productos as p', 'p.id', 'l.idproducto')
    .where({ 'l.id': id, 'p.idtienda': idtienda })
    .first();
  if (!row) throw httpError(404, 'No encontrado');
  return row;
};

exports.create = async (data, idtienda) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, [
    'idproducto',
    'cantidad_inicial',
    'cantidad_actual',
    'tipo_ingreso',
  ]);

  if (Number(cleanData.cantidad_inicial) <= 0)
    throw httpError(400, 'Cantidad inválida');
  if (Number(cleanData.cantidad_actual) !== Number(cleanData.cantidad_inicial))
    throw httpError(
      400,
      'La cantidad actual debe ser igual a cantidad inicial al crear',
    );
  if (!types.includes(cleanData.tipo_ingreso))
    throw httpError(400, 'Tipo de ingreso inválido');

  await serviceProducts.get(cleanData.idproducto, idtienda);
  const [id] = await db('lotes').insert(cleanData);
  return { id };
};

exports.update = async (id, data, idtienda) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, [
    'idproducto',
    'cantidad_inicial',
    'cantidad_actual',
    'tipo_ingreso',
  ]);

  if (!types.includes(cleanData.tipo_ingreso))
    throw httpError(400, 'Tipo de ingreso inválido');

  const lote = await exports.get(id, idtienda);
  if (
    Number(cleanData.cantidad_actual) !== Number(lote.cantidad_actual) ||
    Number(cleanData.cantidad_inicial) !== Number(lote.cantidad_inicial) ||
    Number(cleanData.idproducto) !== Number(lote.idproducto)
  )
    throw httpError(409, 'No se pudo modificar el registro');

  await db('lotes').where({ id }).update(cleanData);
};

exports.remove = async (id, idtienda) => {
  await exports.get(id, idtienda);
  await db('lotes').where({ id }).del();
};
