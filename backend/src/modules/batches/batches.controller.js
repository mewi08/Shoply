const service = require("./batches.service");
const { sendSuccess } = require("../../shared/utils/response");

exports.list = async (req, res) => {
  const idtienda = req.user.idtienda;
  const data = await service.list(idtienda);
  sendSuccess(res, { data });
};

exports.get = async (req, res) => {
  const idtienda = req.user.idtienda;
  const id = req.params.id;
  const data = await service.get(id, idtienda);
  sendSuccess(res, { data });
};

exports.create = async (req, res) => {
  const user = req.user;
  const data = req.body;
  const id = await service.create(data, user);
  sendSuccess(res, { data: id }, 201);
};

exports.update = async (req, res) => {
  const idtienda = req.user.idtienda;
  const id = req.params.id;
  const data = req.body;
  await service.update(id, data, idtienda);
  sendSuccess(res, { message: "Lote actualizado" });
};

exports.remove = async (req, res) => {
  const idtienda = req.user.idtienda;
  const id = req.params.id;
  await service.remove(id, idtienda);
  sendSuccess(res, { message: "Lote eliminado" });
};
