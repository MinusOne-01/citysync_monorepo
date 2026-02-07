import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";


const ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY!;


export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});