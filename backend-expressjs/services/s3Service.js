const s3 = require("../config/s3");
const fs = require("fs");
const tmp = require("tmp");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// Fungsi untuk mengunggah file ke S3
async function uploadToS3(file) {
  return new Promise((resolve, reject) => {
    const tmpFilePath = tmp.fileSync().name; // Membuat file sementara

    // Menulis buffer file ke file sementara
    fs.writeFile(tmpFilePath, file.buffer, (err) => {
      if (err) {
        console.error("Error writing temporary file:", err);
        return reject(new Error("Gagal menulis file sementara"));
      }

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.originalname, // Gunakan originalname untuk nama file di S3
        Body: fs.createReadStream(tmpFilePath), // Menggunakan stream dari file sementara
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      // Mengunggah ke S3
      s3.send(new PutObjectCommand(params))
        .then(() => {
          // Hapus file sementara setelah sukses
          fs.unlink(tmpFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting temporary file:", unlinkErr);
            }
          });
          resolve(file.originalname); // Kembalikan nama file
        })
        .catch((uploadErr) => {
          console.error("Error uploading to S3:", uploadErr);
          reject(new Error("Gagal mengunggah file ke S3"));
        });
    });
  });
}

async function deleteFromS3(photoUrl) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: photoUrl,
    };

    await s3.send(new DeleteObjectCommand(params)); // Hapus file dari S3
  } catch (error) {
    console.error("Gagal menghapus foto dari S3:", error);
    throw new Error("Gagal menghapus foto dari S3");
  }
}

module.exports = { uploadToS3, deleteFromS3 };
