exports.pick = (body, allowedFields) => {
  return Object.fromEntries(
    allowedFields.filter((key) => key in body).map(
      (key) => [key, typeof body[key] === "string" ? body[key].trim() : body[key]]
    )
  );
};

exports.emptyToNull = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === "" ? null : v]),
);
