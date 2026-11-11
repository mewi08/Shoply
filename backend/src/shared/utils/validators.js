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

exports.isTelephone = (v) =>
  typeof v === "string" && /^\d{9}$/.test(v);

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

const DOC_REGEX = {
  DNI: /^\d{8}$/,
  CE: /^[A-Za-z0-9]{9,12}$/,
  RUC: /^\d{11}$/,
};

exports.checkDocument = ({ tipo_doc, num_doc } = {}) => {
  const regex = DOC_REGEX[tipo_doc];
  if (!regex)
    throw httpError(400, "Tipo de documento inválido (DNI, CE o RUC)");
  if (!regex.test(String(num_doc).trim()))
    throw httpError(400, `Número de ${tipo_doc} inválido`);
};

exports.checkPersona = (p = {}) => {
  exports.checkDocument(p);

  if (p.tipo_doc === "RUC") exports.requireFields(p, ["razon_social"]);
  else exports.requireFields(p, ["nombres", "ape_paterno"]);

  if (p.correo && !exports.isEmail(p.correo))
    throw httpError(400, "Correo inválido");
  if (p.telefono && !exports.isTelephone(p.telefono))
    throw httpError(400, "El teléfono debe tener 9 dígitos");
};