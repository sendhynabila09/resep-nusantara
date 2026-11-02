const ResepModel = require('../models/resep.model');

const KESULITAN = ['Mudah', 'Sedang', 'Sulit'];

// Validasi & normalisasi input form (server-side)
function validasi(body) {
  const data = {
    nama_resep: (body.nama_resep || '').trim(),
    asal_daerah: (body.asal_daerah || '').trim(),
    tingkat_kesulitan: body.tingkat_kesulitan,
    waktu_masak: Number(body.waktu_masak),
    estimasi_biaya: Number(body.estimasi_biaya),
    bahan: (body.bahan || '').trim(),
    langkah: (body.langkah || '').trim(),
    tanggal_dibuat: (body.tanggal_dibuat || '').trim()
  };

  let error = null;
  if (!data.nama_resep || !data.asal_daerah || !data.bahan || !data.langkah || !data.tanggal_dibuat) {
    error = 'Seluruh field formulir wajib diisi.';
  } else if (data.nama_resep.length > 100 || data.asal_daerah.length > 50) {
    error = 'Nama resep maksimal 100 karakter dan asal daerah maksimal 50 karakter.';
  } else if (!KESULITAN.includes(data.tingkat_kesulitan)) {
    error = 'Tingkat kesulitan tidak valid.';
  } else if (!Number.isInteger(data.waktu_masak) || data.waktu_masak < 1) {
    error = 'Waktu masak harus berupa bilangan bulat positif (menit).';
  } else if (!Number.isFinite(data.estimasi_biaya) || data.estimasi_biaya < 0) {
    error = 'Estimasi biaya harus berupa angka yang valid.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_dibuat)) {
    error = 'Format tanggal tidak valid.';
  }
  return { data, error };
}

exports.getDaftarResep = async (req, res) => {
  try {
    const resepList = await ResepModel.getAll();
    res.render('pages/resep-list', { pageTitle: 'Daftar Resep Nusantara', resepList });
  } catch (error) {
    console.error('[ERROR getDaftarResep]:', error);
    res.status(500).send('Terjadi galat internal peladen saat mengambil data.');
  }
};

exports.getFormTambah = (req, res) => {
  res.render('pages/resep-form-tambah', {
    pageTitle: 'Tambah Resep Baru',
    resep: { tingkat_kesulitan: 'Sedang', tanggal_dibuat: new Date().toISOString().slice(0, 10) },
    error: null,
    kesulitan: KESULITAN
  });
};

exports.postTambahResep = async (req, res) => {
  try {
    const { data, error } = validasi(req.body);
    if (error) {
      return res.status(400).render('pages/resep-form-tambah', {
        pageTitle: 'Tambah Resep Baru',
        resep: req.body,
        error,
        kesulitan: KESULITAN
      });
    }
    await ResepModel.create(data);
    console.log(`[DATABASE] Data "${data.nama_resep}" berhasil di-insert.`);
    res.redirect('/resep'); // Pola Post-Redirect-Get
  } catch (error) {
    console.error('[ERROR postTambahResep]:', error);
    res.status(500).send('Gagal menyimpan data ke basis data.');
  }
};

exports.getFormEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const resep = await ResepModel.getById(id);
    if (!resep) {
      return res.status(404).render('pages/404', { pageTitle: 'Resep Tidak Ditemukan' });
    }
    res.render('pages/resep-form-edit', {
      pageTitle: 'Edit Resep',
      resep,
      error: null,
      kesulitan: KESULITAN
    });
  } catch (error) {
    console.error('[ERROR getFormEdit]:', error);
    res.status(500).send('Galat internal saat memuat form edit.');
  }
};

exports.postUpdateResep = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = validasi(req.body);
    if (error) {
      return res.status(400).render('pages/resep-form-edit', {
        pageTitle: 'Edit Resep',
        resep: { ...req.body, id },
        error,
        kesulitan: KESULITAN
      });
    }
    const result = await ResepModel.update(id, data);
    if (result.affectedRows === 0) {
      return res.status(404).render('pages/404', { pageTitle: 'Resep Tidak Ditemukan' });
    }
    console.log(`[DATABASE] Record ID ${id} berhasil diperbarui.`);
    res.redirect('/resep');
  } catch (error) {
    console.error('[ERROR postUpdateResep]:', error);
    res.status(500).send('Gagal memperbarui record data.');
  }
};

exports.postHapusResep = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ResepModel.delete(id);
    if (result.affectedRows === 0) {
      console.warn(`[DATABASE] Tidak ada record yang terhapus untuk ID ${id}`);
    } else {
      console.log(`[DATABASE] Record ID ${id} berhasil dihapus.`);
    }
    res.redirect('/resep');
  } catch (error) {
    console.error('[ERROR postHapusResep]:', error);
    res.status(500).send('Gagal menghapus entitas dari basis data.');
  }
};

exports.getUjiKeamanan = async (req, res) => {
  try {
    const inputPayload = req.query.daerah;
    if (inputPayload === undefined) {
      return res.status(400).json({ error: 'Gunakan query string ?daerah=...' });
    }
    const hasil = await ResepModel.getByDaerah(inputPayload);
    res.json({ input: inputPayload, totalDataDitemukan: hasil.length, data: hasil });
  } catch (error) {
    console.error('[ERROR getUjiKeamanan]:', error);
    res.status(500).json({ error: 'Galat internal peladen.' });
  }
};
