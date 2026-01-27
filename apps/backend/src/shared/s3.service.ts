import { env } from "../shared/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { AppError } from "./errors";

const REGION = env.AWS_REGION!;
const BUCKET = env.AWS_S3_BUCKET!;
const ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY!;


//s3 config setup
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});



// Function to generate a presigned URL for uploading files to S3
export const getPresignedUploadUrl = async (
    userId: string,
    category: "profiles" | "meetups",
    mimeType: string
) => {

    const mediaId = crypto.randomUUID();
    const extension = mimeType.split("/")[1];
    const key = `${category}/${userId}/${mediaId}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: mimeType
    });

    // Link expires in 300 seconds for security
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
        signedUrl,
        key,
        publicUrl
    };

};

export const deleteS3Object = async (oldKey: string) => {

    await s3Client.send(new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: oldKey,
      }));
      
};
