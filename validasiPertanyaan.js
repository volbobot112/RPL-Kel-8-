/**
 * Modul khusus validasi dan sanitasi untuk FR-03 (Ajukan Pertanyaan)
 * Menerapkan Single Responsibility Principle, DRY, dan camelCase.
 */

function cekTeksKosong(nilaiTeks) {
  return !nilaiTeks || nilaiTeks.trim().length === 0;
}

function sanitasiInputTeks(teksKotor) {
  // Mencegah injeksi tag HTML/Script (XSS) dan karakter SQL berbahaya
  return teksKotor
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/['";]/g, "");
}

function validasiFormPertanyaan(judulPertanyaan, isiPertanyaan, daftarTag) {
  if (cekTeksKosong(judulPertanyaan)) {
    throw new Error("Judul pertanyaan wajib diisi dan tidak boleh kosong.");
  }

  if (judulPertanyaan.trim().length < 5) {
    throw new Error("Judul pertanyaan minimal harus 5 karakter.");
  }

  if (cekTeksKosong(isiPertanyaan)) {
    throw new Error("Deskripsi kendala wajib diisi.");
  }

  if (daftarTag.length > 5) {
    throw new Error("Maksimal hanya diperbolehkan 5 tag per pertanyaan.");
  }

  return true;
}