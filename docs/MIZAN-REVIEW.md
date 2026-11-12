# Archived historical review: Revelation–Mizan

> Superseded as an implementation authority on November 13, 2026. This review
> records observations from September 6, 2026 against a local working tree and
> is not deployment certification. Use `packages/moon-mizan/src/engine.ts`,
> its tests, and `packages/moon-protocol/src/contracts/mizan.ts` for current
> behavior and limits. Current bounds are Power Right 10, Power Left 7,
> General maximum 17, and Prophetic reference contribution maximum 4. The
> preview candidate is not the final method.

6 September 2026. Review terhadap working tree lokal, bukan sertifikasi deployment.

## Kesimpulan

Asas yang konsisten dengan repo adalah: kebenaran menjadi orientasi, sumber menentukan batas otoritas, bukti menentukan kecukupan, metode memberi penilaian yang dapat diperiksa, manusia mempertanggungjawabkan tindakan. Ada dasar implementasi nyata untuk ini. Namun proposal awal menyatukan beberapa metode yang berbeda seolah satu engine, sementara draft pertama menambahkan perubahan metode yang belum beralasan.

Pertahankan **General first → Prophetic only when required → maksimum 17/21 → rating maksimum 4,5** dari agent asli. Wahyu sebagai orientasi dasar tidak mengharuskan setiap kasus menambah bobot referensi. General-first dapat dipahami sebagai disiplin untuk tidak memaksa penggunaan referensi ketika penilaian umum sudah cukup. Penafsiran ini kompatibel dengan kode, bukan perubahan terhadap rumusnya.

Prioritas implementasi adalah menyamakan kontrak, identitas sumber dan status; bukan memperbanyak tabel atau menyatukan semua skor.

## Cakupan dan batas pemeriksaan

- Inventaris dan pencarian lintas MoonWitness: packages, apps, docs, seeds, tests, custom Odoo addons. Inventaris ekstensi TS/TSX/Python/MJS di luar enterprise vendor menemukan sekitar 1.200 file saat pemeriksaan.
- Pembacaan mendalam: seluruh engine/model/routes/demo Mizan; Witness source policy, scoring, engine runtime/evidence/store, importer; bridge Odoo dan REST/bootstrap; custom Witness/Myth/Disaster; konsumen UI Mizan; kontrak terkait; CAB dan Khidra sebagai jalur integrasi pendukung.
- Repo tambahan yang memang disebut konsep: `X:/REPO/mizan/app.js`; `X:/REPO/cosmic` native binding, magnitude, source policy, registry, Mizan engine/contract/route, justice analyzer/workflow dan tests; ADR ownership `moonwitness-corpus`.
- Cosmic local branch `dev`, HEAD `819f7f44426c3f108f8c1aebf927b12a96843d70`. Pemeriksaan memakai isi working tree; HEAD saja tidak membuktikan seluruh file identik dengan commit itu.
- Tidak membaca setiap file vendor enterprise, seluruh corpus baris demi baris, atau repo lain yang tidak terkait di X:/REPO. Tidak menjalankan AI berbayar, mengubah database, menguji ACL live, atau mengklaim integrasi Odoo sudah berjalan.

Fingerprint SHA256 sumber utama:

| File | SHA256 |
|---|---|
| moonwitness/packages/moon-mizan/src/engine.ts | 8EED5111BEF3C3397A5CF705E7467A8D4E293C9F6853102AEF25EA5206D2EB72 |
| mizan/app.js | A4D9D8EFC6B3829A093397579AAFBBE0399D04907E9D56A15814B041F9F45BF4 |
| cosmic/packages/mizan-engine/src/index.ts | DE93D23CC9BE234C89B00236ED377BAAB61296669C683772958ECF732B6723CC |

## Peta metode yang benar-benar ada

| Komponen | Yang dikerjakan | Bukan hasilnya |
|---|---|---|
| mizan/app.js | Prompt penilaian dua tingkat, JSON dan validator lokal | Verifikasi fakta/sumber independen; API Odoo |
| @moon/mizan | Pemilihan metode dan validasi agregat 10+7+4; 4 model operasional | Evaluasi otomatis kualitas tiap kriteria dari bukti |
| Cosmic Revelation binding | Mencari teks via anchor bahasa, menentukan arah dari marker/graph | Pembuktian lengkap semua tafsir atau fakta kejadian |
| Cosmic magnitude/Mizan | Rumus struktural, RGBL, impact, responsibility dan angka analitis | Rubrik General/Prophetic 17/21 |
| Cosmic Quranic Mizan | Status epistemik analitis menurut input, coverage, confidence dan konflik | Verifikasi sumber mandiri atau keputusan gaib |
| Cosmic justice | Pemilihan contoh aturan dari registry berdasar action/yurisdiksi, workflow demonstratif | Engine regulasi lengkap atau otorisasi pengadilan |
| Witness | Sumber/provenance, authority separation, temuan, konflik, sembilan profil skor dan replay | Satu skor kebenaran universal |
| Odoo custom addons | Penyimpanan dan form operasional | Paritas otomatis dengan seluruh model/aturan TS |

Witness `services/scoring.ts` sudah memiliki source_reliability, relation_confidence, research_hypothesis, figure_identity, tradition_transmission, hadith_analysis, lexical_match, concept_evidence dan cross_scripture. Skala 0–100/basis points dari profil ini tidak boleh dijumlahkan dengan 17/21 Mizan atau accountability Cosmic.

## Temuan prioritas

### 1. [P1] Filter demo berbeda, tetapi finalizer hanya menghitung jumlah/posisi

`packages/moon-mizan/src/demo-data.ts:91` dan `:109` menanam empat primary dan secondary dengan label lain dari konstanta engine. Baris diberi yes dan referensi diberi isVerified=true (`:133`) tanpa proses verifikasi sumber. `models/mz-assessment.ts:73` memeriksa count=4, posisi unik dan semua yes; tidak memeriksa code/identitas kriteria kanonik.

Akibat yang dapat disimpulkan dari jalur kode: kumpulan pertanyaan yang salah bisa dianggap memenuhi empat filter resmi. Ini pelanggaran metode yang lebih mendasar daripada perbedaan bobot. Gunakan criterion code/version dan seed yang identik; data demo tidak memperoleh verifikasi manusia secara otomatis. Belum diuji terhadap database live.

### 2. [P1] Preview metode berbeda dari validasi hasil akhir

`engine.ts` chooseMethod memakai tiga boolean. Dengan generalSufficient=false, balanceSatisfied=true, internalReferenceVerified=true, preview menyatakan prophetic. validateAssessment dengan input sama dan referenceWeight=0 menyatakan general_limited. Perbedaan direproduksi oleh probe.

UI `apps/web/views/analytics/views/mizan-assessment-view.tsx` memanggil preview tersebut dari tiga toggle; ini simulasi eligibilitas, bukan assessment bukti lengkap. Perbaikan: namai preview eligible_for_prophetic, atau gunakan satu decision service yang membedakan kandidat dan keputusan akhir. Jangan mengubah hasil historical tanpa versi.

### 3. [P1] Validator agent belum menegakkan seluruh prompt

`X:/REPO/mizan/app.js` validateResult memeriksa panjang array dan beberapa batas atas, tetapi tidak menegakkan semua tipe, batas bawah, identitas item, konsistensi status dan persamaan untuk setiap cabang. Probe dengan GENERAL_LIMITED, skor -999, rating -1, total_max=999 dan filter FAIL menghasilkan errors=[].

Prompt yang baik tidak menggantikan validasi. Adapter harus memakai schema ketat dan validator domain setelah JSON parsing, sebelum persistence/review. Jangan menjalankan CLI penuh untuk validasi: itu menginisialisasi provider dan dapat memanggil AI.

### 4. [P1] Flag verified/established bukan bukti bahwa verifikasi terjadi

`mz-assessment.ts:81` menerima any reference dengan isVerified dan isRelevant. Tidak ada pemeriksaan policy eligibility, passage revision, kutipan atau identitas verifier di model tersebut. Ini bukan pembuktian referensi, melainkan kepercayaan pada flag yang tersimpan.

Cosmic `packages/mizan-engine/src/index.ts:43` juga menghitung Quranic status dari input. Probe intent tersedia + confidence=.9 + coverage=DIRECT + evidence[{status:VERIFIED}] menghasilkan ESTABLISHED walaupun daftar referensi kosong. Fungsi ini bisa sah sebagai primitive untuk trusted input; berbahaya bila adapter memperlakukannya sebagai verifier.

Selesaikan resolusi reference/provenance/policy di boundary yang dipercaya. Bedakan source_verified, claim_supported, interpretation_reviewed dan engine_status. Jangan mempromosikan raw Cosmic status menjadi status review Odoo.

### 5. [P1] Odoo Witness belum mempertahankan semantik Witness TS

TS `wx-evidence.ts` menghubungkan assertionId, evidenceEntityId/contentId, provenanceId dan lima relation types. Odoo `witness_domain.py:95` mewajibkan passage tetapi belum memiliki assertion_id/provenance_id; relation hanya supports/contradicts/context. Source Odoo memakai SCRIPTURE/HADITH/REFERENCE/OTHER, bukan kebijakan authority lengkap dari wx.source.policy.

`canonical-corpus-importer.ts:51` jalur Odoo mengisi source_class OTHER untuk sumber selain tradition, memakai normalizationVersion sebagai provenance revision, dan memperbarui passage/content pada source/reference yang sama. Revision baru dapat mengganti teks yang dirujuk assessment lama jika tidak dibekukan tersendiri. Import dilakukan melalui beberapa panggilan, belum satu business transaction lintas batch.

Tambahkan paritas minimum source-policy, assertion-evidence, edition/revision dan replay sebelum menyatakan source-aware assessment end-to-end. Identity sumber tidak sama dengan versi algoritma normalisasi. Reuse model Witness; jangan menutupi gap dengan corpus/evidence store Mizan baru.

### 6. [P1] Finalized belum berarti immutable; akses sumber terlalu luas untuk baseline review

Model assessment TS hanya melakukan validasi saat gabungan data isFinalized=true. Mengubah false melewati validasi tersebut; model filter/reference tidak punya hook perlindungan parent finalized. Karena itu label finalized belum menjamin snapshot tidak berubah. Temuan statis, bukan uji eksploitasi live.

Manifest/ACL custom Odoo Witness yang dibaca memberikan write/create pada base.group_user untuk sumber, bukti, run dan result; tidak ada file record rules company/reviewer yang dimuat manifest. Company_id saja tidak membuktikan isolasi. Uji ACL live tetap dibutuhkan.

Bekukan parent dan child lewat server ORM; pertahankan revision snapshot sumber serta result. Review harus menunjuk hash hasil/input tertentu. Gunakan batas akses sampai ke sumber, attachment, export dan job.

### 7. [P1] Integrasi Odoo Mizan belum tersedia walaupun backend memiliki Odoo-only mode

`apps/api/src/server.ts:25` memilih addons=[] saat config.odoo aktif. `packages/moon-server/src/handlers/rest.ts:23` memiliki mapping wx.*, user/project, tetapi tidak mz.*. Route summary Mizan masih mencari model mz.case. Ini gap wiring yang nyata; route decision murni dapat tersedia tanpa berarti persistence Mizan sudah terhubung.

README Mizan mengiklankan evaluateCase, dan docs ADDON-AUDIT menyebut endpoint evaluate yang tidak ditemukan pada source Mizan yang diperiksa. Sumber kode harus menjadi baseline integrasi. Tambahkan kontrak, adapter store, mapping field/status/ID, lalu tes Odoo-only tanpa fallback ke DB lama.

### 8. [P1] Default modul konteks dapat menyamar sebagai hasil penelitian

Odoo `moon_myth_observation.py` memberi evidence_score=80 dan tauhid_gap=50 secara default. `moon_disaster.py` memberi evidence_score=95. `moon_myth_correlation.py:67` default status REVIEWED_NO_CAUSAL_LINK sebelum review; help text causality sudah memuat kesimpulan yang dituju.

Untuk asas berat ke kebenaran, kesimpulan empiris tidak boleh sudah ditanam sebelum observasi. Gunakan unknown/unreviewed dan alasan/sumber. Kedekatan waktu/tempat tidak menetapkan hubungan sebab maupun membuktikan ketiadaannya. Penilaian terhadap klaim/praktik juga tidak boleh disajikan sebagai persentase iman seseorang. Nilai lama dipertahankan sebagai metadata dengan asalnya, bukan dinaikkan menjadi bukti Mizan.

### 9. [P2] Skema Cosmic memiliki beberapa lapisan semantik yang belum disamakan

- 13 OUT adalah impact vector, bukan seluruh scale dimensions. calculateScaleFactor memakai 15 dimensi; normalizer juga memuat quality/intent/repair.
- 9 action gates adalah kanal epistemik/konteks pada registry, bukan sembilan izin tindakan. Probe seluruh gates=0 versus 1 memberi skor/assessment identik pada fungsi evaluateMizan. Ini bukan otomatis bug; proposal harus menjelaskan fungsi gates dengan benar.
- Registry `data/semantic/registry.json` mendeskripsikan R/G/B/L sebagai TARGET/DIRECTION/PURSUIT/VALUE_ALIGNMENT. Fungsi Mizan memakai redRisk/greenBenefit/blueGrounding/lightRestoration; schema rgbl menyebut intention chain. Jangan menganggap tuple bernama sama selalu bermakna sama. Adapter perlu semantic_schema/version dan pemetaan eksplisit.
- helper severityBand memakai ambang 12/30/70, hasil evaluateMizan memakai 15/40/70; contract MizanResult.band bertipe number sementara fungsi mengembalikan string.
- Missing scale dinormalisasi .5, confidence memiliki floor .25; raw missing harus tetap tersimpan, bukan ditampilkan sebagai pengukuran nyata.

### 10. [P2] Native binding dan confidence adalah heuristik yang dapat diaudit

`native-revelation-binder.ts` mencari anchor, menilai marker terdekat, memilih sampai lima passage, dan membentuk confidence dari count/graph. `revelation-magnitude.ts` menggabungkan bobot marker/graph/repetition/coverage. `scoring-profile.json` secara eksplisit menyatakan normativeAuthority=false.

Ini dasar audit yang baik. Namun retrieved reference berstatus direct belum membuktikan penerapan konteks lengkap pada kejadian konkret. Pertahankan binding features, passage yang dipilih, konflik dan empirically-required flag. Nilai rendah/tidak ditemukan tidak otomatis berarti norma tersebut boleh atau terlarang.

### 11. [P2] Source policy agent, Cosmic dan Witness berbeda cakupan

Agent menetapkan urutan Quran → Tawrat → Zabur → Injil. Cosmic source-policy.json memiliki Quran primary serta tiga corroboration channel setara; textual witness hanya meningkatkan confidence, tidak membalik arah. Witness TS memiliki source-policy role dan allowed-engine-use; Hadith adalah tradition context. Proposal awal mencampur Hadith sebagai sumber tambahan tanpa menguraikan gate ini.

Simpan method profile dan source policy secara terpisah. Legal source dapat berotoritas untuk hukum positif pada yurisdiksinya sekaligus tidak berotoritas sebagai Revelation; gunakan otoritas menurut domain, bukan satu rank universal. Ayat yang terverifikasi dan fakta empiris terverifikasi menjawab pertanyaan berbeda.

### 12. [P2] RESERVED saat ini dapat terlalu luas

Cosmic memakai regex kata surga/neraka/akhirat pada seluruh text. Probe kalimat penelitian tentang penggunaan kata surga langsung menghasilkan RESERVED. Boundary sebaiknya melekat pada klaim yang meminta putusan gaib, bukan melarang penelitian sumber yang menyebut istilah tersebut.

Pertahankan hasil engine mentah. Penilaian claim-scoped di Odoo tidak boleh mengubah raw status sambil menyatakan masih identik dengan Cosmic.

### 13. [P2] Witness scoring bisa dipakai ulang, tetapi bukan ukuran kepastian universal

`services/scoring.ts` sudah menyediakan unavailable/NA, coverage, profile version, fingerprint dan independentEvidence. Reuse representasi itu. Fungsi score menghitung coverage dari dimensi yang diberikan, bukan seluruh dimensi profil; kelengkapan profil perlu diperiksa di boundary pemanggil. Dedup independentEvidence memakai sourceKey + lineage, sehingga salinan lintas sourceKey masih memerlukan lineage mapping lintas sumber.

`engine-evidence.ts` default relation_confidence dapat memberi composite 10000 untuk seluruh evidence primary. Ini skor profil engineering, bukan probabilitas kebenaran 100%. Jangan menjadikannya syarat otomatis ESTABLISHED pada assessment hukum atau empiris.

### 14. [P2] Reuse tidak berarti mengambil seluruh workflow AI atau justice

WitnessEngineRuntime sudah mempunyai registry, replay, source revision, store interface dan pembatasan AI-derived. Draft pertama tidak perlu membuat runtime Mizan lain.

CAB mengelola change advisory governance; review Mizan memiliki semantik domain sendiri, walau komponen presentasi dapat dipakai ulang. Khidra engine yang dibaca memakai konteks SUPERUSER untuk persistence percakapan; jangan langsung menjadikannya jalur akses evidence/approval Mizan. Cosmic justice memakai rule lookup dan role constants/workflow object; itu bukan ACL Odoo atau putusan hukum terverifikasi.

## Kontrak semantik yang perlu disepakati sebelum publish profil

| Perkara | Agent asli | TS saat ini | Target implementasi yang menjaga asal |
|---|---|---|---|
| Primary gagal | GENERAL_LIMITED, total 0 | Throw saat finalize | Raw asli disimpan; report blocked, score_available=false |
| Secondary NA | Diizinkan untuk dua pertama pada JSON | Tidak ada pilihan NA | Tambah lewat revisi kontrak; jangan migrasi menjadi yes |
| Reference weight=0 | Prompt punya ketegangan antara value nyata dan cabang akhir | Final general_limited; preview prophetic | Preview eligibility dipisah dari final decision |
| Identitas filter | Nama dan jumlah tertentu | Count/position/yes | Code dan versi wajib, tidak cukup jumlah |
| Bobot per item | Daftar 10/7, anchor rinci belum ada | Agregat; field Integer, validator menerima pecahan | Definisikan unit eksplisit; jangan mengarang 17 skor biner |
| Urutan sumber | Sequential | Flags saja | Simpan search trace + resolve source policy |
| Finalized | Output JSON | Boolean bisa diubah | Review snapshot immutable dan revision baru |

## Perbaikan draft model

Draft revisi 2 mempertahankan domain regulasi/pasal/kasus dan assessment. Perubahan penting:

1. `moon.mizan.claim` menjadi penilaian atas `moon.witness.assertion`; tidak menjadi truth graph tandingan.
2. Run/result memakai `moon.witness.engine.run/result` dengan perluasan yang diperlukan; adapter mengikuti EngineRunStore.
3. Identitas migrasi memakai `moon.external.identity` yang sudah ada.
4. Source policy/version, quote type, retrieval trace dan lineage ditambahkan pada penggunaan referensi.
5. Filter memiliki evaluation_scope untuk membedakan proses penilaian, isi norma dan tindakan subjek. Coercion dalam peristiwa adalah fakta tanggung jawab; tidak otomatis sama dengan assessor yang dipaksa.
6. Skor rubrik, kualitas bukti, dampak dan keberlakuan hukum tetap terpisah. Bonus 0–4 tidak dihapus.
7. Source policy, ACL dan schema parity Odoo menjadi Tahap 0 sebelum evaluasi operasional.

## Urutan implementasi yang disarankan

1. Bekukan spesifikasi metode aktual dan seed kanonik; selesaikan tabel perbedaan di atas dengan tests. Ini menjaga asas lebih baik daripada langsung menambah UI.
2. Tambah paritas Witness Odoo yang diperlukan: assertion/evidence/provenance, source policy, immutable revisions, engine run store dan company/reviewer access.
3. Implementasikan satu alur kasus kecil: draft → bukti pro/kontra → delapan filter → penilaian 10/7 → sufficiency/balance/reference → review. Hasil unknown/blocked harus sama mudahnya disimpan dengan hasil siap.
4. Tambahkan regulasi dan pasal berversi serta metadata yurisdiksi/otoritas. Review assessment tidak pernah otomatis mengubah enacted.
5. Integrasikan Cosmic sebagai hasil analitis berversi, kemudian Myth/Disaster setelah nilai default dan review state tidak menimbulkan verifikasi semu.

## Validasi yang dijalankan

- 20 file tes / 94 tes lulus: scripts, Mizan engine, Odoo bridge session mocks, Witness research adapters, engine runtime dan revelation query. Menjalankan langsung binary lokal `node node_modules/vitest/vitest.mjs` menghindari pnpm yang sebelumnya mencoba penataan dependencies; tidak mengganti dependencies.
- 3 tes paket Cosmic mizan-engine lulus melalui `node --test` terhadap package test yang hanya memakai primitive host-neutral.
- Tambahan 4 file / 21 tes Witness scoring, ingestion, pipeline dan importer Odoo mock lulus. Total tes existing yang dijalankan: 118; tidak termasuk delapan probe diagnostik.
- 8 probe kasus batas lulus dalam arti berhasil mereproduksi perilaku yang dicatat, bukan menyatakan bug telah diperbaiki. Reproduksi: `node docs/mizan-review-probes.mjs` pada Node 26 dengan repo Cosmic/Mizan sebagai sibling, atau berikan dua path eksplisit.
- Audit governance diulang setelah revisi: exit 0, tetapi delapan component-health findings dan 29 file di atas 400 baris; exit 0 tidak sama dengan semua temuan bersih.
- Tidak ada tes database/ACL Odoo live atau full Cosmic pipeline. Tes yang lulus membuktikan perilaku yang diuji, bukan validitas ilmiah/metafisik scoring.

Draft implementasi terbaru: [MIZAN-IMPLEMENTATION-CHECKLIST.md](MIZAN-IMPLEMENTATION-CHECKLIST.md).
