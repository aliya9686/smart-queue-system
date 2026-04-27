const http = require("http");
const { createApp } = require("./app");
const { connectDatabase } = require("./config/database");
const { env } = require("./config/env");

async function startServer() {
  try {
    await connectDatabase();

    const app = createApp();
    const server = http.createServer(app);

    server.listen(env.port, () => {
      console.log(
        `Smart Queue API listening on http://localhost:${env.port} (${env.nodeEnv})`,
      );
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
