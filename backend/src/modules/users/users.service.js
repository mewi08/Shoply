const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const {
  requireFields,
  checkCredentials,
} = require("../../shared/utils/validators");
const { pick } = require("../../shared/utils/sanitize");
const { hashPassword, comparePassword } = require("../../shared/utils/hash");

const ROLES = ["admin", "user"];
const createFields = ["idpersona", "username", "password"];
const updateFields = ["username", "rol"];

const checkRol = (rol) => {
  if (!ROLES.includes(rol)) throw httpError(400, "Rol inválido");
};

const baseQuery = (user) =>
  db("usuarios")
    .where("idtienda", user.idtienda)
    .whereNot("id", user.id)
    .select("id", "username", "rol", "ultimo_acceso", "estado");

exports.list = (user) => baseQuery(user).orderBy("username");

exports.get = async (id, user) => {
  const row = await baseQuery(user).where({ id }).first();
  if (!row) throw httpError(404, "Usuario no encontrado");
  return row;
};

exports.create = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const cleanData = pick(data, createFields);
  requireFields(cleanData, createFields);
  checkCredentials(cleanData, { passwordRequired: true });

  const [id] = await db("usuarios").insert({
    idpersona: cleanData.idpersona,
    idtienda: user.idtienda,
    username: cleanData.username,
    password: hashPassword(cleanData.password),
    rol: "user",
  });

  return { id };
};

exports.update = async (id, data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const cleanData = pick(data, updateFields);
  if (!Object.keys(cleanData).length)
    throw httpError(400, "No hay datos para actualizar");

  checkRol(cleanData.rol);
  if (Number(id) === user.id)
    throw httpError(400, "No puedes cambiar tu propio rol");

  checkCredentials({ username: cleanData.username });

  const num = await db("usuarios")
    .where({ id, idtienda: user.idtienda })
    .update(cleanData);
  if (!num) throw httpError(404, "Usuario no encontrado");
};

exports.toggleStatus = async (id, user) => {
  if (Number(id) === user.id)
    throw httpError(400, "No puedes desactivar tu propio usuario");

  const num = await db("usuarios")
    .where({ id, idtienda: user.idtienda })
    .update({ estado: db.raw("NOT estado") });
  if (!num) throw httpError(404, "Usuario no encontrado");
};

exports.changePassword = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");

  const { password, newPassword } = pick(data, ["password", "newPassword"]);
  checkCredentials(
    { password: newPassword },
    { usernameRequired: false, passwordRequired: true },
  );

  const row = await db("usuarios").where({ id: user.id }).first("password");
  if (!comparePassword(password, row.password))
    throw httpError(400, "Contraseña incorrecta");

  await db("usuarios")
    .where({ id: user.id })
    .update({ password: hashPassword(newPassword) });
};
