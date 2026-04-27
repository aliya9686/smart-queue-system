const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { env } = require('./config/env');
const { errorHandler } = require('./middleware/error-handler');
const { notFoundHandler } = require('./middleware/not-found-handler');
const { apiRouter } = require('./routes');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({
      success: true,
      data: {
        name: 'Smart Queue API',
        version: '1.0.0',
      },
    });
  });

  app.use('/api', apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
