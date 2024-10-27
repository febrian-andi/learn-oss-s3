require("dotenv").config();
const { S3Client, HeadBucketCommand } = require("@aws-sdk/client-s3");

// Konfigurasi S3Client
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
});

// Periksa koneksi ke S3 bucket
async function checkBucketConnection() {
  try {
    await s3.send(
      new HeadBucketCommand({ Bucket: process.env.S3_BUCKET_NAME })
    );
    console.log(
      `Successfully connected to S3 bucket: ${process.env.S3_BUCKET_NAME}`
    );
  } catch (err) {
    console.error("Error connecting to S3:", err);
  }
}

checkBucketConnection();

module.exports = s3;
