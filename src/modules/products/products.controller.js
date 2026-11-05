const service = require('./products.service');
const { sendSuccess } = require('../../shared/utils/response');

exports.list = async (req, res, next) => {
  try { 
    const idtienda = req.user.idtienda;
    const data = await service.list(idtienda);
    sendSuccess(res, { data });
  } catch(err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const idtienda = req.user.idtienda;
    const id = req.params.id;
    const data = await service.get(id, idtienda);
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
    const idtienda = req.user.idtienda;
    const id = req.params.id;
    const data = req.body;
    await service.update(id, data, idtienda);
    sendSuccess(res, { message: 'Producto actualizado' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const idtienda = req.user.idtienda;
    const id = req.params.id;
    await service.remove(id, idtienda);
    sendSuccess(res, { message: 'Estado de producto actualizado' });
  } catch (err) {
    next(err);
  }
};