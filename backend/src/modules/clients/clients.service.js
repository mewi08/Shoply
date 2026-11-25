const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const { checkPersona } = require("../../shared/utils/validators");
const { pick, emptyToNull } = require("../../shared/utils/sanitize");

const personaFields = [
  "nombres", "ape_paterno", "ape_materno", "razon_social",
  "telefono", "correo", "direccion", "tipo_doc", "num_doc",
];

const baseQuery = (idtienda) =>
  db("clientes as c")
    .join("personas as p", "c.idpersona", "p.id")
    .where("c.idtienda", idtienda)
    .select("c.id", "c.estado", ...personaFields.map((f) => `p.${f}`));

exports.list = (idtienda) => baseQuery(idtienda).orderBy("p.ape_paterno");

exports.get = async (id, idtienda) => {
  const row = await baseQuery(idtienda).where("c.id", id).first();
  if (!row) throw httpError(404, "Cliente no encontrado");
  return row;
};

exports.create = async (data, idtienda) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const persona = emptyToNull(pick(data, personaFields));
  checkPersona(persona);

  const found = await db("personas")
    .where({ tipo_doc: persona.tipo_doc, num_doc: persona.num_doc })
    .whereNotIn("id", db("usuarios").select("idpersona"))
    .first("id");

  const idpersona = found ? found.id : (await db("personas").insert(persona))[0];

  const [id] = await db("clientes").insert({ idtienda, idpersona });
  return { id };
};

exports.update = async (id, data, idtienda) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const cleanData = emptyToNull(pick(data, personaFields));
  checkPersona(cleanData);

  const num = await db("personas")
    .whereIn("id", db("clientes").where({ id, idtienda }).select("idpersona"))
    .update(cleanData);
  if (!num) throw httpError(404, "Cliente no encontrado");
};

exports.toggleStatus = async (id, idtienda) => {
  const num = await db("clientes")
    .where({ id, idtienda })
    .update({ estado: db.raw("NOT estado") });
  if (!num) throw httpError(404, "Cliente no encontrado");
};