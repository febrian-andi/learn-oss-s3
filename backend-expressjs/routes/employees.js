const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadToS3, deleteFromS3 } = require("../services/s3Service");
const db = require("../config/config");

// METHOD GET
router.get("/", (req, res) => {
  const sql = "SELECT * FROM employees";
  db.query(sql, (err, results) => {
    if (err) {
      res.send({
        status: 500,
        error: err,
        message: "Gagal mendapatkan data karyawan",
        data: [],
      });
    } else {
      res.send({
        status: 200,
        error: null,
        message: "Berhasil mendapatkan data karyawan",
        data: results,
      });
    }
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id; // Mengambil ID dari jalur URL
  const sql = `SELECT * FROM employees WHERE id_employee = ${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res.send({
        status: 500,
        error: err,
        message: "Gagal mendapatkan data karyawan",
        data: [],
      });
    } else {
      if (results.length === 0) {
        res.send({
          status: 404,
          error: null,
          message: "Data karyawan tidak ditemukan",
          data: [],
        });
      } else {
        res.send({
          status: 200,
          error: null,
          message: "Berhasil menemukan data karyawan dengan id : " + id,
          data: results,
        });
      }
    }
  });
});

// Konfigurasi multer untuk menerima file tanpa penyimpanan lokal
const upload = multer({ storage: multer.memoryStorage() }); // Gunakan memoryStorage untuk menyimpan file dalam memori

// Route POST untuk menyimpan data karyawan termasuk foto
router.post("/", upload.single("photo"), async (req, res) => {
  const { nama, job, salary } = req.body;
  const file = req.file;
  const filename = file.originalname.replace(/,/g, "-");
  const finalFileName = `${Date.now()}_${filename}`;

  if (!file) {
    return res.status(400).json({
      status: 400,
      message: "Tidak ada file yang diupload",
      data: [],
    });
  }

  // Menyimpan data karyawan terlebih dahulu
  const sql = `INSERT INTO employees (nama, job, salary, photo) VALUES (?, ?, ?, ?)`;
  const values = [nama, job, salary, finalFileName];

  db.query(sql, values, async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Gagal menambahkan data karyawan",
        error: err,
        data: [],
      });
    }

    // Jika penyimpanan data berhasil, unggah foto ke S3
    try {
      const photoUrl = await uploadToS3({...file, originalname: finalFileName});
      return res.status(200).json({
        status: 200,
        message: "Berhasil menambahkan data karyawan dan mengunggah foto",
        data: {
          id: results.insertId,
          fields: req.body,
          photo: photoUrl,
        },
      });
    } catch (error) {
      // Jika terjadi kesalahan, hapus karyawan dari database
      const deleteSql = `DELETE FROM employees WHERE id_employee = ?`;
      await new Promise((resolve) => {
        db.query(deleteSql, [results.insertId], (deleteErr) => {
          if (deleteErr) {
            console.error(
              "Gagal menghapus data karyawan setelah gagal upload:",
              deleteErr
            );
          }
          resolve();
        });
      });

      res.status(500).json({
        status: 500,
        message: "Gagal mengunggah foto ke S3 atau menyimpan data karyawan",
        error: error.message,
        data: [],
      });
    }
  });
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const sqlSelect = `SELECT photo FROM employees WHERE id_employee = ?`;
  const valuesSelect = [id];

  db.query(sqlSelect, valuesSelect, async (err, results) => {
    if (err) {
      return res.status(500).send({
        status: 500,
        error: err,
        message: "Gagal mengambil data karyawan",
        data: [],
      });
    }

    if (results.length === 0) {
      return res.status(404).send({
        status: 404,
        error: null,
        message: `Data karyawan dengan id: ${id} tidak ditemukan`,
        data: [],
      });
    }

    const photoUrl = results[0].photo; // Menghapus data karyawan dari database terlebih dahulu

    const sqlDelete = `DELETE FROM employees WHERE id_employee = ?`;
    db.query(sqlDelete, valuesSelect, async (deleteErr) => {
      if (deleteErr) {
        return res.status(500).send({
          status: 500,
          error: deleteErr,
          message: "Gagal menghapus data karyawan",
          data: [],
        });
      } // Jika penghapusan data berhasil, hapus foto dari S3

      if (photoUrl) {
        try {
          await deleteFromS3(photoUrl); // Hapus foto dari S3
        } catch (error) {
          console.error("Gagal menghapus foto dari S3:", error);
        }
      }

      res.send({
        status: 200,
        error: null,
        message: `Berhasil menghapus data karyawan dengan id: ${id}`,
        data: [],
      });
    });
  });
});

module.exports = router;
