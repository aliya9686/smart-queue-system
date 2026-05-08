import dotenv from "dotenv";

dotenv.config();

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  clientUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/smart-queue-system",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
