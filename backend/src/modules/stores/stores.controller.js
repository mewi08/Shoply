const service = require('./stores.service');
const { sendSuccess } = require('../../shared/utils/response');

exports.approve = async (req, res) => {
  const id = req.params.id;
  await service.approve(id);
  sendSuccess(res, { message: 'Tienda aprovada' });
};

exports.reject = async (req, res) => {
  const id = req.params.id;
  await service.reject(id);
  sendSuccess(res, { message: 'Tienda rechazada' });
};

exports.deactivate = async (req, res) => {
  const id = req.params.id;
  await service.deactivate(id);
  sendSuccess(res, { message: 'Tienda inactiva' });
};

exports.reactivate = async (req, res) => {
  const id = req.params.id;
  await service.reactivate(id);
  sendSuccess(res, { message: 'Tienda activa' });
};

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

exports.getMyStore = async (req, res, next) => {
  try {
    const id = req.user.idtienda;
    const data = await service.get(id);
    sendSuccess(res, { data });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await service.update(id, data);
    sendSuccess(res, { message: 'Tienda actualizada' });
  } catch (err) {
    next(err);
  }
};

exports.updateMyStore = async (req, res, next) => {
  try {
    const id = req.user.idtienda;
    const data = req.body;
    await service.update(id, data);
    sendSuccess(res, { message: 'Tienda actualizada' });
  } catch (err) {
    next(err);
  }
};
