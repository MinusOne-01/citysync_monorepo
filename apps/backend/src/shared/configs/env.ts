import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function optionalNumber(name: string): number | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const n = Number(value);
  if (Number.isNaN(n)) {
    throw new Error(`Env var ${name} must be a number`);
  }
  return n;
}

export const env = {
  PORT: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV,
  ORIGIN_URL: process.env.ORIGIN_URL,

  AWS_REGION: requireEnv("AWS_REGION"),
  AWS_ACCESS_KEY_ID: requireEnv("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: requireEnv("AWS_SECRET_ACCESS_KEY"),
  AWS_S3_BUCKET: requireEnv("AWS_S3_BUCKET"),

  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET") as string,
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "15m",
  REFRESH_TOKEN_TTL_DAYS: optionalNumber("REFRESH_TOKEN_TTL_DAYS") ?? 30,

  REDIS_URL: process.env.REDIS_URL,

};
