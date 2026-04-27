const express = require('express');
const authRouter = require('./authRoutes');
const { healthRouter } = require('./health.routes');
const { queueRouter } = require('./queue.routes');

const apiRouter = express.Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/queues', queueRouter);
apiRouter.use('/auth', authRouter);

module.exports = {
  apiRouter,
};
