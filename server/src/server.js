const http = require('http');
const { Server } = require('socket.io');
const { createApp } = require('./app');
const { env } = require('./config/env');
const { registerSocketHandlers } = require('./sockets/registerSocketHandlers');

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

registerSocketHandlers(io);
app.set('io', io);

server.listen(env.port, () => {
  console.log(
    `Smart Queue server listening on http://localhost:${env.port} in ${env.nodeEnv} mode`,
  );
});
