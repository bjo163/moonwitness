# Batas service Cosmic pada implementasi Native Moon ORM

Cosmic adalah service enrichment opsional. Native Moon ORM + PostgreSQL 18 + pgvector dapat membuat, menilai, mereview, dan menyimpan assessment inti Mizan tanpa Cosmic.

## Mode operasi

`MIZAN_MODE=local` menjalankan rubrik Mizan 17/21 native di Moon ORM dan tidak memanggil jaringan.

`MIZAN_MODE=hybrid` menjalankan rubrik inti lokal, lalu mengantrekan enrichment Cosmic jika `COSMIC_BASE_URL` dan kredensial service tersedia. Kegagalan Cosmic tidak mengubah hasil inti menjadi gagal, nol, atau accepted; run enrichment diberi status failed.

Cosmic tidak menjadi sumber persistence Moon ORM, tidak mengubah `legal_status`, dan tidak dapat mengubah review. Setiap hasil disimpan sebagai `moon.witness.engine.result` dengan `engine_key=cosmic.mizan` dan versi yang dipatok.

## Kontrak yang dibutuhkan

Moon ORM mengirim request terversi yang berisi `requestKey`, `assessmentId`, `inputHash`, `sourceRevisionSnapshot`, `semantic` (RGBL), `actionGateVector`, `impactVector`, `scale`, `causality`, `domainVector`, `evidenceCount`, `confidence`, dan `evidenceQuality`.

Cosmic mengembalikan `protocol`, `version`, `modelOnly`, `divineVerdict`, `assessment`, `trace`, `semantic`, `scaleFactor`, dan provenance references. Response tidak dianggap sebagai keputusan Mizan 17/21. Contract validator menolak response tanpa `modelOnly=true`, `divineVerdict=false`, version, atau input hash yang cocok.

Pada deployment saat ini, endpoint Cosmic yang diperiksa adalah `POST /api/v1/mizan` pada repo `X:/REPO/cosmic`. Endpoint tersebut menjalankan `evaluateMizan` RGBL/impact, bukan rubrik General/Prophetic dari `mizan/app.js`. Adapter tidak boleh meneruskan payload weighted assessment lalu menganggap response-nya setara.

## Urutan deployment

1. Migrasikan database PostgreSQL 18 + pgvector dengan schema Moon ORM (moon_witness, moon_mizan).
2. Jalankan mode `local`; verifikasi method profile, filter, assessment dan review.
3. Deploy Cosmic pada endpoint internal yang hanya dapat diakses integration user.
4. Daftarkan URL, service credential, protocol version dan Cosmic commit/version di konfigurasi server.
5. Aktifkan mode `hybrid` untuk satu assessment uji; cek input/output hash dan source revision.
6. Tinjau hasil Cosmic sebagai enrichment; hanya reviewer manusia yang dapat menerima assessment.

Cosmic wajib tersedia hanya untuk fitur RGBL, native Revelation binding, magnitude, dan impact enrichment. Ia bukan dependency instalasi addon dan bukan syarat agar Moon ORM tetap berfungsi.

## Endpoint evaluasi Native

`POST /api/mz/assessment/:id/evaluate` menjalankan evaluasi native Moon ORM. Body minimal harus memuat `request_key`, `assessment_id` yang sama dengan `:id`, `profile_code`, `profile_version`, `source_revision`, seluruh `lines`, `general_sufficient`, `balance_state`, dan `reference_weight`.

Request dengan `request_key` yang sama dan `input_hash` sama dikembalikan sebagai replay. Key yang sama dengan input berbeda ditolak sebagai `IDEMPOTENCY_CONFLICT`. Profile, contract, atau source revision yang tidak cocok ditolak sebagai stale sebelum engine run dibuat.
