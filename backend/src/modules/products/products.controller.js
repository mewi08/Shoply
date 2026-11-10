const service = require('./products.service');
const { sendSuccess } = require('../../shared/utils/response');

exports.list = async (req, res, next) => {
  try { 
    const user = req.user;
    const data = await service.list(user);
    sendSuccess(res, { data });
  } catch(err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const data = await service.get(id, user);
    sendSuccess(res, { data });
  } catch(err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const idtienda = req.user.idtienda;
    const data = req.body;
    const id = await service.create(data, idtienda);
    sendSuccess(res, { data: id }, 201);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const data = req.body;
    await service.update(id, data, user);
    sendSuccess(res, { message: 'Producto actualizado' });
  } catch (err) {
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    await service.toggleStatus(id, user);
    sendSuccess(res, { message: 'Estado de producto actualizado' });
  } catch (err) {
    next(err);
  }
};