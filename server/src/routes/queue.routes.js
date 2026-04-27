const express = require('express');
const { listQueues } = require('../controllers/queue.controller');

const queueRouter = express.Router();

queueRouter.get('/', listQueues);

module.exports = {
  queueRouter,
};
