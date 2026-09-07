# Draft implementasi Revelation–Mizan untuk Odoo 19

Tanggal: 6 September 2026. Revisi 2 setelah pemeriksaan lintas repo. Status: spesifikasi implementasi, belum addon terpasang.
Dasar pemeriksaan dan kasus batas: [Review metode dan integrasi](MIZAN-REVIEW.md). Revisi ini membatalkan usulan sebelumnya untuk menonaktifkan bobot Prophetic secara default.
Dokumen ini menetapkan rancangan domain; bukan penetapan hukum atau klaim validasi ilmiah metode.

## 1. Asas

**Bobot mengikuti kebenaran; keputusan mengikuti kecukupan dasar.**

Kebenaran menjadi dasar dan arah penilaian. Setiap pertimbangan memperoleh bobot sesuai dasar, bukti, dan relevansinya, termasuk ketika hasilnya merugikan penilai sendiri. Wahyu menjadi landasan orientasi; penafsiran manusia dan penerapannya dicatat sebagai penafsiran yang dapat diperiksa dan dikoreksi.

Keseimbangan memberi setiap pertimbangan bobot yang semestinya, bukan membagi bobot sama rata. Manfaat tidak otomatis membenarkan tindakan. Pemulihan tidak menghapus pelanggaran. Kesimpulan dibatasi kecukupan pengetahuan; martabat manusia dijaga dalam proses dan tindakan.

Sistem tidak memiliki field `truth_score`. Skor mengukur pemenuhan rubrik tertentu, bukan persentase kebenaran wahyu atau manusia. Kutipan, penafsiran, bukti, kesimpulan, dan rekomendasi disimpan terpisah.

## 2. Kondisi repo dan keputusan ownership

Telah diperiksa: `packages/moon-mizan/src/engine.ts`, model `mz.case`, `mz.assessment`, `mz.reference`, route Mizan, serta `odoo19/addons/moon_witness/models/witness_domain.py`.

- Odoo memiliki `moon.witness.source`, `artifact`, `snapshot`, `provenance`, `passage`, `evidence`, `assertion`, `engine.run`, dan `engine.result`.
- Addon `moon_mizan` belum ada pada direktori addon yang diperiksa.
- Engine TS memiliki batas 10 + 7 + 4, rating maksimal 4,5, dan menolak finalisasi jika primary/secondary filter gagal.
- Route yang diperiksa adalah GET `/api/mizan/decision` dan GET `/api/mizan/summary`. Endpoint evaluasi lengkap belum tersedia di file itu.
- Cosmic lokal branch `dev`, HEAD `819f7f44426c3f108f8c1aebf927b12a96843d70`, dan `X:/REPO/mizan/app.js` telah diperiksa. Cosmic menyediakan POST `/api/v1/mizan` untuk RGBL/impact; endpoint itu tidak menjalankan rubrik 17/21 dari agent Mizan.
- Agent asli menetapkan General first dan tambahan Prophetic 0–4 dengan prasyarat. Metode ini dipertahankan. Perbedaan agent/TS harus dicatat dan direkonsiliasi, bukan disembunyikan dalam migrasi.
- Odoo Witness belum memiliki paritas source policy, assertion-evidence dan engine runtime dengan TS. Mapping `mz.*` belum tersedia pada bridge REST yang diperiksa. Keduanya prasyarat integrasi, bukan pekerjaan yang sudah selesai.

Ownership target:

| Pemilik | Tanggung jawab |
|---|---|
| moonwitness-corpus | Editorial corpus dan release sumber |
| @moon/witness + moon_witness | Sumber, passage, bukti, provenance dan graph aplikasi |
| @moon/mizan | Semantik evaluasi, pemilihan metode, perhitungan dan validasi domain |
| moon_mizan Odoo | Penyimpanan operasional regulasi/kasus, workflow, akses dan review |
| @moon/protocol | Kontrak input/output berversi |
| @moon/server | Endpoint dan transport |
| @moon/odoo-bridge | Transport Odoo yang sudah ada; gunakan kembali, tambahkan adapter domain dalam pemiliknya |
| Cosmic | Native binding, RGBL/impact dan Quranic analytical boundary melalui adapter berversi |

Odoo menjadi penyimpanan otoritatif untuk record Mizan baru setelah cutover eksplisit. Model TS lama tidak menjadi penulis kedua; bridge menggunakan `moon.external.identity` yang sudah ada. Bentuk external_key mencakup model, company dan source ID karena constraint aktual unik pada `(provider, external_key)`. Jangan otomatis memindahkan record lama sebelum pemetaan dan rekonsiliasi selesai. Selaraskan keputusan cutover dengan docs/CORE-PRINCIPLES.md yang masih menyebut Moon ORM sebagai persistence normal.

## 3. Paket addon

Addon inti `moon_mizan`, dependency `moon_witness` dan `mail` jika memakai chatter/activity. Gunakan `res.users`, `res.company`, `res.partner`, `res.country`, dan `res.country.state` yang sudah ada.

Integrasi opsional berada di `moon_mizan_disaster` dan `moon_mizan_myth`; addon inti tidak wajib bergantung pada keduanya. Target aktual: `moon.disaster`, `moon.myth`, `moon.myth.observation`, `moon.myth.correlation`. Angka bawaan dan status reviewed dari modul tersebut tidak otomatis menjadi bukti verified Mizan.

Notasi field: C=Char, T=Text, S=Selection, B=Boolean, I=Integer, F=Float, D=Date, DT=Datetime, J=Json, M2O=Many2one, O2M=One2many, M2M=Many2many. `!` berarti required. Semua nama tanpa prefix pada target Mizan menggunakan `moon.mizan.*`.

## 4. Model dan relasi

### Master kategori: moon.mizan.category

`name C!`, `code C!`, `parent_id M2O(category)`, `active B`.
Code unik, hierarki tidak boleh siklik. Kategori dapat dikelola UI; kategori tidak mengubah aturan engine.

### Yurisdiksi: moon.mizan.jurisdiction

`name C!`, `code C!`, `kind S!` (international/national/regional/local/organizational), `parent_id M2O(jurisdiction)`, `country_id M2O(res.country)`, `state_id M2O(res.country.state)`, `authority_id M2O(res.partner)`, `scope_note T`, `active B`.
Code unik; country/state harus konsisten. Cakupan lintas negara menggunakan relasi beberapa yurisdiksi, bukan kewenangan universal otomatis.

### Profil metode: moon.mizan.method.profile

Satu record adalah satu versi metode: `code C!`, `version C!`, `name C!`, `state S!` (draft/published/retired), `principle_text T!`, `interpretive_scope T!`, `engine_version C!`, `contract_version C!`, `configuration_hash C`, `configuration J`, `published_by M2O(res.users)`, `published_at DT`, `criterion_ids O2M(criterion)`.
Unik `(code, version)`. Profil published beserta kriteria tidak dapat diedit; perubahan membuat versi baru. Profil retired tetap dapat dibaca oleh hasil lama.

### Kriteria: moon.mizan.criterion

`profile_id M2O(method.profile)!`, `code C!`, `name C!`, `stage S!` (primary/right/left/secondary), `sequence I!`, `definition T!`, `evidence_requirement T!`, `scoring_anchors J`, `max_score F`, `blocking B`, `allow_na B`.
Unik `(profile_id, code)`. Pertahankan 4 primary, 10 right, 7 left, 4 secondary. Metode yang diperiksa menetapkan batas tahap 10 dan 7, tetapi belum menetapkan anchor numerik lengkap per kriteria: jangan mengasumsikan 17 item wajib biner. V1 menyimpan evaluasi kualitatif per item dan skor tahap dengan alasan; per-item score tetap unavailable sampai profil mendefinisikan unit/anchor/rumus agregasi. Filter tidak menambah skor. Perubahan bobot/count harus didukung versi engine, bukan sekadar edit UI.

### Regulasi: moon.mizan.regulation

Satu record adalah satu revisi naskah: `name C!`, `document_key C!`, `revision I!`, `previous_revision_id M2O(regulation)`, `category_id M2O(category)!`, `company_id M2O(res.company)!`, `owner_id M2O(res.users)!`, `jurisdiction_ids M2M(jurisdiction)`, `purpose T!`, `considerations T`, `state S!` (draft/in_review/reviewed/archived), `legal_status S!` (unverified/draft/enacted/repealed/superseded), `authority_id M2O(res.partner)`, `enactment_provenance_id M2O(moon.witness.provenance)`, `effective_from D`, `effective_until D`, `article_ids O2M(article)`, `assessment_ids O2M(assessment)`.
Unik `(company_id, document_key, revision)`. Legal status adalah metadata yang diverifikasi manusia; engine tidak boleh menetapkan enacted. Reviewed tidak berarti sah secara hukum. Revisi yang sudah direview dibekukan.

### Pasal: moon.mizan.article

`regulation_id M2O(regulation)!`, `number C!`, `sequence I!`, `title C`, `norm_text T!`, `operator S!` (obligatory/recommended/permitted/discouraged/prohibited), `subject T!`, `action_text T!`, `conditions T`, `exceptions T`, `scope_note T`, `effective_from D`, `effective_until D`, `sanction_text T`, `remedy_text T`, `provenance_ids M2M(moon.witness.provenance)`.
Unik `(regulation_id, number)`. Operator adalah kode stabil; label profil dapat memetakan wajib/sunnah/mubah/makruh/haram. Obligatory=must; prohibited=must not. Pemetaan adalah konvensi profil, bukan klaim bahwa semua sistem hukum identik. Sank­si dan pemulihan merupakan teks untuk review; tidak dieksekusi otomatis.

### Kasus: moon.mizan.case

`name C!`, `external_key C`, `company_id M2O(res.company)!`, `owner_id M2O(res.users)!`, `question T!`, `context T!`, `subject_alias C`, `jurisdiction_ids M2M(jurisdiction)`, `article_ids M2M(article)`, `state S!` (draft/in_review/assessed/archived), `assessment_ids O2M(assessment)`.
Fakta dan tuduhan dipisahkan pada klaim assessment. Jangan menyimpan identitas sensitif jika alias cukup. Pasal terhubung harus berada pada revisi yang jelas.

### Assessment: moon.mizan.assessment

`name C!`, `company_id M2O(res.company)!`, `case_id M2O(case)`, `regulation_id M2O(regulation)`, `article_id M2O(article)`, `profile_id M2O(method.profile)!`, `revision I!`, `previous_assessment_id M2O(assessment)`, `assessor_id M2O(res.users)!`, `state S!` (draft/evaluating/in_review/reviewed/superseded), `run_state S!` (idle/pending/succeeded/failed), `recommendation_state S!` (pending/blocked/deferred/ready), `method S` (general/general_limited/prophetic), `general_sufficiency S!` (unknown/sufficient/insufficient), `sufficiency_reason T`, `balance_state S!` (unknown/absent/present), `balance_reason T`, `reference_value_reason T`, `general_weight F`, `reference_weight F`, `total_weight F`, `score_max F`, `score_available B`, `rating F`, `rating_available B`, `conclusion T`, `recommended_action T`, `limitations T`, `revision_triggers T`, `evaluated_at DT`, `claim_ids O2M(claim)`, `line_ids O2M(assessment.line)`, `reference_ids O2M(reference)`, `review_ids O2M(review)`, `run_ids O2M(moon.witness.engine.run)`.
Tepat satu target: case atau regulation. Article opsional hanya untuk target regulation dan wajib milik regulation tersebut. Empty score dibedakan dari nol memakai availability flag. Reviewed adalah status review proses; assessment blocked/deferred tetap dapat direview sebagai laporan tanpa rekomendasi tindakan.

### Penilaian klaim: moon.mizan.claim

`assessment_id M2O(assessment)!`, `assertion_id M2O(moon.witness.assertion)!`, `statement_snapshot T!`, `assertion_revision C!`, `kind S!` (factual/interpretive/normative), `epistemic_status S!` (unassessed/established/provisional/insufficient_evidence/reserved), `grounding S!` (unknown/direct/inferential/mixed), `reason T`, `counterargument T`, `revision_trigger T`, `reference_ids O2M(reference)`, `critical B`.
Model ini menilai penggunaan assertion pada assessment tertentu; identitas dan pernyataan kanonik tetap milik Witness. Draft assertion boleh belum diterima dan tidak dipromosikan otomatis. Status melekat pada proposisi, bukan nilai seseorang. Cosmic raw status dan confidence dipertahankan pada engine result; status review Mizan terpisah, tidak otomatis mengikuti ambang 75% Cosmic. Klaim tentang keputusan gaib berada di reserved; sekadar menyebut kata surga/akhirat tidak cukup untuk menandai seluruh penelitian reserved. Klaim critical yang reserved/insufficient menghalangi rekomendasi yang bergantung padanya.

### Penggunaan bukti: moon.mizan.reference

`assessment_id M2O(assessment)!`, `claim_id M2O(claim)`, `evidence_id M2O(moon.witness.evidence)`, `passage_id M2O(moon.witness.passage)`, `provenance_id M2O(moon.witness.provenance)!`, `role S!` (supports/opposes/context), `interpretation T!`, `relevance_reason T!`, `verification_state S!` (unverified/verified/rejected), `verified_by M2O(res.users)`, `verified_at DT`, `source_revision C!`, `excerpt_snapshot T`, `snapshot_hash C`.
Minimal evidence atau passage terisi dan seluruh relasi menunjuk sumber yang konsisten. Claim harus milik assessment yang sama. Tambahkan `source_policy_key C!`, `source_policy_version C!`, `authority_role C!`, `independence_key C`, `quote_type S!` (exact/paraphrase), `retrieval_trace J`. Authority role di-resolve dari Witness, bukan pilihan bebas assessor. Kutipan snapshot adalah salinan audit turunan, bukan editorial corpus. Verifikasi sumber terpisah dari penerimaan penafsiran. Tidak membuat `moon.mizan.evidence` sebagai penyimpanan bukti tandingan. Hadith/tradition, tafsir, hukum positif dan bukti empiris dapat menjadi konteks sesuai source policy; jangan menaikkan semuanya menjadi sumber Revelation karena dianggap relevan.

### Baris penilaian: moon.mizan.assessment.line

`assessment_id M2O(assessment)!`, `criterion_id M2O(criterion)!`, `answer S!` (unknown/pass/fail/not_applicable), `score F`, `score_available B`, `reason T`, `reference_ids M2M(reference)`.
Unik `(assessment_id, criterion_id)`; profil kriteria harus sama dengan profil assessment. Semua referensi harus milik assessment yang sama. Unknown tidak dikonversi menjadi pass atau nol. NA pada dua secondary pertama didukung format agent asli, tetapi tidak didukung model TS saat ini: pertahankan raw answer, dan dukung NA beralasan melalui revisi kontrak eksplisit sebelum dipakai untuk finalisasi. Jangan menggantinya dengan yes selama migrasi. Tetapkan scope pada profil kriteria; baris hanya membaca snapshotnya dan assessor tidak boleh menggantinya untuk meloloskan gate. Gunakan `evaluation_scope S!` (assessment_process/proposed_norm/subject_action) agar pemaksaan terhadap subjek tidak keliru dianggap pemaksaan terhadap assessor.

### Review: moon.mizan.review

`assessment_id M2O(assessment)!`, `reviewer_id M2O(res.users)!`, `decision S!` (accepted/changes_requested/rejected), `reason T!`, `conflict_of_interest T!`, `reviewed_at DT!`, `input_hash C!`, `result_hash C!`.
Review append-only setelah disubmit. Reviewer berbeda dari assessor. Accepted mengakui kelayakan laporan pada snapshot tertentu; bukan pengesahan regulasi. Koreksi menghasilkan record review/revisi baru.

### Eksekusi: perluasan moon.witness.engine.run/result

Gunakan `moon.witness.engine.run` dan `moon.witness.engine.result` yang sudah ada. Perluas secara aditif melalui addon: `mizan_assessment_id M2O(assessment)`, `request_key C`, `profile_hash C`, `contract_version C`, `input_snapshot J`, `error_code C`, `attempt_count I`, `external_run_id C`, `source_revision_snapshot J`, `superseded_input B`. Pakai `engine_key/version`, `input_fingerprint/output_fingerprint`, timestamps dan status queued/running/completed/failed yang sudah tersedia. Output lengkap berada pada result.payload. `assessment.run_ids` adalah O2M ke engine.run melalui mizan_assessment_id.
Request key unik per company untuk run Mizan, input hash berbeda dengan key sama ditolak. Tidak menambah runtime/registry/replay engine tandingan. Adapter store Odoo harus memenuhi kontrak EngineRunStore yang sudah ada; gap schema diselesaikan di Witness. Rerun menggunakan referensi parent/rerun sesuai runtime TS. Hash memakai stableSerialize/sha256String yang sudah ada. Payload tidak berisi kredensial. Run untuk weighted assessment dan Cosmic terpisah dengan engine_key yang berbeda.

## 5. Profil dan pipeline

Profil operasional target `mizan_weighted@1.0.0` mempertahankan General first, maksimum 17 dan tambahan Prophetic 0–4 bila seluruh prasyarat terpenuhi. Batas rating tetap 4,5. Tidak ada profil tanpa bonus yang dipublikasikan oleh draft ini.

Raw output historis diberi implementation_id `mizan_agent` atau `moon_mizan_ts` dan hash, sebab keduanya belum identik. Code/versi baru hanya dipublikasikan setelah tabel kompatibilitas di review diselesaikan: gagal primary, NA secondary, metode dengan reference weight nol, identitas filter, dan unit skor. Rating tetap terpisah; tidak diubah menjadi probabilitas kebenaran atau formula normalisasi baru.

Pisahkan method profile dari source policy. Agent mencari Quran → Tawrat → Zabur → Injil secara berurutan; Cosmic memakai Quran primary dengan tiga saluran corroboration setara. Keduanya diberi policy ID masing-masing, tidak digabung menjadi satu urutan yang diklaim identik. Retrieval trace membedakan no relevant match, corpus unavailable dan retrieval failure; kegagalan pencarian tidak boleh dianggap izin melewati prioritas sumber.

Pipeline normatif:

1. Tetapkan pertanyaan, target revisi, yurisdiksi dan profil published.
2. Uraikan klaim; hubungkan bukti mendukung, menentang dan konteks.
3. Evaluasi primary filter: fail -> blocked; unknown -> deferred. Simpan alasan dan diagnosis, tanpa skor final yang berlaku. Raw agent menghasilkan total_weight=0 pada primary fail; raw TS melempar error. Keduanya dipertahankan di provenance, lalu wrapper menandai score_available=false tanpa mengubah fakta historis.
4. Catat 10 kriteria substansi dan 7 kriteria proses; skor tahap maksimal 10 dan 7 wajib memiliki alasan. Jangan mengklaim penjumlahan item sebelum anchor/rumus item tersedia.
5. Tentukan kecukupan dengan alasan terhadap klaim kritis; tidak hanya dari jumlah skor.
6. Jika tidak cukup, catat pertimbangan material yang berlawanan. Skor rendah sendiri tidak membuktikan balance.
7. Tambahan bobot di atas nol sampai 4 memerlukan general insufficient, balance present, referensi terverifikasi/relevan, source policy eligible, dan alasan kontribusi nyata. Jika general sufficient, tambahan wajib nol. Tanpa kontribusi, hasil final general_limited mengikuti validateAssessment; preview boleh menyatakan eligible_for_prophetic tetapi tidak memberi nama metode final sebelum bobot diperiksa. Unit integer versus pecahan harus eksplisit pada kontrak karena pure function TS menerima pecahan sedangkan field model memakai Integer.
8. Evaluasi secondary filter. Perlindungan anak berarti pembatasan tindakan terhadap anak, bukan menghapus hak anak untuk menjadi subjek perlindungan. Kebutuhan khusus perempuan harus punya konteks dan alasan yang jelas.
9. Secondary fail -> blocked; unknown -> deferred. Klaim critical belum cukup -> deferred. Gate lulus dan dasar cukup -> ready untuk review manusia, bukan tindakan otomatis.
10. Reviewer menilai sumber, argumen, konflik kepentingan dan keterbatasan; hasil tersimpan dengan versi serta hash.

Output selalu memisahkan kualitas normatif, status bukti per klaim, dampak, metadata keberlakuan dan rekomendasi tindakan. Skor 17/17 tidak menerbitkan regulasi atau sanksi.

## 6. RGBL, dimensi dan maqashid

RGBL ditambahkan melalui hasil engine Witness yang dirujuk run: setiap kanal berisi value, scale, explanation dan reference IDs. Jangan mengurangi R dengan L atau menjumlahkan RGBL menjadi skor kebenaran. Missing berbeda dari nilai nol.

Jangan menyamakan 13 OUT impact axes dengan scale dimensions. Versi Cosmic yang diperiksa menerima 9 action gates dan 13 impact values, tetapi calculateScaleFactor memakai 15 keys termasuk irreversibility dan risk; normalisasi juga mencakup quality, intent, repair. Persist code/urutan/skala dari registry dan input mentah, bukan memotong ke 13 field proposal. Missing raw tetap missing meski Cosmic menormalisasi menjadi 0,5. Action gates saat ini direkam di trace tanpa memengaruhi skor; jangan memakainya sebagai bukti bahwa tindakan telah lolos gate operasional.

Maqashid ditampilkan sebagai penjelasan eksplisit per tujuan, bukan bonus tersembunyi. Ekstensi `moon.mizan.maqashid.line`: assessment_id, code (din/nafs/aql/nasl/mal), effect (unknown/supports/conflicts/mixed/not_applicable), reason, reference_ids. Unik assessment/code; referensi konsisten. Pemetaan lima tujuan adalah konfigurasi profil penafsiran, bukan pengganti delapan filter.

## 7. Integrasi API dan AI

Usulan endpoint baru: POST `/api/mizan/assessments/evaluate`. Ini belum endpoint siap pakai. Definisikan request/response di @moon/protocol, route di @moon/server dan service @moon/mizan sebelum tombol Evaluate aktif.

Request: contractVersion, requestKey, assessmentExternalId, inputHash, profileCode, profileVersion, profileHash, sourcePolicyKey, sourcePolicyVersion, targetRevision, claims, criterionAnswers, stageScores, stageScoreReasons, references, sufficiency, balance. Server menghitung ulang hash, memvalidasi hak akses, keanggotaan relasi dan sumber; total/flags agregat dari client tidak dipercaya. Adapter ke Cosmic menerima kontrak RGBL-nya sendiri; bukan meneruskan request weighted assessment ke `/api/v1/mizan` dan menganggap hasilnya sama.

Response: contractVersion, requestKey, inputHash, profileHash, engineVersion, recommendationState, method, scoreAvailable, generalWeight, referenceWeight, totalWeight, scoreMax, claimStatuses, limitations, validationErrors. Evidence-grounding judgment adalah input review yang terlacak; validasi mekanis tidak berarti engine membuktikan kebenarannya secara mandiri.

Odoo membekukan input run dan mengirim lewat job setelah transaksi penyimpanan selesai. Timeout/retry menggunakan requestKey sama; key sama dengan hash berbeda ditolak. Hasil untuk revisi input lama diberi superseded_input dan tidak menimpa hasil aktif. Kegagalan jaringan tetap failed/queued, tidak menjadi skor nol atau accepted. Saat hasil diterima, simpan baris dan agregat secara atomik setelah validasi contract/hash/version. Runtime dataset loader Cosmic dikonfigurasi sekali untuk snapshot versi yang dipatok, tidak diubah global per request/tenant.

AI boleh mengusulkan ekstraksi klaim, hubungan sumber, alasan, dan jawaban rubrik. AI tidak menetapkan verified_by, review accepted atau enacted. Instruksi yang muncul dalam sumber diperlakukan sebagai data. Simpan identitas model dan versi prompt dalam metadata run bila AI digunakan; rahasia akses hanya dalam konfigurasi server.

## 8. Integritas dan keamanan Odoo

- Gunakan ORM dengan pemeriksaan create/write/unlink dan action server. Readonly pada view saja tidak cukup.
- Company required pada entitas operasional; child mengikuti company parent. Aturan akses parent berlaku juga untuk child, run, attachment, review dan ekspor.
- Source lintas company hanya boleh dirujuk bila akses Witness mengizinkan; jangan memakai sudo untuk melewati pembatasan bukti.
- Semua relasi profil/sumber/revisi yang masuk hasil reviewed memakai ondelete restrict. Draft child boleh dihapus hanya saat parent masih draft.
- Pembekuan mencakup assessment, baris, klaim, referensi, target revisi dan profil. Revisi baru tidak mengubah snapshot lama.
- Aksi evaluasi/review harus memeriksa versi input dalam transaksi untuk menolak hasil atau approval yang sudah stale.
- Role reader: baca record yang diizinkan; assessor: kelola draft/evaluate; reviewer: review tanpa mengedit bukti; manager: master/profil draft. Publikasi profil hanya manager yang ditunjuk. Integration user terbatas pada run miliknya, tidak boleh review atau mengubah enacted.
- Perubahan legal_status memerlukan role berwenang, authority, provenance dan tanggal yang konsisten. Sumber pengundangan tidak otomatis disimpulkan dari skor.
- Constraint rentang score/rating, keunikan, urutan tanggal dan konsistensi company ditegakkan server-side. Pilih sintaks constraint setelah memeriksa runtime Odoo yang digunakan.

## 9. UI minimum

Menu: Regulations, Cases, Assessments, Reviews; Configuration untuk Categories, Jurisdictions dan Method profiles.

Form assessment: ringkasan pertanyaan/profil/revisi; Claims and evidence; Primary filters; General assessment; References and balance; Secondary filters; Impact and maqashid; Conclusion and limitations; Runs and reviews.

Tombol: Evaluate, Retry failed run, Submit for review, Accept review, Request changes, Create revision. Tombol tampil mengikuti role/state tetapi semua aturan diulang di server. Display unknown/reserved/blocked menggunakan teks eksplisit. Tampilkan skor hanya jika tersedia, beserta penyebut dan versi profil. Jangan menampilkan label divine verdict.

## 10. Implementasi bertahap dan migrasi

Tahap 0: selesaikan ketidaksamaan filter/NA/preview/unit skor, hilangkan verifikasi otomatis dari demo, tambah parity source policy + assertion/evidence Witness Odoo, dan perketat akses sumber serta snapshot. Definisikan mapping snake_case/camelCase dan status, bukan hanya mengganti nama model.

Tahap 1: buat addon models/ACL/record rules/views untuk master, target, assessment, penilaian klaim, referensi dan review; reuse engine run/result. Evaluasi tetap nonaktif sampai layanan terhubung; draft manual dapat disimpan tanpa hasil palsu.

Tahap 2: tambah contract dan service evaluasi di canonical TS engine, profil published, adapter EngineRunStore Odoo dan validasi end-to-end. Pertahankan 17/21. Tambah mapping Mizan pada jalur bridge yang canonical; dalam Odoo-only mode tidak boleh fallback menulis ke ORM lama.

Tahap 3: migrasi mz.case/assessment/filter/reference menggunakan mapping `(source_system, model, source_id)` ke ID Odoo, simpan identitas/revisi dan data asli. Mapping verse TS ke passage/provenance Odoo harus eksplisit; unresolved reference masuk antrean perbaikan, tidak dibuat verified. Hasil lama tanpa detail klaim/versi ditandai imported legacy; jangan mengarang bukti atau menyatakan setara profil baru. Rekonsiliasi count, relasi dan total sebelum memindahkan penulis ke Odoo.

Tahap 4: adapter Cosmic, dimensi, maqashid dan integrasi disaster/myth setelah kontrak aktual diverifikasi. Tidak menjadi syarat addon inti dapat dipakai.

Struktur file: `models/` dipisah per domain/model; `services/` untuk adapter transport; `security/` untuk groups/access/rules; `views/` per fitur; `data/` untuk profil versi awal; `tests/` untuk aturan domain dan akses. Ikuti batas ukuran file repo.

## 11. Kriteria penerimaan

1. Satu regulasi dengan dua revisi menyimpan pasal dan assessment masing-masing tanpa perubahan silang.
2. Primary fail menghasilkan blocked dan laporan alasan yang bisa direview, tanpa final score.
3. Primary/secondary unknown menghasilkan deferred; tidak lolos lewat API/import.
4. General 10+7 menghasilkan 17 tanpa bonus; bonus ditolak bila general sufficient.
5. Tambahan Prophetic maksimal 4 hanya diterima dengan seluruh prasyarat; input lebih dari batas ditolak.
6. Tambahan Prophetic tidak otomatis mengikuti jumlah kutipan; reference value, policy, profil dan versi tampak pada output. Source policy menolak materi tidak eligible meskipun isVerified=true.
7. Klaim reserved tidak diberi skor; rekomendasi yang bergantung padanya tidak ready.
8. Bukti bertentangan tetap tampil bersama bukti mendukung; verification dan interpretation terpisah.
9. Penulis tidak menerima review sendiri; cross-company child/export tidak membocorkan record.
10. Reviewed target/profile/assessment/children tidak dapat diubah lewat RPC atau unlink; revisi baru tetap dimungkinkan.
11. Timeout, request duplikat dan hasil stale tidak menimpa hasil terbaru atau menciptakan assessment ganda.
12. Metadata enacted tidak dapat diubah engine/AI; sumber otoritas wajib saat verifikasi manusia.
13. Migrasi berulang idempotent, tidak menggandakan Witness evidence dan tidak kehilangan referensi lama.
14. Jalankan tes ORM/ACL Odoo dan engine/contract yang relevan, kemudian `node scripts/audit-rules.mjs` dan `pnpm test:scripts`. Kelulusan dokumen ini tidak berarti addon sudah diimplementasikan atau diuji.
