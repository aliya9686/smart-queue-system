const { Queue } = require('../models/queue.model');

async function getQueues() {
  return Queue.find({}, null, {
    sort: { createdAt: -1 },
    lean: true,
  });
}

module.exports = {
  getQueues,
};
