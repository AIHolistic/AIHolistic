# STANDAR OPERASIONAL PROSEDUR (SOP)
## Operasional Web Crawler, Gemini AI, & Pengelolaan Glosarium

**Dokumen No:** SOP-AKOMODA-001  
**Versi:** 1.0.0  
**Tanggal Efektif:** 23 Juli 2026  

---

### 1. TUJUAN
SOP ini bertujuan memberikan panduan langkah demi langkah dalam mengoperasikan mesin perayap web (Web Crawler), menjaga kesehatan API Gemini, serta mengurus validasi data istilah di Akomoda Glosarium Digital.

---

### 2. PROSEDUR PERAYAPAN WEB (CRAWLER CONSOLE)
1. **Input URL Target:** Operator memasukkan URL situs yang relevan (misal: artikel ilmu pengetahuan, situs berita teknologi).
2. **Pengeset Kedalaman (Depth & Limit):**
   - Kedalaman standar: Maksimal 2 tingkat.
   - Limit halaman per run: Maksimal 20 halaman untuk menghindari overload bandwidth.
3. **Pemeriksaan Hasil Crawl:**
   - Periksa skor SEO dan daftar kata kunci yang diekstraksi.
   - Pilih kata kunci berkualitas untuk dimasukkan ke dalam database Glosarium Utama.

---

### 3. MANAGEMENT API KEY GEMINI AI
1. **Pemantauan Quota:**
   - Selalu pantau kuota harian di Google AI Studio Dashboard.
   - Apabila kuota utama habis, sistem server otomatis beralih ke Mode Fallback Lokal untuk memastikan website tidak crash/blank.
2. **Rotasi API Key:** API Key disimpan aman pada environment variable (`process.env.GEMINI_API_KEY`) dan tidak pernah dikirimkan ke browser client.

---

### 4. VALIDASI DATA GLOSARIUM (CMS KELOLA GLOSARIUM)
1. Setiap entri baru harus memiliki:
   - Istilah dalam Bahasa Indonesia (`term`) & Bahasa Inggris (`term_en`).
   - Definisi yang ringkas dan padat (maksimal 300 karakter).
   - Tag kategori yang sesuai (Teknologi, Kesehatan, Sains, Web3, dll).
2. Lakukan Sinkronisasi berkala ke Google Sheets Backup via menu Kelola Glosarium.

---
*Akomoda Glosarium Operational Team*
