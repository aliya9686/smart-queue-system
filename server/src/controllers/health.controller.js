const { env } = require('../config/env');
const { getDatabaseState } = require('../config/database');

function getHealth(_request, response) {
  response.json({
    success: true,
    data: {
      status: 'ok',
      environment: env.nodeEnv,
      database: getDatabaseState(),
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = {
  getHealth,
};
