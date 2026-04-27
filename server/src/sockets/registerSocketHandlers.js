function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('queue:subscribe', ({ queueId }) => {
      socket.join(`queue:${queueId}`);
    });

    socket.on('entry:subscribe', ({ entryId }) => {
      socket.join(`entry:${entryId}`);
    });

    socket.on('admin:subscribe', ({ queueId }) => {
      socket.join(`admin:${queueId}`);
    });
  });
}

module.exports = { registerSocketHandlers };
