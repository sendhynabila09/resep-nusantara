# Resep Nusantara — Tugas 3 Pemrograman Web

Sistem Manajemen Master Data **Resep Masakan Nusantara** berbasis Express.js + MySQL dengan arsitektur MVC, connection pooling (`mysql2/promise`), dan **100% Prepared Statements**.

## Fitur

- CRUD lengkap: daftar resep, tambah, edit (form terisi otomatis), dan hapus (dengan dialog konfirmasi).
- Pola Post-Redirect-Get (PRG) pada setiap operasi POST.
- Rute dinamis `/resep/edit/:id` dengan penanganan data tidak ditemukan (404).
- Validasi server-side (field wajib, enum, angka, format tanggal).
- Kredensial database terisolasi di `.env` (contoh tersedia di `.env.example`).
- Seluruh query SQL berada di `models/` dan memakai placeholder `?` (tanpa konkatenasi string).

## Skema Tabel `resep`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT AUTO_INCREMENT PRIMARY KEY | |
| nama_resep | VARCHAR(100) | |
| asal_daerah | VARCHAR(50) | |
| tingkat_kesulitan | ENUM('Mudah','Sedang','Sulit') | |
| waktu_masak | INT | menit |
| estimasi_biaya | DECIMAL(10,2) | rupiah |
| bahan | TEXT | |
| langkah | TEXT | |
| tanggal_dibuat | DATE | |
| created_at | TIMESTAMP | otomatis |

## Struktur Proyek

```
resep-nusantara/
├── app.js
├── config/database.js          # connection pool
├── models/resep.model.js       # seluruh query SQL (prepared statements)
├── controllers/resep.controller.js
├── routes/resep.routes.js
├── views/
│   ├── pages/                  # resep-list, form tambah/edit, 404
│   └── partials/               # header, footer, resep-fields
├── public/css/style.css
├── database/schema.sql         # DDL + data benih
├── docs/screenshots/           # bukti pengujian
├── .env.example
└── .gitignore
```

## Cara Menjalankan

1. Instal dependensi:
   ```bash
   npm install
   ```
2. Buat database dan tabel: jalankan isi `database/schema.sql` di MySQL Workbench / DBeaver / phpMyAdmin / MySQL CLI.
3. Salin `.env.example` menjadi `.env`, lalu sesuaikan kredensial MySQL Anda:
   ```bash
   cp .env.example .env
   ```
4. Jalankan aplikasi:
   ```bash
   npm run dev     # mode pengembangan (nodemon)
   npm start       # mode biasa
   ```
5. Buka `http://localhost:3000/resep`.

## Endpoint

| Operasi | URL | Method | Respons |
|---|---|---|---|
| Read (All) | `/resep` | GET | 200 OK |
| Form Create | `/resep/tambah` | GET | 200 OK |
| Create | `/resep/tambah` | POST | 302 → `/resep` |
| Read (One) / Form Edit | `/resep/edit/:id` | GET | 200 OK (atau 404) |
| Update | `/resep/edit/:id` | POST | 302 → `/resep` |
| Delete | `/resep/hapus/:id` | POST | 302 → `/resep` |
| Uji keamanan | `/uji-keamanan?daerah=...` | GET | 200 JSON |

## Logbook Pengujian (Traceability Matrix)

| ID Uji | Fitur / Operasi | Target Endpoint URL | HTTP Method | Skenario Pengujian | Hasil yang Diharapkan | Status | Bukti Tangkapan Layar |
|---|---|---|---|---|---|---|---|
| TC-01 | Koneksi Pool | App Startup | - | Server dijalankan pertama kali | Terhubung ke MySQL Pool tanpa error | Pass | `docs/screenshots/01-db-pool-connection.png`