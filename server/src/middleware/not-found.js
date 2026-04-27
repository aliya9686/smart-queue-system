function notFoundHandler(request, response, next) {
  if (response.headersSent) {
    return next();
  }

  return response.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${request.method} ${request.originalUrl}`,
    },
  });
}

module.exports = { notFoundHandler };
