const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const {
  requireFields,
  checkCredentials,
} = require("../../shared/utils/validators");
const { pick } = require("../../shared/utils/sanitize");
const { hashPassword, comparePassword } = require("../../shared/utils/hash");
const { scoped } = require("../../shared/utils/permissions");

const createFields = ["idpersona", "username", "password", "rol"];
const ROLES = ["admin", "user", "superadmin"];
const isSuper = (user) => user.rol === "superadmin";

const checkRol = (rol, user) => {
  if (!(isSuper(user) ? ROLES : ["user"]).includes(rol))
    throw httpError(400, "Rol inválido");
};

const baseQuery = (user) =>
  scoped(db("usuarios as u"), user)
    .join("personas as p", "u.idpersona", "p.id")
    .select(
      "u.id",
      "u.idpersona",
      "u.idtienda",
      "u.username",
      "u.rol",
      "u.ultimo_acceso",
      "u.estado",
      "p.nombres",
      "p.ape_paterno",
      "p.razon_social",
    );

exports.list = (user) => baseQuery(user).orderBy("u.username");

exports.get = async (id, user) => {
  const row = await baseQuery(user).where("u.id", id).first();
  if (!row) throw httpError(404, "Usuario no encontrado");
  return row;
};

exports.create = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const cleanData = pick(
    data,
    isSuper(user) ? [...createFields, "idtienda"] : createFields,
  );

  requireFields(cleanData, createFields);
  checkCredentials(cleanData, { passwordRequired: true });
  checkRol(cleanData.rol, user);

  if (!isSuper(user)) cleanData.idtienda = user.idtienda;
  else if (cleanData.rol !== "superadmin")
    requireFields(cleanData, ["idtienda"]);

  cleanData.password = hashPassword(cleanData.password);
  const [id] = await db("usuarios").insert(cleanData);
  return { id };
};

exports.update = async (id, data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const { rol } = pick(data, ["rol"]);
  requireFields({ rol }, ["rol"]);
  checkRol(rol, user);
  if (Number(id) === user.id)
    throw httpError(400, "No puedes cambiar tu propio rol");

  const num = await scoped(db("usuarios"), user).where({ id }).update({ rol });
  if (!num) throw httpError(404, "Usuario no encontrado");
};

exports.remove = async (id, user) => {
  if (Number(id) === user.id)
    throw httpError(400, "No puedes desactivar tu propio usuario");

  const num = await scoped(db("usuarios"), user)
    .where({ id })
    .update({ estado: db.raw("NOT estado") });
  if (!num) throw httpError(404, "Usuario no encontrado");
};

exports.updateMe = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const { username } = pick(data, ["username"]);
  checkCredentials({ username });
  await db("usuarios").where({ id: user.id }).update({ username });
};

exports.changePassword = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  const { password, newPassword } = pick(data, ["password", "newPassword"]);
  
  checkCredentials({ password: newPassword }, { usernameRequired: false, passwordRequired: true });

  const row = await db("usuarios").where({ id: user.id }).first("password");
  const valid = comparePassword(password, row.password);
  
  if(!valid) throw httpError(400, "Contraseña incorrecta");
  
  const hash = hashPassword(newPassword);
  await db("usuarios").where({ id: user.id }).update({ password: hash });
};
