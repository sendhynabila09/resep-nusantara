const express = require('express');
const router = express.Router();
const resepController = require('../controllers/resep.controller');

router.get('/', (req, res) => res.redirect('/resep'));

router.get('/resep', resepController.getDaftarResep);

router.get('/resep/tambah', resepController.getFormTambah);
router.post('/resep/tambah', resepController.postTambahResep);

router.get('/resep/edit/:id', resepController.getFormEdit);
router.post('/resep/edit/:id', resepController.postUpdateResep);

router.post('/resep/hapus/:id', resepController.postHapusResep);

// Endpoint uji keamanan SQL Injection: /uji-keamanan?daerah=...
router.get('/uji-keamanan', resepController.getUjiKeamanan);

module.exports = router;
