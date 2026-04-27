const { env } = require('../config/env');

function getHealthSummary() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: env.nodeEnv,
  };
}

module.exports = { getHealthSummary };
