const { listQueues } = require('../services/queue.service');
const { sendSuccess } = require('../utils/api-response');

function getQueues(_request, response) {
  return sendSuccess(response, listQueues());
}

module.exports = { getQueues };
