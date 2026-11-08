const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');
const { scoped } = require('../../shared/utils/permissions');

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

exports.list = async (user) => {
  const data = await scoped(db('productos'), user)
    .select('id', ...allowedFields)
    .where({ estado: true }).orderBy('codigo');
  return data;
};

exports.get = async (id, user) => {
  const row = await scoped(db('productos'), user).where({ id }).first();
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

exports.update = async (id, data, user) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);

  if (user.rol !== 'superadmin') {
    cleanData.idtienda = user.idtienda;
  }

  requireFields(cleanData, [
    'idtienda',
    'idcategoria',
    'idunidadmedida',
    'nombre',
    'codigo',
    'precio_venta',
    'cantidad_minima',
  ]);

  const num = await scoped(db('productos'), user).where({ id }).update(cleanData);
  if (!num) throw httpError(404, 'Producto no encontrado');
};

exports.remove = async (id, user) => {
  const num = await scoped(db('productos'), user).where({ id }).update({ estado: db.raw('NOT estado') });
  if (!num) throw httpError(404, 'Producto no encontrado');
};
