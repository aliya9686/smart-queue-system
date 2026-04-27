const { getQueues } = require('../services/queue.service');

async function listQueues(_request, response, next) {
  try {
    const queues = await getQueues();

    response.json({
      success: true,
      data: queues,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listQueues,
};
