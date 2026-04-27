const express = require('express');
const { getQueues } = require('../controllers/queue.controller');

const queueRouter = express.Router();

queueRouter.get('/', getQueues);

module.exports = { queueRouter };
