const DOC_REGEX = {
  DNI: /^\d{8}$/,
  CE: /^[A-Za-z0-9]{9,12}$/,
  RUC: /^\d{11}$/,
};

export const DOC_INFO = {
  DNI: { max: 8, numeric: true, hint: "8 dígitos" },
  CE: { max: 12, numeric: false, hint: "9 a 12 caracteres" },
  RUC: { max: 11, numeric: true, hint: "11 dígitos" },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{9}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,50}$/;

const required = (v) => v.trim() !== "";
const matches = (re) => (v) => re.test(v.trim());
const optional = (re) => (v) => v.trim() === "" || re.test(v.trim());

const isRuc = (f) => f.tipo_doc === "RUC";
const isPerson = (f) => f.tipo_doc !== "RUC";

const STEP_RULES = [
  [
    { field: "num_doc", valid: (v, f) => DOC_REGEX[f.tipo_doc].test(v.trim()), message: "Número de documento inválido" },
    { field: "razon_social", valid: required, message: "Escribe la razón social", when: isRuc },
    { field: "nombres", valid: required, message: "Escribe tus nombres", when: isPerson },
    { field: "ape_paterno", valid: required, message: "Escribe tu apellido paterno", when: isPerson },
    { field: "correo", valid: optional(EMAIL_REGEX), message: "Correo inválido" },
    { field: "telefono", valid: optional(PHONE_REGEX), message: "El teléfono debe tener 9 dígitos" },
  ],
  [
    { field: "username", valid: matches(USERNAME_REGEX), message: "3 a 50 caracteres (letras, números, _ . -)" },
    { field: "password", valid: (v) => v.length >= 8 && v.length <= 72, message: "Debe tener entre 8 y 72 caracteres" },
    { field: "confirm_password", valid: (v, f) => v === f.password, message: "Las contraseñas no coinciden" },
  ],
  [
    { field: "tienda_nombre", valid: required, message: "Escribe el nombre de la tienda" },
    { field: "tienda_direccion", valid: required, message: "Escribe la dirección" },
    { field: "tienda_telefono", valid: matches(PHONE_REGEX), message: "El teléfono debe tener 9 dígitos" },
  ],
];

export const validateStep = (step, form) => {
  const errors = {};
  for (const { field, valid, message, when } of STEP_RULES[step]) {
    if (when && !when(form)) continue;
    if (!valid(form[field], form)) errors[field] = message;
  }
  return errors;
};