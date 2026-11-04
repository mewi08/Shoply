const { sendError } = require("../utils/response");

exports.notFound = (req, res) => {
  sendError(res, "Ruta no encontrada", 404);
};

exports.errorHandler = (err, req, res, next) => {
  if (err.status) {
    return sendError(res, err.message, err.status);
  }

  if (err.code === "ER_DUP_ENTRY") {
    return sendError(res, "Ya existe un registro con ese valor", 409);
  }

  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return sendError(res, "No se puede eliminar, registro en uso", 409);
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return sendError(res, "No existe el registro indicado", 400);
  }

  console.error(err);

  return sendError(res, "Error interno del servidor", 500);
};
