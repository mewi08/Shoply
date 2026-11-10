const db = require('../../shared/config/db');
const { httpError } = require('../../shared/utils/response');
const { requireFields } = require('../../shared/utils/validators');
const { pick } = require('../../shared/utils/sanitize');

const allowedFields = ['nombre', 'descripcion', 'direccion', 'telefono', 'ruc'];
const baseQuery = () => db("tiendas").select('id', ...allowedFields, "estado");

const setEstado = async (id, from, to, trx = db) => {
  const num = await trx("tiendas").where({ id }).whereIn("estado", from).update({ estado: to });
  if (!num) throw httpError(404, "Tienda no encontrada o estado no válido");
};

exports.approve = (id) =>
  db.transaction(async (trx) => {
    await setEstado(id, ["pendiente"], "activa", trx);
    await trx("usuarios").where({ idtienda: id , rol: "user" }).update({ rol: "admin" });
  });

exports.reject = (id) => 
  setEstado(id, ["pendiente"], "rechazada");

exports.deactivate = (id) => 
  setEstado(id, ["activa"], "inactiva");

exports.reactivate = (id) => 
  setEstado(id, ["inactiva"], "activa");

exports.list = async () => {
  const data = await baseQuery().orderBy('nombre');
  return data;
};

exports.get = async (id) => {
  const row = await baseQuery().where({ id }).first();
  if (!row) throw httpError(404, 'Tienda no encontrada');
  return row;
};

exports.update = async (id, data) => {
  if (!data) throw httpError(400, 'Datos inválidos');
  const cleanData = pick(data, allowedFields);
  requireFields(cleanData, ['nombre','direccion', 'telefono']);
  const num = await db('tiendas').where({ id }).update(cleanData);
  if (!num) throw httpError(404, 'Tienda no encontrada');
};
