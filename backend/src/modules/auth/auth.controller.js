const { config } = require('../../shared/config/env');
const service = require('./auth.service');
const { sendSuccess } = require('../../shared/utils/response');

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.environment === 'production',
};

exports.login = async (req, res) => {
  const data = req.body;
  const token = await service.login(data);
  res.cookie('token', token, cookieOpts);
  sendSuccess(res, { message: 'Sesión iniciada' });
};

exports.logout = (req, res) => {
  res.clearCookie('token', cookieOpts);
  sendSuccess(res, { message: 'Sesión finalizada' });
};

exports.me = async (req, res) => {
  const id = req.user.id;
  const user = await service.me(id);
  sendSuccess(res, { data: user });
};

exports.register = async (req, res) => {
  const data = req.body;
  await service.register(data);
  sendSuccess(res, { message: 'Solicitud enviada' });
}