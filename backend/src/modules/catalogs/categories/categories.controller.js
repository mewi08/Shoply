const service = require("./categories.service");
const { sendSuccess } = require("../../../shared/utils/response");

exports.list = async (req, res) => {
  const data = await service.list();
  sendSuccess(res, { data });
};

exports.get = async (req, res) => {
  const id = req.params.id;
  const data = await service.get(id);
  sendSuccess(res, { data });
};

exports.create = async (req, res) => {
  const data = req.body;
  const id = await service.create(data);
  sendSuccess(res, { data: id }, 201);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  await service.update(id, data);
  sendSuccess(res, { message: "Marca actualizada" });
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  await service.remove(id);
  sendSuccess(res, { message: "Marca eliminada" });
};
