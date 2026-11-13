# MoonWitness: X-Nomenclature Dictionary

Standarisasi Penamaan (*Nomenclature*) ini bertujuan untuk membuat basis kode `MoonWitness` menjadi unik, futuristik, sangat ringkas (mayoritas 1 suku kata/singkatan), dan membersihkan sisa-sisa istilah warisan *Odoo*.

## 1. Namespace Utama (Prefix Tabel/Model)

Semua nama entitas utama di *database* maupun *model* di-grup menggunakan awalan 2 huruf berakhiran `x`.

| Lama (Odoo) | Baru (MoonWitness) | Kepanjangan / Filosofi | Keterangan |
| :--- | :--- | :--- | :--- |
| `ir.*` | **`mx.*`** | **M**eta e**X**ecution | Segala hal yang berkaitan dengan *core system*, konfigurasi tingkat rendah, dan definisi struktur. |
| `res.*` | **`vx.*`** | **V**erte**X** | Entitas data inti (Nodes) seperti Manusia, Perusahaan, atau Objek fisik lainnya yang saling terhubung. |
| `mail.*` | **`fx.*`** | **F**lu**X** / Flow | Aliran komunikasi, pelacakan histori, log, dan interaksi (Chatter). |
| *N/A* | **`nx.*`** | **N**eu**X** (Nexus) | (Opsional) Modul *Integration/API/Webhooks* ke luar sistem. |

---

## 2. Pemetaan Tabel / Model Spesifik

Berikut adalah kamus terjemahan untuk modul-modul dasar:

### Grup Meta (`mx.`)
| Lama (Odoo) | Baru (MoonWitness) | Deskripsi |
| :--- | :--- | :--- |
| `ir.model` | **`mx.model`** | Menyimpan definisi *Class* Model. |
| `ir.model.fields` | **`mx.field`** | Menyimpan definisi atribut kolom. |
| `ir.model.access` | **`mx.grant`** | Aturan hak akses baca/tulis (*Access Rights*). |
| `ir.rule` | **`mx.rule`** | Keamanan tingkat baris (*Row Level Security*). |
| `ir.module.module` | **`mx.pack`** | Modul/Addons yang terinstal di sistem. |

### Grup Vertex (`vx.`)
| Lama (Odoo) | Baru (MoonWitness) | Deskripsi |
| :--- | :--- | :--- |
| `res.users` | **`vx.user`** | Akun pengguna (*login credential*). |
| `res.partner` | **`vx.node`** | Entitas fisik (Pelanggan, Vendor, Kontak). Kita tidak pakai istilah "Partner". |
| `res.company` | **`vx.org`** | Perusahaan / Organisasi (*Multi-Tenant*). |
| `res.currency` | **`vx.coin`** | Mata uang. |
| `res.groups` | **`vx.role`** | Grup / Jabatan pengguna (*Security Groups*). |

### Grup Flux (`fx.`)
| Lama (Odoo) | Baru (MoonWitness) | Deskripsi |
| :--- | :--- | :--- |
| `mail.message` | **`fx.msg`** | Pesan, Log, Komentar (*Chatter*). |
| `mail.tracking.value`| **`fx.track`** | Rekaman perubahan data (Lama vs Baru). |
| `mail.followers` | **`fx.sub`** | *Subscriber* / Pengikut sebuah dokumen. |

---

## 3. Terminologi Kode (*Codebase Jargon*)

Sistem penulisan dalam kerangka TypeScript juga dipangkas menjadi sependek dan semodern mungkin:

| Konsep Standar | Istilah MoonWitness | Contoh Penggunaan |
| :--- | :--- | :--- |
| `BaseModel` | **`Vertex`** | `export class SaleOrder extends Vertex {}` |
| `Environment` | **`Ctx`** | `const ctx = spawnCtx(...)` |
| `Recordset` | **`Set`** | `const nodes: Set = await ctx.scan(...)` |
| `addons` | **`packs`** | Direktori *source code* modular (`apps/api/src/packs`) |
| `schema-sync` | **`forge`** | Fungsi pembentuk/sinkronisasi *Database*. |
| `spawn`, `morph`, `purge`| **`spawn`, `morph`, `void`** | (Tahap selanjutnya jika merombak ORM API) |
