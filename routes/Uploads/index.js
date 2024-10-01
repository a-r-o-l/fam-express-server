import { Router } from "express";
import multer from "multer";
import { s3Client } from "../../libs/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const extension = file.originalname.split(".").pop();
    const bucketParams = {
      Bucket: process.env.DO_BUCKET,
      Key: `${Date.now()}.${extension}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    const result = await s3Client.send(new PutObjectCommand(bucketParams));

    res.json({
      id: result.ETag,
      url: `${process.env.DO_ENDPOINT}/${process.env.DO_BUCKET}/${bucketParams.Key}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
