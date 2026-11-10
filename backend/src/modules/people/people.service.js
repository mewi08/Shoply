const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const { requireFields, isEmail, checkDocument, isTelephone } = require("../../shared/utils/validators");
const { pick } = require("../../shared/utils/sanitize");
const { scoped } = require("../../shared/utils/permissions");

const allowedFields = [
  "nombres",
  "ape_paterno",
  "ape_materno",
  "razon_social",
  "telefono",
  "correo",
  "direccion",
  "tipo_doc",
  "num_doc",
];

const validate = (p) => {
  checkDocument(p);
  if (p.tipo_doc === "RUC") requireFields(p, ["razon_social"]);
  else requireFields(p, ["nombres", "ape_paterno"]);

  if (p.correo && !isEmail(p.correo)) throw httpError(400, "Correo inválido");

  if (p.telefono && !isTelephone(p.telefono))
    throw httpError(400, "El teléfono debe tener 9 dígitos");
};

const clean = (data) => {
  const out = pick(data, allowedFields);
  for (const k in out) if (out[k] === "") out[k] = null;
  return out;
};

exports.list = async () => {
  const data = await db('personas')
    .select('id', ...allowedFields)
    .orderBy('ape_paterno');
  return data;
};

exports.listByStore = async (user) => {
  const data = await scoped(db('ventas as v'), user)
    .distinct('p.id', ...allowedFields.map((field) => `p.${field}`))
    .join('personas as p', 'v.idcliente', 'p.id')
    .orderBy('p.ape_paterno');

  return data;
};

exports.get = async (id) => {
    const row = await db('personas').where({ id }).first();
    if(!row) throw httpError(404, 'Persona no encontrada');
    return row;
};

exports.create = async (data) => {
    if(!data) throw httpError(400, 'Datos inválidos');
    const cleanData = clean(allowedFields);
    validate(cleanData);
    const [id] = await db('personas').insert(cleanData);
    return { id };
};

exports.update = async (id, data) => {
    if(!data) throw httpError(400, 'Datos inválidos');
    const cleanData = clean(allowedFields);
    validate(cleanData);
    const num = await db('personas').where({ id }).update(cleanData);
    if(!num) throw httpError(404, 'Persona no encontrada');
};

exports.remove = async (id) => {
    const num = await db('personas').where({ id }).del();
    if(!num) throw httpError(404, 'Persona no encontrada');
};