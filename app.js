const express = require('express');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const resepRoutes = require('./routes/resep.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', resepRoutes);

// 404 handler (diletakkan setelah seluruh router)
app.use((req, res) => {
  res.status(404).render('pages/404', { pageTitle: 'Halaman Tidak Ditemukan' });
});

// Verifikasi koneksi basis data saat startup
db.query('SELECT 1 + 1 AS result')
  .then(() => {
    console.log('[DATABASE] Terhubung ke MySQL Pool secara aman.');
    app.listen(PORT, () => console.log(`[SERVER] Aktif di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[DATABASE ERROR] Gagal terhubung ke MySQL:', err.message);
    process.exit(1);
  });
