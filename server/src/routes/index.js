const express = require('express');
const { healthRouter } = require('./health.routes');
const { queueRouter } = require('./queue.routes');

const apiRouter = express.Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/queues', queueRouter);

module.exports = {
  apiRouter,
};
