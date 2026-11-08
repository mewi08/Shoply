const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const {
  requireFields,
  checkCredentials,
} = require("../../shared/utils/validators");
const { pick } = require("../../shared/utils/sanitize");
const { hashPassword } = require("../../shared/utils/hash");
const { scoped } = require("../../shared/utils/permissions");

const publicFields = [
  "id",
  "idpersona",
  "idtienda",
  "username",
  "rol",
  "ultimo_acceso",
  "estado",
];

const createFields = ["idpersona", "username", "password", "rol"];
const updateFields = ["username", "password", "rol"];

const ROLES = ["admin", "user", "superadmin"];

const checkRol = (rol, user) => {
  const allowed = user.rol === 'superadmin' ? ROLES : ["user"];
  if (!allowed.includes(rol)) throw httpError(400, "Rol inválido");
};

exports.list = async (user) => {
  const data = await scoped(db("usuarios"), user)
    .select(publicFields)
    .orderBy("username");
  return data;
};

exports.get = async (id, user) => {
  const row = await scoped(user).select(publicFields).where({ id }).first();
  if (!row) throw httpError(404, "Usuario no encontrado");
  return row;
};

exports.create = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const fields = isSuper(user) ? [...createFields, "idtienda"] : createFields;
  const cleanData = pick(data, fields);

  requireFields(cleanData, createFields);
  checkCredentials(cleanData, { passwordRequired: true });
  checkRol(cleanData.rol, user);

  if (!isSuper(user)) {
    cleanData.idtienda = user.idtienda;
  } else if (cleanData.rol !== "superadmin") {
    requireFields(cleanData, ["idtienda"]);
  }

  cleanData.password = hashPassword(cleanData.password);

  const [id] = await db("usuarios").insert(cleanData);
  return { id };
};

exports.update = async (id, data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const cleanData = pick(data, updateFields);
  if (!Object.keys(cleanData).length)
    throw httpError(400, "No hay datos para actualizar");

  const current = await scoped(db("usuarios"), user).first();
  if (!current) throw httpError(404, "Usuario no encontrado");

  checkCredentials({
    username: cleanData.username ?? current.username,
    password: cleanData.password,
  });

  if (cleanData.rol) {
    checkRol(cleanData.rol, user);
    if (Number(id) === user.id && cleanData.rol !== current.rol)
      throw httpError(400, "No puedes cambiar tu propio rol");
  }

  if (cleanData.password) cleanData.password = hashPassword(cleanData.password);

  await scoped(db("usuarios"), user).where({ id }).update(cleanData);
};

exports.remove = async (id, user) => {
  if (Number(id) === user.id)
    throw httpError(400, "No puedes desactivar tu propio usuario");

  const num = await scoped(db("usuarios"), user)
    .where({ id })
    .update({ estado: db.raw("NOT estado") });
  if (!num) throw httpError(404, "Usuario no encontrado");
};
