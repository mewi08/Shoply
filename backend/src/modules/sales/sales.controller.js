const service = require('./sales.service');
const { sendSuccess } = require('../../shared/utils/response');

exports.create = async (req, res) => {
  const data = await service.create(req.body, req.user);
  sendSuccess(res, { data }, 201);
};

exports.list = async (req, res) => {
  const { idtienda } = req.user;
  const data = await service.list(idtienda);
  sendSuccess(res, { data });
};

exports.get = async (req, res) => {
  const { id } = req.params;
  const { idtienda } = req.user;
  const data = await service.get(id, idtienda);
  sendSuccess(res, { data });
};

exports.cancel = async (req, res) => {
  const { id } = req.params;
  const { idtienda } = req.user;
  await service.cancel(id, idtienda);
  sendSuccess(res, { message: 'Venta anulada correctamente' });
};