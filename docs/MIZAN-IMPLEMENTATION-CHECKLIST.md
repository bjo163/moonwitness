# Checklist implementasi Revelation–Mizan

Status awal: **belum dimulai**  
Tanggal: 6 September 2026  
Dokumen acuan: [MIZAN-REVIEW.md](MIZAN-REVIEW.md), [MIZAN-ODOO-DRAFT.md](MIZAN-ODOO-DRAFT.md)

Gunakan checklist ini sebagai urutan kerja. Item tidak boleh ditandai selesai hanya karena model atau view sudah dibuat; setiap item perlu bukti tes atau review yang disebutkan.

## Tahap 0 — Kunci metode dan kontrak

- [ ] Tetapkan `mizan_weighted@1.0.0` sebagai profil resmi pertama.
- [ ] Bekukan empat primary filter dengan `criterion_code` dan definisi kanonik.
- [ ] Bekukan empat secondary filter, termasuk aturan `N/A` yang sesuai metode.
- [ ] Bekukan sepuluh Power Right dan tujuh Power Left beserta unit skor, anchor, dan rumus agregasi.
- [ ] Putuskan apakah skor per kriteria berupa integer atau basis points; samakan engine TS, JSON agent, kontrak API, dan Odoo.
- [ ] Tulis tabel kompatibilitas `mizan/app.js` versus `@moon/mizan` untuk: primary fail, secondary N/A, reference weight nol, preview method, dan rating.
- [ ] Tegaskan perbedaan `eligible_for_prophetic` dan `final_method`.
- [ ] Tetapkan source policy terpisah dari method profile: Quran primary; Tawrat/Zabur/Injil sebagai saluran yang diizinkan sesuai policy; Hadith, tafsir, hukum positif, berita, dan riset tidak otomatis menjadi Revelation.
- [ ] Tetapkan versi kontrak: request, response, source policy, method profile, semantic schema, dan engine version.
- [ ] Tambahkan test kontrak untuk semua keputusan di atas.

**Selesai jika:** satu fixture yang sama menghasilkan keputusan yang sama di agent adapter, `@moon/mizan`, dan service; perbedaan legacy tercatat sebagai metadata, bukan diam-diam disamakan.

## Tahap 1 — Perbaiki canonical engine sebelum Odoo

- [ ] Ubah preview Mizan agar mengembalikan status kelayakan, bukan menyatakan final `prophetic` tanpa reference weight dan value.
- [ ] Perketat validator JSON agent: tipe, batas bawah/atas, nama kriteria, status filter, `total_max`, persamaan total, dan prasyarat Prophetic.
- [ ] Validasi primary/secondary berdasarkan criterion code + profile version, bukan count/position saja.
- [ ] Pastikan `unknown` dan `N/A` tidak dikonversi menjadi `pass` atau nol.
- [ ] Pastikan primary fail menghasilkan `score_available=false`; simpan total legacy nol hanya sebagai raw output bila diperlukan.
- [ ] Pisahkan `source_verified`, `claim_supported`, `interpretation_reviewed`, dan `engine_status`.
- [ ] Pastikan reference weight hanya diterima jika source policy eligible, reference terverifikasi, relevan, dan memberi alasan kontribusi.
- [ ] Definisikan status claim-scoped untuk `RESERVED`; jangan memakai keyword global sebagai keputusan atas seluruh teks.
- [ ] Tambahkan test negatif untuk payload agent dengan skor negatif, total tidak konsisten, reference palsu, dan klaim reserved.
- [ ] Tetapkan adapter hasil Cosmic: RGBL, magnitude, 9 action gates, impact vector, 15 scale inputs, dan Quranic status disimpan sebagai hasil analitis terpisah.
- [ ] Selaraskan tipe `band` dan ambang severity Cosmic yang sekarang berbeda.

**Selesai jika:** engine menolak input tidak sah, mengembalikan status yang eksplisit saat bukti kurang, dan tidak mengubah skor Witness, Cosmic, atau Mizan menjadi satu angka kebenaran.

## Tahap 2 — Paritas Witness Odoo

- [ ] Tambahkan addon `moon_mizan` dengan dependency `moon_witness`.
- [ ] Tambahkan source policy Odoo yang merujuk kebijakan Witness, bukan selection bebas.
- [ ] Tambahkan assertion/evidence relation yang setara dengan TS: assertion, content/entity/passage, provenance, relation, polarity, source revision.
- [ ] Tambahkan `quote_type`, `source_policy_key/version`, `authority_role`, `independence_key`, dan retrieval trace.
- [ ] Pertahankan snapshot/revision; teks yang sudah direview tidak boleh berubah karena import berikutnya.
- [ ] Reuse `moon.witness.engine.run` dan `moon.witness.engine.result`; jangan membuat run store Mizan kedua.
- [ ] Tambahkan field relasi `mizan_assessment_id` dan payload/hash/version secara aditif pada engine run/result.
- [ ] Hubungkan klaim Mizan ke `moon.witness.assertion`; jangan membuat graph kebenaran kedua.
- [ ] Selaraskan field snake_case Odoo dengan mapping camelCase TS secara eksplisit.
- [ ] Tambahkan constraint company, revision, source, provenance, dan parent/child consistency.

**Selesai jika:** satu claim dapat ditelusuri dari assessment → assertion → evidence → passage/content → provenance → source/artifact/snapshot.

## Tahap 3 — Addon dan keamanan Odoo

- [ ] Buat `__manifest__.py`, `__init__.py`, models, views, data, security, dan tests untuk `moon_mizan`.
- [ ] Implementasikan model: category, jurisdiction, method profile, criterion, regulation, article, case, assessment, claim, reference, assessment line, review.
- [ ] Gunakan `moon.external.identity` untuk external key Cosmic/Mizan/legacy.
- [ ] Tambahkan state machine server-side: draft → evaluating → in_review → reviewed/superseded.
- [ ] Bekukan profile published, regulation reviewed, assessment reviewed, claim, reference, line, dan run yang sudah selesai.
- [ ] Tolak review oleh assessor yang sama jika conflict-of-interest rule mengharuskannya.
- [ ] Buat groups: reader, assessor, reviewer, manager, integration.
- [ ] Tambahkan access CSV dan record rules company/source/review/export.
- [ ] Pastikan integration user tidak dapat menerima review atau mengubah legal status enacted.
- [ ] Pastikan `legal_status` hanya berubah melalui otoritas dan provenance manusia.
- [ ] Tambahkan audit trail untuk perubahan penting dan aksi Evaluate/Review/Revision.
- [ ] Hindari default yang menyamar sebagai bukti: nilai evidence, tauhid gap, causality, dan reviewed harus unknown/unreviewed sampai ada sumber.

**Selesai jika:** RPC/ORM langsung tetap memblokir perubahan yang tidak sah walaupun view atau tombol dilewati.

## Tahap 4 — Integrasi API dan job

- [ ] Tambahkan model mapping `mz.*` pada jalur Odoo REST/bridge yang canonical.
- [ ] Definisikan POST evaluate di `@moon/protocol` sebelum route diaktifkan.
- [ ] Tambahkan service evaluasi di `@moon/mizan`; server hanya menangani transport dan auth.
- [ ] Validasi ulang input dan relasi di server; jangan percaya agregat score dari client.
- [ ] Buat `request_key` idempotent; key sama dengan input hash berbeda harus ditolak.
- [ ] Bekukan input snapshot sebelum job dikirim setelah transaksi selesai.
- [ ] Tangani queued/running/succeeded/failed/stale; timeout tidak menjadi skor nol.
- [ ] Tolak hasil untuk profile/version/input revision yang stale.
- [ ] Simpan engine version, contract version, profile hash, input hash, output hash, Cosmic version, dan source revision snapshot.
- [ ] Pastikan retry memakai request key yang sama dan tidak menggandakan result.
- [ ] Uji Odoo-only mode tanpa fallback diam-diam ke ORM lama.

**Selesai jika:** evaluasi dapat diulang secara deterministik untuk input dan source revision yang sama, atau gagal dengan alasan yang bisa diaudit.

## Tahap 5 — Migrasi data lama

- [ ] Inventaris seluruh `mz.case`, `mz.assessment`, `mz.filter`, dan `mz.reference` lama.
- [ ] Buat mapping external identity `(provider, model, external_key)` yang idempotent.
- [ ] Simpan raw payload, origin repo, commit, path, checksum, adapter version, dan warning.
- [ ] Mapping verse ke passage/provenance dilakukan eksplisit; unresolved masuk antrean, bukan verified.
- [ ] Tandai data lama tanpa profile/version/claim detail sebagai `imported_legacy`.
- [ ] Jangan menaikkan legacy `isVerified=true` menjadi source verified tanpa pemeriksaan Witness.
- [ ] Jangan mengganti reference/filter demo dengan nama baru tanpa menyimpan nilai asal.
- [ ] Rekonsiliasi jumlah record, relasi, status, dan total sebelum cutover.
- [ ] Jalankan migrasi dua kali dan pastikan tidak ada duplikasi.
- [ ] Simpan laporan unresolved dan keputusan manual.

**Selesai jika:** migrasi kedua menghasilkan nol duplikasi dan setiap record yang belum dapat dipetakan tetap terlihat sebagai unresolved.

## Tahap 6 — UI workflow

- [ ] Tambahkan menu Regulations, Cases, Assessments, Reviews, dan Configuration.
- [ ] Form assessment menampilkan profil, revisi, claims, evidence pro/kontra, filter, skor, status epistemik, limitation, dan review.
- [ ] Tampilkan `score_available`, `score_max`, profile/version, dan alasan; jangan tampilkan skor sebagai persentase kebenaran.
- [ ] Tampilkan unknown, provisional, insufficient evidence, reserved, blocked, dan deferred dengan teks jelas.
- [ ] Tombol Evaluate/Retry/Submit/Accept/Request changes/Create revision mengikuti state dan role.
- [ ] Sediakan tautan provenance dekat teks sumber yang dirujuk.
- [ ] Jangan tampilkan klaim “divine verdict”, keputusan akhirat, atau kesempurnaan hukum.
- [ ] Pastikan keyboard navigation, label field, focus state, dan layout Arabic reading tetap layak.

**Selesai jika:** assessor dapat memahami alasan dan keterbatasan hasil tanpa membuka log internal atau chain-of-thought.

## Tahap 7 — Integrasi Cosmic, Myth, Disaster, dan AI

- [ ] Tambahkan adapter Cosmic hanya setelah contract Mizan stabil.
- [ ] Simpan raw RGBL dan magnitude sebagai engine result berversi dengan `modelOnly=true` dan `divineVerdict=false`.
- [ ] Simpan action gates sebagai kanal konteks; jangan menyebutnya izin tindakan bila rumus belum memakai gates.
- [ ] Jangan menggabungkan 13 impact axes dengan 15 scale dimensions.
- [ ] Hubungkan Myth/Disaster melalui addon opsional dan source provenance.
- [ ] Hapus default evidence/review/cause yang menimbulkan verifikasi semu.
- [ ] AI hanya mengusulkan claim/reference/reason; AI tidak memverifikasi sumber, menerima review, atau mengubah enacted.
- [ ] Simpan model, prompt version, provider, dan run metadata bila AI dipakai.

**Selesai jika:** hasil Cosmic, Myth, Disaster, dan AI dapat dibedakan dari hasil Mizan dan tidak memberi kewenangan normatif otomatis.

## Tahap 8 — Gate release

- [ ] Test engine Mizan dan contract.
- [ ] Test Witness scoring, provenance, conflict, source policy, dan replay.
- [ ] Test Odoo models, transaction rollback, ACL, record rules, immutability, dan company isolation.
- [ ] Test bridge session/API/idempotency/stale result.
- [ ] Test migrasi idempotent dan unresolved handling.
- [ ] Jalankan `node docs/mizan-review-probes.mjs` dan perbarui temuan setelah perbaikan.
- [ ] Jalankan `node scripts/audit-rules.mjs`.
- [ ] Jalankan `pnpm test:scripts` dengan dependency state yang bersih.
- [ ] Jalankan test aplikasi yang relevan dan catat versi Node/pnpm/Odoo/database.
- [ ] Review manual oleh pemilik metode, pemilik Witness, pemilik Odoo, dan reviewer domain.
- [ ] Publish profile hanya setelah semua gate P1 ditutup atau diberi pengecualian tertulis.

**Selesai jika:** hasil release memiliki bukti test, hash profile/contract, daftar unresolved, dan sign-off manusia. Checklist selesai tidak berarti metode menjadi hukum ilahi atau putusan legal otomatis.

## Urutan commit yang disarankan

1. `docs: freeze mizan method and contract`
2. `mizan: align validator and criterion identities`
3. `witness: add odoo source policy and assertion evidence parity`
4. `moon_mizan: add models acl and immutable workflow`
5. `api: add versioned mizan evaluate contract and run adapter`
6. `migration: import legacy mizan with provenance`
7. `ui: add regulation case assessment review workflow`
8. `integration: add cosmic analytical result adapter`
9. `tests: certify mizan odoo and end to end gates`

## Catatan keputusan awal

- Jangan membangun `moon_mizan` dengan model `evidence` kedua; bukti canonical tetap milik Witness.
- Jangan memindahkan ownership ke Odoo sebelum mapping `mz.*` dan adapter EngineRunStore siap.
- Jangan memakai `isVerified`, `confidence`, atau `score` dari input eksternal tanpa validasi source policy dan provenance.
- Jangan mengubah angka 17/21, urutan Prophetic, atau filter hanya melalui UI; perubahan metode harus membuat profile/version baru.

## Verification log (6 September 2026)

- Core tests: 5 suites, 24 tests passed.
- API health: HTTP 200, PostgreSQL connected.
- Authenticated Mizan evaluate: Odoo-native `general_limited`, fail-closed limitation returned.
- Idempotency replay verified; changed payload rejected with `IDEMPOTENCY_CONFLICT`.
- Mismatched source revision rejected with `STALE_SOURCE_REVISION`.
- `@moon/server` rebuilt after route addition; endpoint auth guard verified.
- Odoo addon Python compile: passed; database module `moon_mizan=installed`.
- Odoo registry contains assessment, reference, engine run, and engine result models; ACL rows present.
- Odoo UI smoke metadata: 5 Mizan menus present; 158 addon views registered; module installed.
