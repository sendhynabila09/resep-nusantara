-- Skema basis data Tugas 3: Resep Masakan Nusantara
CREATE DATABASE IF NOT EXISTS db_resep_nusantara;
USE db_resep_nusantara;

CREATE TABLE IF NOT EXISTS resep (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_resep VARCHAR(100) NOT NULL,
  asal_daerah VARCHAR(50) NOT NULL,
  tingkat_kesulitan ENUM('Mudah', 'Sedang', 'Sulit') NOT NULL DEFAULT 'Sedang',
  waktu_masak INT NOT NULL COMMENT 'dalam menit',
  estimasi_biaya DECIMAL(10, 2) NOT NULL,
  bahan TEXT NOT NULL,
  langkah TEXT NOT NULL,
  tanggal_dibuat DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data benih (seeding)
INSERT INTO resep (nama_resep, asal_daerah, tingkat_kesulitan, waktu_masak, estimasi_biaya, bahan, langkah, tanggal_dibuat) VALUES
('Rendang Sapi', 'Sumatera Barat', 'Sulit', 240, 150000.00,
 'Daging sapi 1 kg, santan kelapa 2 liter, cabai merah, bawang merah, bawang putih, lengkuas, jahe, serai, daun jeruk, daun kunyit, garam',
 'Haluskan bumbu. Tumis hingga harum. Masukkan daging dan santan. Masak dengan api kecil sambil diaduk hingga santan mengering dan bumbu menghitam.',
 '2026-10-01'),
('Gado-Gado', 'Jakarta', 'Mudah', 30, 35000.00,
 'Kangkung, tauge, kol, kentang, tahu, tempe, telur rebus, kacang tanah, cabai, gula merah, asam jawa, bawang putih',
 'Rebus semua sayuran. Goreng tahu dan tempe. Ulek bumbu kacang. Tata sayuran lalu siram dengan bumbu kacang.',
 '2026-10-05'),
('Soto Ayam Lamongan', 'Jawa Timur', 'Sedang', 90, 60000.00,
 'Ayam 1 ekor, kunyit, jahe, serai, daun jeruk, bawang merah, bawang putih, kemiri, soun, telur, koya, seledri',
 'Rebus ayam hingga empuk. Tumis bumbu halus lalu masukkan ke kuah. Sajikan dengan soun, suwiran ayam, telur, dan koya.',
 '2026-10-10');
