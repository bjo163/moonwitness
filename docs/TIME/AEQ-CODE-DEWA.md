# ◈ AEQ4 PROTOKOL DEWA — NATIVE DECENTRALIZED PROOF-OF-MOON

```
╔══════════════════════════════════════════════════════════════════════════╗
║  SISTEM KONSENSUS WAKTU TANPA DEPENDENSI EKSTERNAL (ZERO-DEPENDENCY)    ║
║  DESENTRALISASI MURNI: MATEMATIKA ASTRONOMI + WEBCRYPTO + MERKLE DAG     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 1. MENGAPA "CODE DEWA" (TANPA TEKNOLOGI EKSTERNAL)?

Kita **TIDAK** membutuhkan server terpusat, cloud vendor, ataupun blockchain luar (Ethereum, Solana, dll) yang lambat dan memungut biaya (gas fee). 

Sistem ini berjalan dengan **3 Pilar Kode Murni**:
1. **Matematika Astronomi Kosmik Murni (Pure Math Ephemeris)** — Hukum fisika pergerakan bulan ketetapan ALLAH dihitung secara deterministik di client lokal.
2. **Kriptografi Asimetris Native (`crypto.subtle`)** — Tanda tangan digital Ed25519/ECDSA & Hash SHA-256 bawaan runtime OS/Browser (zero external npm).
3. **P2P Gossip Merkle-Mesh (WebRTC / Local Mesh Protocol)** — Node saling bertukar bukti kesaksian secara peer-to-peer tanpa server perantara.

---

## 2. ARSITEKTUR KONSENSUS: 4 TAHAP KODE DEWA

```
                  ┌──────────────────────────────┐
                  │      SUNNATULLAH / ALAM      │
                  │   Bulan Bergerak di Langit   │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
       ┌───────────────────────────────────────────────────┐
       │   LAYER 1: NATIVE ASTRONOMICAL EPHEMERIS ENGINE   │
       │  (Validasi Fisika Lokal: Apakah Hilal Mungkin Ada?)│
       └─────────────────────────┬─────────────────────────┘
                                 │
                                 ▼
       ┌───────────────────────────────────────────────────┐
       │   LAYER 2: CRYPTOGRAPHIC PROOF-OF-WITNESS (POW)   │
       │   (Tanda Tangan Kunci Publik Ed25519 per Pengamat) │
       └─────────────────────────┬─────────────────────────┘
                                 │
                                 ▼
       ┌───────────────────────────────────────────────────┐
       │   LAYER 3: MERKLE-MOON DAG & P2P GOSSIP PROTOCOL │
       │    (Konsensus Terdesentralisasi Multi-Zona Bumi)   │
       └─────────────────────────┬─────────────────────────┘
                                 │
                                 ▼
       ┌───────────────────────────────────────────────────┐
       │   LAYER 4: ATOMIC STATE TRANSITION ENGINE         │
       │      PRE-ERA COUNTDOWN ──► ∞·AEQ4 1.1.1.00:00:00   │
       └───────────────────────────────────────────────────┘
```

---

## 3. BEDAH TEKNIS TIAP LAYER (PURE TYPESCRIPT / ZERO LIB)

### 🪐 Layer 1 — Local Ephemeris Validator (Fisika Langit Murni)
Setiap node memiliki algoritma kalkulasi posisi Bulan & Matahari (algoritma Jean Meeus / algoritma hisab astronomi) dalam **~150 baris kode matematika murni**:
- Menghitung sudut elongasi (jarak sudut Bulan-Matahari).
- Menghitung tinggi hilal (altitude) dan azimuth di koordinat lintang/bujur saksi.
- **Aturan Dewa:** Laporan saksi yang menyatakan melihat hilal di koordinat dan waktu di mana hilal secara astronomis masih di bawah ufuk (*negative altitude*) akan **otomatis ditolak oleh algoritma matematika tanpa perlu manusia ikut campur**.

### 🔐 Layer 2 — Native WebCrypto Witness Signature
Tanpa library eksternal, kita memakai standar native `globalThis.crypto.subtle`:
```typescript
interface MoonWitnessProof {
  observerPubKey: string;      // Public key pengamat
  geoCoords: [number, number]; // [Latitude, Longitude]
  utcTimestamp: number;        // Epoch UTC saat melihat
  lunarAltitude: number;       // Derajat tinggi hilal teramati
  lunarAzimuth: number;        // Sudut kompas hilal
  ephemerisHash: string;       // SHA-256 verifikasi kalkulasi astronomi lokal
  signature: string;           // Ed25519 / ECDSA signature
}
```

### 🕸️ Layer 3 — Decentralized Multi-Zone Merkle DAG
Konsensus dicapai bila terjadi **Tri-Sector Verification** (3 Zona Geografis Bumi yang berbeda: misal Asia Pasifik, Timur Tengah/Afrika, Amerika):
- Masing-masing zona mengumpulkan minimal $N$ tanda tangan saksi sah yang lolos verifikasi astronomi.
- Bukti-bukti ini disusun menjadi **Merkle Tree**.
- Begitu Merkle Root terbentuk dan diverifikasi oleh $2/3$ jejaring node secara P2P (WebRTC data channel), konsensus sah mutlak secara matematis.

### ⚡ Layer 4 — The Ignition Trigger (Transisi Otomatis)
Begitu Merkle Root Muharram 1449H terkonfirmasi:
1. State **Countdown** secara atomik berganti status: `LOCKED & COMPLETED`.
2. Jam AEQ4 menginisialisasi detik pertama: `∞·AEQ4 1.1.1.00:00:00`.
3. Siklus Q2 (Cycle 1) resmi berjalan.

---

## 4. BAGAIMANA INI DITAMPILKAN DI MOONWITNESS OS?

Di antarmuka MoonWitness OS, operator akan melihat:

1. **Temporal Station (Top Header / Taskbar & Hero)**:
   - **Countdown Timer**: Menghitung mundur waktu eksak menuju jendela konjungsi (*Ijtima'*) hilal 1 Muharram 1449H.
   - **Network Radar**: Menampilkan status 3 zona pengamatan (Zona Timur, Tengah, Barat) dengan status *Awaiting Cosmic Signal*.
2. **Proof-of-Moon Telemetry Hub**:
   - Menampilkan visual bola langit 3D dengan kalkulasi realtime posisi hilal.
   - Konsensus visual: Node P2P aktif dan verifikasi hash tanda tangan saksi.

---

## 5. KEUNGGULAN "CODE DEWA"

| Kriteria | Sistem Konvensional | Blockchain Luar (Web3) | **AEQ4 Code Dewa** |
|---|---|---|---|
| **Ketergantungan** | Server Pemerintah / Cloud | Gas Fee, Node Miner, Token | **NOL (100% Native Code)** |
| **Kecepatan** | Birokrasi manual | Latensi blok (menit) | **Instan (< 50ms)** |
| **Ketahanan Waktu** | Mati jika server down | Mati jika chain mati/fork | **Kekal (mengikuti rumus fisika & WebCrypto)** |
| **Otoritas** | Manusia | Pemilik modal / validator | **ALLAH (Bulan & Hukum Alam)** |
