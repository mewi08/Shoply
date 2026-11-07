const service = require("./categories.service");
const { sendSuccess } = require("../../../shared/utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await service.list();
    sendSuccess(res, { data });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await service.get(id);
    sendSuccess(res, { data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const id = await service.create(data);
    sendSuccess(res, { data: id }, 201);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await service.update(id, data);
    sendSuccess(res, { message: "Marca actualizada" });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.remove(id);
    sendSuccess(res, { message: "Marca eliminada" });
  } catch (err) {
    next(err);
  }
};
