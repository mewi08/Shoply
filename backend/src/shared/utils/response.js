exports.sendSuccess = (res, response = {}, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, ...response });
};

exports.sendError = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });

exports.httpError = (status, message) =>
  Object.assign(new Error(message), { status });