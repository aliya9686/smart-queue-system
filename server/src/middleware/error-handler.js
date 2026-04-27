function errorHandler(error, _request, response, _next) {
  console.error(error);

  return response.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Something went wrong.',
    },
  });
}

module.exports = { errorHandler };
