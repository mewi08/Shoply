const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const { checkPersona } = require("../../shared/utils/validators");
const { pick, emptyToNull } = require("../../shared/utils/sanitize");

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

const clean = (data) => emptyToNull(pick(data, allowedFields));

exports.list = async () => {
  const data = await db('personas')
    .select('id', ...allowedFields)
    .orderBy('ape_paterno');
  return data;
};

exports.get = async (id) => {
    const row = await db('personas').where({ id }).first();
    if(!row) throw httpError(404, 'Persona no encontrada');
    return row;
};

exports.create = async (data) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const cleanData = clean(data, allowedFields);
  checkPersona(cleanData);
  const [id] = await db("personas").insert(cleanData);
  return { id };
};

exports.update = async (id, data) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const cleanData = clean(data, allowedFields);
  checkPersona(cleanData);
  const num = await db("personas").where({ id }).update(cleanData);
  if (!num) throw httpError(404, "Persona no encontrada");
};

exports.remove = async (id) => {
    const num = await db('personas').where({ id }).del();
    if(!num) throw httpError(404, 'Persona no encontrada');
};
