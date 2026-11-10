const service = require("./users.service");
const { sendSuccess } = require("../../shared/utils/response");

exports.list = async (req, res) => {
  const user = req.user;
  const data = await service.list(user);
  sendSuccess(res, { data });
};

exports.get = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const data = await service.get(id, user);
  sendSuccess(res, { data });
};

exports.create = async (req, res) => {
  const user = req.user;
  const data = req.body;
  const id = await service.create(data, user);
  sendSuccess(res, { data: id }, 201);
};

exports.update = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const data = req.body;
  await service.update(id, data, user);
  sendSuccess(res, { message: 'Usuario actualizado' });
};

exports.remove = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  await service.remove(id, user);
  sendSuccess(res, { message: 'Estado actualizado' });
};

exports.updateMe = async (req, res) => {
  const user = req.user;
  const data = req.body;
  await service.updateMe(data, user);
  sendSuccess(res, { message: 'Actualización exitosa' });
};

exports.changePassword = async (req, res) => {
  const user = req.user;
  const data = req.body;
  service.changePassword(data, user);
  sendSuccess(res, { message: 'Contraseña actualizada' });
};
