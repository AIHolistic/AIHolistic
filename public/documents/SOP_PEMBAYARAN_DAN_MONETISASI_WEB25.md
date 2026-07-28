# STANDAR OPERASIONAL PROSEDUR (SOP)
## Integrasi Pembayaran Fiat (Midtrans/QRIS) & Gateway Web3 Crypto

**Dokumen No:** SOP-AKOMODA-002  
**Versi:** 1.0.0  
**Tanggal Efektif:** 23 Juli 2026  

---

### 1. RUANG LINGKUP
SOP ini mengatur alur transaksi pembayaran kuota pencarian AI premium dan paket akses Web2.5.

---

### 2. METODE PEMBAYARAN FIAT (RUPIAH / USD)
1. **Pilihan Paket:**
   - Paket Tambahan: $2.99 / Rp 45.000 (50 pencarian AI tambahan).
   - Paket Unlimited Web2.5: $9.99 / Rp 150.000 (Akses tanpa batas + API Key).
2. **Gateway Provider:**
   - Midtrans / Xendit (untuk QRIS, BCA Virtual Account, Mandiri, GoPay, ShopeePay).
   - Stripe / PayPal (untuk Kartu Kredit Internasional).
3. **Verifikasi Otomatis:** Webhook notification dari Payment Gateway langsung memperbarui status kuota pengguna di local storage/database tanpa perlu upload bukti transfer manual.

---

### 3. METODE PEMBAYARAN CRYPTO WEB3
1. **Stellar XLM:** Transaksi instan via memotext ke wallet pengelola.
2. **Pi Network Wallet:** Integrasi Pi Browser SDK untuk pembayaran micro-pay di ekosistem Pi Pioneer.
3. **XEN Fair Mint Token:** Penerimaan pembayaran via smart contract EVM / Stellar.

---

### 4. REVENUE SHARING & SETTLEMENT
- Dana pembayaran Fiat ditarik setiap minggu ke rekening operasional perusahaan.
- Dana Crypto disimpan dalam multi-sig wallet untuk cadangan pengembangan infrastruktur.

---
*Akomoda Finance & Web3 Dept.*
