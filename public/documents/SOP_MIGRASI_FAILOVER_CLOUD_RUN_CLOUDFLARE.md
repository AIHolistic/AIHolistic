# SOP PENANGANAN KRISIS SERVER DOWN & MIGRASI FAILOVER KETAHANAN TINGGI (HIGH AVAILABILITY)
## Strategi Pemulihan Instan `kata.jimkoto.my.id` & Portal Web Lainnya dari Server Tradisional ke Cloud Native

**Dokumen No:** SOP-HA-007  
**Versi:** 1.0.0  
**Tanggal Efektif:** 24 Juli 2026  

---

### 1. AKAR MASALAH: MENGAPA SERVER TRADISIONAL (SHARED HOSTING / CPANEL) TUMBANG?

Server hosting tradisional di shared hosting (seperti Hostinger, IDCloudHost, Domainesia):
1. **Resource Throttling (Batas CPU/RAM):** Shared hosting menggunakan *CloudLinux LVE limits*. Ketika ada lonjakan traffic, perayapan mesin pencari (Googlebot), atau kalkulasi AI dari Gemini, server akan menolak permintaan dengan status `503 Service Unavailable` atau `504 Gateway Timeout`.
2. **Keterbatasan Arsitektur cPanel:** cPanel/Apache tidak didesain secara optimal untuk aplikasi Node.js/TypeScript SSR, WebSocket, atau crawler AI terverifikasi yang membutuhkan pemrosesan asinkron.
3. **Single Point of Failure (SPOF):** Jika satu server cPanel mati/maintenance, seluruh domain dan subdomain di dalamnya mati total.

---

### 2. SOLUSI INSTAN DAN TERBATAS DOWNTIME (< 5 MENIT): STRATEGI CLOUDFLARE + GOOGLE CLOUD RUN

Akomoda Glosarium Digital (`kata.jimkoto.my.id`) telah dibangun menggunakan **Node.js + Express + Vite (Cloud Native)** yang berjalan di atas kontainer **Google Cloud Platform (Cloud Run)**.

Aplikasi ini **TIDAK MEMBUTUHKAN** cPanel / Apache Hostinger untuk berjalan! Anda hanya memerlukan pengelolaan DNS yang fleksibel.

---

### 3. LANGKAH-LANGKAH PENANGANAN FAILOVER (SITUS TAYANG LAGI SEGERA)

#### LANGKAH 1: Ambil Alih Pengelolaan DNS ke Cloudflare (100% GRATIS)
Meskipun penyedia hosting tradisional Anda down, registrar domain (tempat Anda membeli domain `jimkoto.my.id`) biasanya tetap aktif.

1. Buka akun **[Cloudflare.com](https://dash.cloudflare.com)** (Buat akun gratis jika belum ada).
2. Klik **Add a Site** -> Masukkan domain utama: `jimkoto.my.id`.
3. Pilih **Free Plan** ($0/bulan). Cloudflare akan memindai seluruh DNS record Anda.
4. Salin 2 Nameserver yang diberikan Cloudflare (Contoh: `alvin.ns.cloudflare.com` & `clara.ns.cloudflare.com`).
5. Masuk ke Panel Member Registrar Domain tempat Anda membeli `jimkoto.my.id`:
   - Buka menu **Name Servers / Custom DNS**.
   - Ganti Nameserver bawaan Hostinger/Domainesia dengan 2 Nameserver Cloudflare tadi.
   - Klik **Save**.

---

#### LANGKAH 2: Config DNS Subdomain `kata.jimkoto.my.id` ke Cloud Run
Domain utama (`jimkoto.my.id`) tetap dibiarkan mengarah ke server Node Anda yang ada. Kita **HANYA** mengonfigurasi subdomain `kata`:

1. Buka menu **DNS > Records** di dashboard Cloudflare domain `jimkoto.my.id`.
2. Biarkan Record `A` atau `CNAME` untuk **`@` (Root Domain)** tetap mengarah ke IP/Server Node Anda.
3. Tambahkan Record baru untuk subdomain `kata`:
   - **Type:** `CNAME`
   - **Name:** `kata`
   - **Target:** `ais-pre-mjh7anx7aqhqesbczh25v2-320659909126.asia-southeast1.run.app`
   - **Proxy Status:** `Proxied` (Awan Oranye Wajib Aktif)
   - **TTL:** `Auto`
4. Klik **Save**.

> 💡 **Penting mengenai Warning Cloudflare *"Visitors cannot reach jimkoto.my.id"*:***
> Jika warning tersebut muncul, itu hanya karena DNS record `@` milik domain utama belum diisi / IP server Node belum dimasukkan di DNS Cloudflare. Selama Record `A` untuk `@` sudah terisi mengarah ke IP server Node Anda, warning tersebut akan hilang dengan sendirinya dan domain utama tetap berjalan normal.

---

#### LANGKAH 3: ATASI ERROR GOOGLE 404 UNTUK `kata.jimkoto.my.id` (METODE CLOUDFLARE WORKERS - 100% BEBAS LOCK & GRATIS)

*Mengapa "Rewrite to" di Origin Rules terkunci (grayed out)?*  
Cloudflare saat ini membatasi opsi *Host Header Rewrite* di menu Origin Rules hanya untuk akun berbayar (Enterprise).

**SOLUSI TERBAIK & PASTI BERHASIL (CLOUDFLARE WORKERS - GRATIS 100.000 REQUEST/HARI):**

Cloudflare Workers memberikan akses gratis untuk mengubah header permintaan HTTP tanpa batasan paket. Ikuti 5 langkah sangat mudah ini (hanya butuh 2 menit):

---

##### LANGKAH-LANGKAH MEMBUAT WORKER PROXY:

1. **Buat Worker Baru:**
   - Di sidebar kiri Cloudflare, klik menu **Workers & Pages** (posisinya tepat di atas menu *Rules*).
   - Klik tombol **Create Application** -> pilih **Create Worker**.
   - Beri nama Worker, misal: `glosarium-proxy` -> Klik **Deploy**.

2. **Paste Skrip Proxy:**
   - Klik tombol **Edit Code**.
   - Hapus semua kode bawaan, lalu **kopipaste kode sederhana ini**:

```javascript
export default {
  async fetch(request) {
    const targetHost = 'ais-pre-mjh7anx7aqhqesbczh25v2-320659909126.asia-southeast1.run.app';
    const originUrl = new URL(request.url);

    // Target URL lengkap (Path + Query Parameters)
    const targetUrl = `https://${targetHost}${originUrl.pathname}${originUrl.search}`;

    // Buat Headers bersih (Whitelisting) agar GFE tidak mendeteksi X-Forwarded-Host kata.jimkoto.my.id
    const cleanHeaders = new Headers();
    const allowedHeaders = ['accept', 'accept-language', 'content-type', 'user-agent', 'cookie', 'authorization'];
    
    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        cleanHeaders.set(key, value);
      }
    }

    // Set Host Header wajib ke endpoint Google Cloud Run
    cleanHeaders.set('Host', targetHost);

    const init = {
      method: request.method,
      headers: cleanHeaders,
      redirect: 'follow'
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
      init.body = request.body;
    }

    const response = await fetch(targetUrl, init);

    // Buat response baru agar tidak ada pertentangan header CORS
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  }
};
```

3. **Simpan Worker:**
   - Klik **Save and Deploy** (di pojok kanan atas editor).

4. **Hubungkan Worker & ATUR URUTAN ROUTE (SANGAT PENTING!):**
   - Kembali ke dashboard domain `jimkoto.my.id` di Cloudflare.
   - Di sidebar kiri, buka menu **Workers Routes**.
   - Klik **Add Route**:
     * **Route:** `kata.jimkoto.my.id/*`
     * **Worker:** Pilih `glosarium-proxy`
     * Klik **Save**.
   - ⚠️ **MENGATASI BENTROKAN ROUTE (PENYEBAB 404):**
     * Karena Anda memiliki route `1. jimkoto.my.id/* -> seo-ai`, Cloudflare mengevaluasi route dari **paling atas ke bawah**.
     * **Solusi Wajib:** Geser/Tarik (Drag) atau ubah urutan route agar **`kata.jimkoto.my.id/*` berada di URUTAN PERTAMA (#1)** di atas `jimkoto.my.id/*`.
     * Dengan posisi #1, semua trafik ke `kata.jimkoto.my.id` akan diproses oleh `glosarium-proxy`, sedangkan trafik ke domain utama `jimkoto.my.id` tetap diproses oleh `seo-ai`.

---

> 🎉 **HASILNYA:** Selesai! Setelah `kata.jimkoto.my.id/*` dipindah ke Urutan #1, pengguna yang membuka **`https://kata.jimkoto.my.id`** akan langsung terhubung ke aplikasi Glosarium Digital tanpa terkena error 404 Google!

---

### 4. STRATEGI MITIGASI UNTUK SITUS-SITUS KAMI YANG LAINNYA

Untuk memastikan portal-portal web Anda yang lain tidak ikut mati saat shared hosting tradisional tumbang:

#### A. Situs Web Statis / Landing Page / SPA (React/Vue/HTML):
* **Pindahkan ke Vercel / Netlify / Cloudflare Pages (Gratis Unlimited Bandwidth)**
* **Keunggulan:** Bebas biaya server, SSL otomatis, dilayani dari 300+ Edge Data Center di seluruh dunia, garansi uptime 99.99%.

#### B. Situs Aplikasi Fullstack / AI Tools / Node.js (Seperti Akomoda):
* **Deploy ke Google Cloud Run / Railway / Render**
* **Keunggulan:** Auto-scale dari 0 hingga ribuan kontainer secara otomatis saat traffic meledak, dan mengecil kembali ke 0 saat sepi (sangat hemat biaya/bebas bayar saat tidak digunakan).

#### C. Situs WordPress / PHP Tradisional:
* Jika masih menggunakan WordPress PHP, aktifkan fitur **Cloudflare "Always Online"** dan pasang plugin **WP Super Cache / APO (Automatic Platform Optimization)** agar versi halaman tersimpan di CDN Cloudflare dan tetap bisa diakses pembaca meskipun server PHP Hostinger sedang down.

---

### 5. CHECKLIST PEMULIHAN KRISIS

- [x] Kontainer Akomoda Glosarium Digital aktif di Google Cloud Engine.
- [ ] Pindahkan Nameserver Domain `jimkoto.my.id` & `akomodanetwork.com` ke Cloudflare.
- [ ] Buat CNAME Record `kata` mengarah ke Google Cloud Run / Applet Endpoint.
- [ ] Aktifkan SSL/TLS Mode "Full (Strict)" di Cloudflare.
- [ ] Verifikasi situs tayang kembali melalui `https://akomodanetwork.com` dan `https://kata.jimkoto.my.id`.

---

### 6. PANDUAN REPOSITORY GITHUB: FOLDER & FILE YANG WAJIB DIMUAT

Apakah aplikasi Akomoda Glosarium Digital harus dimuat ke GitHub? **SANGAT DIREKOMENDASIKAN (WAJIB untuk Backup, Version Control, & Auto-Deployment CI/CD ke Cloud Run / Vercel).**

#### A. Folder & File WAJIB Dimuat ke GitHub (Committed):
1. `/src/` - Seluruh kode sumber aplikasi React/TypeScript (`App.tsx`, `main.tsx`, `types.ts`, folder `/src/components/`, `/src/assets/`, dll).
2. `/public/` - Asset statis (`favicon.ico`, `/public/documents/`, file SOP, logo, `robots.txt`, `sitemap.xml`).
3. `package.json` & `package-lock.json` - Definisi pustaka/dependensi Node.js.
4. `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js` - Konfigurasi build & styling.
5. `metadata.json` - Identitas metadata aplikasi.
6. `server.ts` (jika menggunakan custom Express server untuk API Gemini/Proxy).
7. `.env.example` - Template daftar variabel lingkungan (tanpa memasukkan API Key rahasia).
8. `README.md` - Dokumentasi cara menjalankan dan men-deploy proyek.

#### B. Folder & File SANGAT DILARANG / DI-ABAIKAN (Must be in `.gitignore`):
1. `node_modules/` - Ukurannya sangat besar (~200MB+) dan akan otomatis terinstal via `npm install` saat build CI/CD.
2. `dist/` atau `build/` - Folder hasil kompilasi yang dibentuk saat proses build di server.
3. `.env` atau `.env.local` - File yang berisi **GEMINI_API_KEY** atau rahasia lainnya agar tidak bocor ke publik.
4. `.DS_Store` / `.idea` / `.vscode` - File konfigurasi lokal milik sistem operasi atau IDE.

---

### 7. PANDUAN SETUP DOMAIN `akomodanetwork.com` DARI NAMESERVER WORDPRESS KE CLOUDFLARE

Saat ini domain `akomodanetwork.com` masih mengarahkan Nameservers (NS) ke WordPress (misal `ns1.wordpress.com`, `ns2.wordpress.com`). Berikut langkah-langkah memindahkannya agar terhubung ke Cloud Run & Cloudflare secara gratis & optimal:

#### METODE A: Migrasi Full Nameserver ke Cloudflare (SANGAT DIREKOMENDASIKAN)
1. **Buat Akun / Login ke Cloudflare Dashboard** (`dash.cloudflare.com`).
2. Klik **Add a Site** -> Masukkan `akomodanetwork.com`.
3. Pilih paket **Free** ($0). Cloudflare akan memindai DNS record lama Anda.
4. Cloudflare akan memberikan 2 buah Nameserver baru (contoh: `kristen.ns.cloudflare.com` & `mark.ns.cloudflare.com`).
5. **Ubah Nameserver di WordPress / Registrar Tempat Beli Domain:**
   - Masuk ke Dashboard WordPress.com (atau Registrar domain Anda seperti Namecheap/DynaDot/WordPress Domain Management).
   - Buka **Domains > akomodanetwork.com > Name Servers / DNS**.
   - Matikan toggle *"Use WordPress.com Name Servers"*.
   - Masukkan 2 Nameserver Cloudflare tadi.
   - Klik **Save**.
6. **Hubungkan Apex Domain `@` (`akomodanetwork.com`) ke Worker / Cloud Run:**
   - Di Cloudflare DNS menu `akomodanetwork.com`, tambahkan Record:
     * **Type:** `CNAME`
     * **Name:** `@` (atau `akomodanetwork.com`)
     * **Target:** `ais-pre-mjh7anx7aqhqesbczh25v2-320659909126.asia-southeast1.run.app`
     * **Proxy Status:** `Proxied` (Awan Oranye)
   - Tambahkan CNAME untuk `www`:
     * **Type:** `CNAME`
     * **Name:** `www`
     * **Target:** `@`
     * **Proxy Status:** `Proxied`
7. **Pasang Cloudflare Worker Proxy** (menggunakan skrip di Seksi 3) dan set Route `akomodanetwork.com/*` & `www.akomodanetwork.com/*` agar Host Header ter-override sempurna ke Cloud Run tanpa error 404 Google.

#### METODE B: Tanpa Ubah Nameserver (Gunakan DNS Manager WordPress.com)
Jika Anda belum ingin mengubah Nameserver dari WordPress.com:
1. Masuk ke Dashboard WordPress.com -> **Upgrades > Domains > akomodanetwork.com > DNS Records**.
2. Klik **Add a record**:
   - **Type:** `CNAME`
   - **Name:** `www` (atau `@` jika didukung oleh WordPress Custom CNAME)
   - **Target / Value:** `ais-pre-mjh7anx7aqhqesbczh25v2-320659909126.asia-southeast1.run.app`
3. Simpan perubahan. (Metode ini memiliki keterbatasan karena WordPress.com free/standard DNS tidak mendukung CNAME flattening pada Apex `@`, sehingga Metode A via Cloudflare jauh lebih direkomendasikan).

---

*Diterbitkan oleh Tim Infrastruktur Cloud & DevOps Akomoda (akomodanetwork.com & kata.jimkoto.my.id)*
