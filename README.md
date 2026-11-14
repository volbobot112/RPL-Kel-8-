# Implementasi FR-03 — Sistem Peer Tutor (Tanya Baris)

## 1. Identifikasi Functional Requirement (FR)
* **Kode & Deskripsi FR:** **FR-03** — Mengajukan pertanyaan dengan judul, isi, dan tag (opsional/fleksibel) oleh Mahasiswa Penanya (Tutee).
* **Keterkaitan Rancangan UTS:**
  * **Use Case:** `UC-01` (Ajukan Pertanyaan) dan Alur Alternatif `A1` (Data tidak lengkap).
  * **Activity Diagram:** Sub-bab `2.3.1 Fase Pencarian dan Pengajuan Pertanyaan`.
  * **Sequence Diagram:** Sub-bab `2.4.1 Pengajuan Pertanyaan`.
  * **ERD / Entitas:** Tabel `PERTANYAAN` (`id_pertanyaan`, `id_penanya`, `judul`, `isi`, `status`) dan relasi `PERTANYAAN_TAG`.
* **Alur Input - Proses - Output:**
  * **Input:** Judul pertanyaan (wajib), deskripsi kendala (wajib), tag (opsional), dan cuplikan kode (opsional).
  * **Proses:** Validasi kelengkapan data, sanitasi karakter berbahaya, pengaturan status awal `open` (Belum dijawab), serta penyimpanan ke state aplikasi.
  * **Output:** Pertanyaan baru dipublikasikan dan langsung ditampilkan di halaman detail.
* **Modul yang Dikembangkan:** `index.html`, `validasiPertanyaan.js`, `app.js`.

---

## 2. Dokumentasi Code Review & Refactoring

### Temuan 1: Pemisahan Kode (Modularity & Single Responsibility Principle)
* **Bagian Kode:** Struktur keseluruhan proyek (`PeerTutorPlatform.html` -> `index.html`, `validasiPertanyaan.js`, `app.js`).
* **Masalah:** Seluruh struktur HTML, CSS, logika aplikasi, dan validasi menumpuk dalam satu file monolitik sepanjang 600+ baris sehingga sulit dipelihara.
* **Perbaikan:** Memisahkan tampilan ke `index.html`, logika aplikasi ke `app.js`, dan aturan validasi/sanitasi ke modul khusus `validasiPertanyaan.js`.

**Before:**
```html
<!-- Seluruh kode CSS, HTML, dan JavaScript digabung dalam 1 file -->
<script>
  // 400+ baris kode tercampur
</script>
```

**After:**
```html
<script src="validasiPertanyaan.js"></script>
<script src="app.js"></script>
```

### Temuan 2: Penerapan Prinsip DRY pada Pengaturan Visual Tombol
* **Bagian Kode:** `app.js` — fungsi `syncSendButton()` dan `syncSubmitButton()`
* **Masalah:** Kode untuk mengatur warna latar, warna teks, dan kursor tombol ditulis berulang kali pada dua fungsi terpisah.
* **Perbaikan:** Menggabungkan logika tersebut ke dalam satu fungsi reusable `aturTampilanTombol()`.

**Before:**
```javascript
function syncSendButton() {
  const btn = document.querySelector('[data-action="submit-answer"]');
  if (!btn) return;
  const canSend = state.answerBody.trim().length > 0;
  btn.disabled = !canSend;
  btn.style.background = canSend ? "var(--accent)" : "var(--panelAlt)";
  btn.style.color = canSend ? "var(--accentText)" : "var(--textFaint)";
}
```

**After:**
```javascript
function aturTampilanTombol(selectorTombol, kondisiAktif, kunciDisabled = false) {
  const tombol = document.querySelector(selectorTombol);
  if (!tombol) return;
  if (kunciDisabled) tombol.disabled = !kondisiAktif;
  tombol.style.background = kondisiAktif ? "var(--accent)" : "var(--panelAlt)";
  tombol.style.color = kondisiAktif ? "var(--accentText)" : "var(--textFaint)";
}
```

### Temuan 3: Penambahan Input Validation, Sanitasi & Error Handling (`try-catch`)
* **Bagian Kode:** `app.js` — blok `case "submit-question"`
* **Masalah:** Validasi sebelumnya hanya mengecek panjang teks tanpa pesan error yang informatif, tidak ada sanitasi karakter berbahaya, dan belum menggunakan blok `try-catch`.
* **Perbaikan:** Menambahkan fungsi `validasiFormPertanyaan()` dan `sanitasiInputTeks()` yang dibungkus dalam blok `try-catch`.

**Before:**
```javascript
case "submit-question": {
  const a = state.ask;
  if (!a.title.trim() || !a.body.trim()) break;
  // langsung simpan tanpa sanitasi & error handling
}
```

**After:**
```javascript
case "submit-question": {
  try {
    const formData = appState.ask;
    const daftarTagBersih = formData.tags.split(",").map(t => sanitasiInputTeks(t)).filter(Boolean);
    validasiFormPertanyaan(formData.title, formData.body, daftarTagBersih);
    // simpan pertanyaanBaru...
  } catch (errorValidasi) {
    alert(`[VALIDASI GAGAL] ${errorValidasi.message}`);
  }
  break;
}
```

---

## 3. Tabel Hasil Pengujian (Testing)

| Kode FR | Skenario & Langkah Pengujian (Steps) | Status |
| :--- | :--- | :---: |
| **FR-03** | **Normal Case:** Mengisi judul valid, deskripsi valid, dan tag `"python, dasar"`, lalu klik Kirim. Pertanyaan tersimpan dengan status `open`. | ✅ |
| **FR-03** | **Invalid Input:** Mengosongkan kolom judul atau deskripsi lalu klik Kirim. Sistem menolak dan menampilkan alert error validasi. | ✅ |
| **FR-03** | **Edge Case:** Memasukkan karakter SQL/XSS Injection (`' OR '1'='1; <script>alert(1)</script>`) pada judul. Sistem membersihkan karakter berbahaya dan tidak mengalami crash. | ✅ |

---

## 4. Kontribusi Anggota Kelompok 8
1. **(1251420005) Muhammad Alir Zikri:** Pemisahan modul (`validasiPertanyaan.js`), implementasi validasi & sanitasi FR-03.
2. **(1251420145) Muhammad Rafi Sya'bani:** Refactoring struktur `app.js`, penerapan prinsip DRY & `try-catch`.
3. **(1251420006) Wildan Kurniawan:** Pengujian fungsional (Normal, Invalid, Edge Case).
4. **(1251420020) Muhammad Haikal Fabian:** Penyusunan dokumentasi keterlacakan FR dan laporan `README.md`.