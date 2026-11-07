const { config } = require('../../shared/config/env');
const service = require('./auth.service');
const { sendSuccess } = require('../../shared/utils/response');

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.environment === 'production',
};

exports.login = async (req, res, next) => {
  try {
    const data = req.body;
    const token = await service.login(data);
    
    res.cookie('token', token, cookieOpts);

    sendSuccess(res, { message: 'Sesión iniciada' });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token', cookieOpts);
    sendSuccess(res, { message: 'Sesión finalizada' });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await service.me(id);
    sendSuccess(res, { data: user });
  } catch (err) {
    next(err);
  }
};