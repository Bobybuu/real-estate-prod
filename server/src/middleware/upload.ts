import multer from "multer";

// Store files in memory (we’ll stream them to S3)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
