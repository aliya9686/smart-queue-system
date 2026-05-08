import http from "node:http";
import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
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

void startServer();
