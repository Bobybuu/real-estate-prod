// utils/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const region = process.env.AWS_REGION!;
const bucketName = process.env.AWS_S3_BUCKET!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

export const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

// ✅ Upload file and return full public URL
export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const fileKey = `properties/${uuidv4()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // <-- make the image publicly readable
  });

  await s3Client.send(command);

  // ✅ return a direct public URL
  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
};
