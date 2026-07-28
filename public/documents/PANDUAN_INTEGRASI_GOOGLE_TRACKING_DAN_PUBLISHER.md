# PANDUAN INTEGRASI TRACKING & PUBLISHER TOOLS
## Google Analytics (GA4), GTM, AdSense & Google Publisher Center
### Akomoda Glosarium Digital (kata.jimkoto.my.id)

**Dokumen No:** SEO-TRACK-006  
**Versi:** 1.0.0  
**Tanggal Efektif:** 23 Juli 2026  

---

### 1. APAKAH BISA DISISIPKAN SERTA APA SAJA MANFAATNYA?

**Jawabannya: YA, SANGAT BISA dan SANGAT DIREKOMENDASIKAN.**

Menyisipkan alat pelacak (*tracking tools*) dan alat penerbitan (*publisher tools*) pada **Akomoda Glosarium Digital (`kata.jimkoto.my.id`)** akan mengubah portal Anda dari sekadar alat web biasa menjadi **aset digital bisnis bermonetisasi tinggi**.

---

### 2. DOKUMENTASI LENGKAP MASING-MASING TOOL & CARA PEMASANGAN

#### A. Google Analytics 4 (GA4) — Pelacakan Lalu Lintas & Perilaku Pengunjung
* **Fungsi:** Mengetahui jumlah pengunjung aktif harian/bulanan, durasi membaca kata glosarium, asal negara/kota, kata kunci pencarian populer di dalam situs, serta pelacakan tombol donasi/pembelian kuota.
* **Cara Pemasangan di `<head>` file `index.html`:**
```html
<!-- Google tag (gtag.js) GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

#### B. Google Tag Manager (GTM) — Wadah Sentral Pengelolaan Tag (Sangat Direkomendasikan)
* **Fungsi:** Tempat pengelolaan terpusat seluruh skrip (GA4, Facebook Pixel, TikTok Pixel, Hotjar). Anda cukup memasang 1 kode GTM di `index.html`, lalu menambah pelacak baru di dashboard GTM tanpa harus menyentuh kode aplikasi lagi.
* **Kode Head (di `<head>`):**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'l=' +l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

---

#### C. Google AdSense — Monetisasi Pasif Iklan Banner & Auto Ads
* **Fungsi:** Menampilkan iklan banner otomatis pada artikel glosarium dan laporan SEO. Setiap kali ada pengunjung yang melihat (*impression*) atau mengklik iklan, Anda mendapatkan penghasilan rutin (*passive income*).
* **Kode AdSense Auto Ads (di `<head>`):**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

---

#### D. Google Publisher Center (Google News & Discover) — Organik Traffic Raksasa
* **Fungsi:** Mendaftarkan `kata.jimkoto.my.id` ke **Google News** dan **Google Discover**. Saat pengguna membuka Google News App atau rekomendasi berita di Android, artikel/glosarium terverifikasi Anda berpeluang muncul secara masif di halaman depan Google.
* **Langkah Pendaftaran:**
  1. Buka **[Google Publisher Center](https://publishercenter.google.com)**.
  2. Klik **Add publication** -> Masukkan nama: `Akomoda Glosarium Digital`.
  3. Masukkan domain: `kata.jimkoto.my.id`.
  4. Masukkan URL RSS Feed / Sitemap: `https://kata.jimkoto.my.id/sitemap.xml`.
  5. Unggah Logo & Square Icon (`/src/assets/images/akomoda_logo_1784806358181.jpg`).
  6. Kirimkan untuk peninjauan (*Submit for Review*).

---

### 3. STRATEGI MENGELOLA BANYAK AKUN GMAIL (PENGATURAN AKSES & OWNER)

Jika Anda memiliki beberapa akun Gmail (misal: Gmail Hosting/Domain, Gmail API Key Gemini, dan Gmail Pribadi):

1. **Gunakan 1 Gmail Master sebagai "Owner Utama":**  
   Daftarkan GSC, GA4, AdSense, dan GTM menggunakan akun Gmail utama yang paling sering Anda gunakan untuk operasional harian.
2. **Gunakan Fitur "Grant Access / User Permissions":**  
   Jika sebuah properti sudah terlanjur dibuat di Gmail B, Anda **TIDAK PERLU** membuat ulang. Cukup masuk ke akun Gmail B -> Pengaturan User Management -> Tambahkan Gmail Utama A sebagai **"Full Owner / Administrator"**.
3. **Manfaat Gabung 1 Dashboard:**  
   Dengan menghubungkan GA4 dan GSC ke 1 Gmail, Anda bisa menghubungkan kedua produk tersebut (*Link Google Analytics to Search Console*), sehingga laporan kata kunci Google Search Console bisa langsung terbaca di dalam laporan Google Analytics 4.

---

### 4. SUMMARY / CHECKLIST PENYIAPAN

- [x] Menyediakan berkas SOP dan panduan teknis pelacak di folder `/documents`.
- [ ] Memasang Kode GA4 (`G-XXXXXXXX`) atau GTM (`GTM-XXXXXX`) pada `index.html`.
- [ ] Menghubungkan Google Search Console dengan Google Analytics 4.
- [ ] Mengajukan situs ke Google AdSense & Google Publisher Center.

---
*Diterbitkan oleh Tim Teknis & Digital Marketing Jim Koto Pro (kata.jimkoto.my.id)*
