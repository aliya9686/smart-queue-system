const queues = [
  {
    id: 'general-service',
    name: 'General Service',
    status: 'open',
    waitingCount: 8,
    estimatedWaitMinutes: 24,
  },
  {
    id: 'priority-help',
    name: 'Priority Help',
    status: 'paused',
    waitingCount: 2,
    estimatedWaitMinutes: 10,
  },
];

function listQueues() {
  return queues;
}

module.exports = { listQueues };
