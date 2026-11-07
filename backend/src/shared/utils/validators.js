const { httpError } = require("./response");

exports.requireFields = (body = {}, fields) => {
  const missing = fields.filter(
    (f) => body[f] == null || String(body[f]).trim() === "",
  );
  if (missing.length)
    throw httpError(400, `Campos obligatorios: ${missing.join(", ")}`);
};

exports.isEmail = (v) =>
  typeof v === "string" &&
  v.length <= 100 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

exports.checkCredentials = (
  { username, password },
  { passwordRequired = false } = {},
) => {
  if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(username || ""))
    throw httpError(400, "Usuario: 3 a 50 caracteres (letras, números, _ . -)");

  if (
    (passwordRequired || password) &&
    (typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72)
  )
    throw httpError(400, "La contraseña debe tener entre 8 y 72 caracteres");
};
