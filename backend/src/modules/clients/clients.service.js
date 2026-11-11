const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const { checkPersona } = require("../../shared/utils/validators");
const { pick, emptyToNull } = require("../../shared/utils/sanitize");
const { scoped } = require("../../shared/utils/permissions");

const personaFields = [
  "nombres", "ape_paterno", "ape_materno", "razon_social",
  "telefono", "correo", "direccion", "tipo_doc", "num_doc",
];

const baseQuery = () =>
  db("clientes as c")
    .join("personas as p", "c.idpersona", "p.id")
    .join("tiendas as t", "c.idtienda", "t.id")
    .select(
      "c.id", "c.estado", "t.nombre as tienda",
      ...personaFields.map((f) => `p.${f}`),
    );

exports.list = (user) =>
  scoped(baseQuery(), user).orderBy("p.ape_paterno");

exports.get = async (id, user) => {
  const row = await baseQuery()
    .where({ "c.id": id, "c.idtienda": user.idtienda })
    .first();
  if (!row) throw httpError(404, "Cliente no encontrado");
  return row;
};

exports.create = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const persona = emptyToNull(pick(data, personaFields));
  checkPersona(persona);

  const found = await db("personas")
    .where({ tipo_doc: persona.tipo_doc, num_doc: persona.num_doc })
    .first("id");
  const [idpersona] = found ? [found.id] : await db("personas").insert(persona);

  const [id] = await db("clientes").insert({ idtienda: user.idtienda, idpersona });
  return { id };
};

exports.update = async (id, data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const cleanData = emptyToNull(pick(data, personaFields));
  checkPersona(cleanData);

  const num = await db("personas")
    .whereIn("id", db("clientes").where({ id, idtienda: user.idtienda }).select("idpersona"))
    .update(cleanData);
  if (!num) throw httpError(404, "Cliente no encontrado");
};

exports.toggleStatus = async (id, user) => {
  const num = await db("clientes")
    .where({ id, idtienda: user.idtienda })
    .update({ estado: db.raw("NOT estado") });
  if (!num) throw httpError(404, "Cliente no encontrado");
};