# PANDUAN PENDAFTARAN GOOGLE SEARCH CONSOLE (GSC)
## Akomoda Glosarium Digital (kata.jimkoto.my.id)

**Dokumen No:** SEO-GSC-005  
**Versi:** 1.0.0  
**Tanggal Efektif:** 23 Juli 2026  

---

### 1. MENGAPA GSC SANGAT PENTING DAN WAJIB?

Mendaftarkan **Akomoda Glosarium Digital (`kata.jimkoto.my.id`)** ke Google Search Console (GSC) adalah langkah **vital dan sangat wajib** untuk alasan berikut:

1. **Percepatan Indeksasi Googlebot:** Ribuan istilah glosarium multibahasa (Indonesia, Inggris, Arab, Jerman) akan langsung terdeteksi oleh mesin pencari Google tanpa harus menunggu berminggu-minggu.
2. **Submit Sitemap Otomatis (`/sitemap.xml`):** Sistem kata.jimkoto.my.id secara dinamis sudah menyediakan file `sitemap.xml` dan `robots.txt`. Mendaftarkan sitemap ke GSC memicu Google merayapi seluruh data kata kunci terverifikasi.
3. **Analitik Kata Kunci & Imfresi Organic:** Mengetahui kata kunci apa saja yang dicari publik yang mengarahkan lalu lintas ke situs Anda, lengkap dengan CTR, ranking rata-rata, dan posisi SERP.
4. **Rich Snippets & JSON-LD DefinedTerm:** Memastikan tag Schema.org yang ditanamkan aplikasi dikenali dengan benar oleh Google sehingga istilah glosarium muncul sebagai *Rich Results* di hasil pencarian.

---

### 2. LANGKAH-LANGKAH PENDAFTARAN KE GSC

#### A. Persiapan Akun & Login
1. Buka browser dan kunjungi: **[Google Search Console](https://search.google.com/search-console)**.
2. Login menggunakan akun Google Anda (`yames2211@gmail.com` atau akun pengelola domain).

#### B. Memilih Opsi Properti (Property Type)
Pilih salah satu dari dua metode di bawah ini:

* **Opsi 1: URL Prefix (Paling Mudah untuk Subdomain Specific)**  
  - Masukkan URL persis: `https://kata.jimkoto.my.id`
  - Klik **Continue**.

* **Opsi 2: Domain (Untuk mencakup seluruh domain jimkoto.my.id)**  
  - Masukkan: `jimkoto.my.id`
  - Klik **Continue**.

---

### 3. METODE VERIFIKASI KEPEMILIKAN DOMAIN

#### Metode A: Verifikasi DNS Record di Hostinger (Rekomendasi Utama)
1. Di GSC, pilih metode **DNS Record / TXT Record**.
2. Salin kode TXT yang diberikan Google (Contoh: `google-site-verification=abc123xyz...`).
3. Masuk ke hPanel **Hostinger** Anda (`hpanel.hostinger.com`).
4. Buka menu **DNS Zone Editor** untuk domain `jimkoto.my.id`.
5. Tambahkan record baru:
   - **Type:** `TXT`
   - **Name / Host:** `kata` (atau `@` jika memakai opsi Domain)
   - **TXT Value:** *Tempel kode verifikasi dari GSC*
   - **TTL:** `3600` (Default)
6. Klik **Add Record**.
7. Kembali ke halaman Google Search Console, lalu klik tombol **VERIFY**.

#### Metode B: Verifikasi Tag Meta HTML (Metode Alternatif)
1. Di GSC, pilih metode **HTML Tag**.
2. Salin tag meta yang diberikan (Contoh: `<meta name="google-site-verification" content="TOKEN_ANDA" />`).
3. Tempelkan tag meta ini ke dalam bagian `<head>` di file `index.html` aplikasi.
4. Deploy ke Hostinger, lalu klik **VERIFY** di GSC.

---

### 4. MEMASUKKAN SITEMAP DENGAN BENAR

Setelah verifikasi sukses:
1. Di dashboard Google Search Console, buka menu navigasi sebelah kiri: **Sitemaps**.
2. Pada bagian *"Add a new sitemap"*, ketikkan: `sitemap.xml`  
   *(Sehingga URL lengkapnya menjadi `https://kata.jimkoto.my.id/sitemap.xml`)*.
3. Klik tombol **Submit**.
4. Status akan berubah menjadi **"Success"** hijau. Googlebot akan mulai merayapi seluruh glosarium istilah dan halaman fitur SEO secara berkala.

---

### 5. CHECKLIST SETELAH PENDAFTARAN (POST-VERIFICATION)

- [x] Sitemap `sitemap.xml` terkirim dan berstatus Success.
- [x] File `robots.txt` dapat diakses di `https://kata.jimkoto.my.id/robots.txt`.
- [x] Memeriksa menu **Coverage / Pages** setiap 3–7 hari untuk memastikan tidak ada kesalahan indeksasi.
- [x] Memeriksa menu **Enhancements > DefinedTerm / Schema** untuk memastikan Rich Snippets terdeteksi.

---
*Diterbitkan oleh Tim Teknis & SEO Jim Koto Pro (kata.jimkoto.my.id)*
