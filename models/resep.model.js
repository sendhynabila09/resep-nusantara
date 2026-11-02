const db = require('../config/database');

// Seluruh query SQL berada di layer Model dan 100% memakai placeholder (?)
const ResepModel = {
  // READ (semua)
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM resep ORDER BY id DESC');
    return rows;
  },

  // READ (satu) berdasarkan primary key
  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM resep WHERE id = ?', [id]);
    return rows[0];
  },

  // CREATE
  create: async (data) => {
    const sql = `
      INSERT INTO resep
        (nama_resep, asal_daerah, tingkat_kesulitan, waktu_masak, estimasi_biaya, bahan, langkah, tanggal_dibuat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.nama_resep,
      data.asal_daerah,
      data.tingkat_kesulitan,
      data.waktu_masak,
      data.estimasi_biaya,
      data.bahan,
      data.langkah,
      data.tanggal_dibuat
    ]);
    return result;
  },

  // UPDATE
  update: async (id, data) => {
    const sql = `
      UPDATE resep
      SET nama_resep = ?, asal_daerah = ?, tingkat_kesulitan = ?, waktu_masak = ?,
          estimasi_biaya = ?, bahan = ?, langkah = ?, tanggal_dibuat = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [
      data.nama_resep,
      data.asal_daerah,
      data.tingkat_kesulitan,
      data.waktu_masak,
      data.estimasi_biaya,
      data.bahan,
      data.langkah,
      data.tanggal_dibuat,
      id
    ]);
    return result;
  },

  // DELETE
  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM resep WHERE id = ?', [id]);
    return result;
  },

  // Pencarian berdasarkan daerah (untuk uji keamanan SQL Injection)
  getByDaerah: async (daerah) => {
    const sql = 'SELECT * FROM resep WHERE asal_daerah = ?';
    console.log('\n[PREPARED STATEMENT QUERY]:', sql, 'WITH VALUE:', [daerah]);
    const [rows] = await db.execute(sql, [daerah]);
    return rows;
  }
};

module.exports = ResepModel;
