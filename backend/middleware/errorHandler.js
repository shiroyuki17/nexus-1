export function notFoundHandler(req, res) {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.code === 'P2025' ? 404 : 500;

  return res.status(status).json({
    message: status === 404 ? 'Record not found' : 'Internal server error',
    detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
  });
}
