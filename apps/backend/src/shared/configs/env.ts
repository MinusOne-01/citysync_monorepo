import dotenv from "dotenv";

dotenv.config();

export const env = {

  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  
};