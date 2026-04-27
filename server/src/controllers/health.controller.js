const { getHealthSummary } = require('../services/health.service');
const { sendSuccess } = require('../utils/api-response');

function getHealth(_request, response) {
  return sendSuccess(response, getHealthSummary());
}

module.exports = { getHealth };
