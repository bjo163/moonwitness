import { ASMAUL_HUSNA_EN, DailyData } from "./daily-inspiration-data"

export function formatBilingualDate(
  dateStr?: string,
  defaultFormatted?: string,
  lang: string = "id"
): string {
  if (!dateStr) return defaultFormatted?.toUpperCase() || ""
  try {
    const parts = dateStr.split("-").map(Number)
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
      if (lang === "en") {
        return new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
          timeZone: "UTC",
        })
          .format(date)
          .toUpperCase()
      }
    }
  } catch {}
  return defaultFormatted?.toUpperCase() || ""
}

export function calculateNextPrayer(
  now: Date,
  currentCode: string,
  lang: string = "id"
): { name: string; formattedCountdown: string; percentage: number } | null {
  const periodStartMap: Record<
    string,
    { h: number; m: number; labelEn: string; labelId: string }
  > = {
    subuh: { h: 4, m: 35, labelEn: "DAWN / SUBUH", labelId: "SUBUH" },
    dhuha: { h: 6, m: 0, labelEn: "MORNING / DHUHA", labelId: "DHUHA" },
    zuhur: { h: 12, m: 5, labelEn: "NOON / ZUHUR", labelId: "ZUHUR" },
    asar: { h: 15, m: 25, labelEn: "AFTERNOON / ASAR", labelId: "ASAR" },
    maghrib: {
      h: 18,
      m: 0,
      labelEn: "SUNSET / MAGHRIB",
      labelId: "MAGHRIB",
    },
    isya: { h: 19, m: 15, labelEn: "NIGHT / ISYA", labelId: "ISYA" },
  }

  const nextMap: Record<string, string> = {
    subuh: "dhuha",
    dhuha: "zuhur",
    zuhur: "asar",
    asar: "maghrib",
    maghrib: "isya",
    isya: "subuh",
  }

  const nextCode = nextMap[currentCode] || "subuh"
  const targetInfo = periodStartMap[nextCode] || {
    h: 4,
    m: 35,
    labelEn: "DAWN / SUBUH",
    labelId: "SUBUH",
  }

  const target = new Date(now.getTime())
  target.setHours(targetInfo.h, targetInfo.m, 0, 0)
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1)
  }

  const diffMs = target.getTime() - now.getTime()
  if (diffMs <= 0) return null

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

  const labelName = lang === "en" ? targetInfo.labelEn : targetInfo.labelId
  const formatted = `${diffHrs > 0 ? `${diffHrs}H ` : ""}${diffMins}M ${diffSecs}S`
  const totalMs = 4 * 60 * 60 * 1000
  const percentage = Math.max(0, Math.min(100, (diffMs / totalMs) * 100))

  return {
    name: labelName,
    formattedCountdown: formatted,
    percentage,
  }
}

export function playFuturisticZapAudio(): void {
  try {
    if (typeof window === "undefined") return
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    const now = ctx.currentTime

    // 1. High Voltage Electric Crackle
    const crackle = ctx.createOscillator()
    const crackleGain = ctx.createGain()
    crackle.type = "sawtooth"
    crackle.connect(crackleGain)
    crackleGain.connect(ctx.destination)

    crackle.frequency.setValueAtTime(150, now)
    crackle.frequency.exponentialRampToValueAtTime(1200, now + 0.3)

    // 2. Modulator
    const modulator = ctx.createOscillator()
    const modGain = ctx.createGain()
    modulator.type = "square"
    modulator.frequency.value = 50
    modulator.connect(modGain)

    modGain.connect(crackleGain.gain)
    modGain.gain.setValueAtTime(0.4, now)

    crackleGain.gain.setValueAtTime(0, now)
    crackleGain.gain.linearRampToValueAtTime(0.4, now + 0.02)
    crackleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    crackle.start(now)
    modulator.start(now)
    crackle.stop(now + 0.4)
    modulator.stop(now + 0.4)

    // 3. Sub-bass Thump
    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = "sine"
    sub.connect(subGain)
    subGain.connect(ctx.destination)

    sub.frequency.setValueAtTime(120, now)
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.3)

    subGain.gain.setValueAtTime(0, now)
    subGain.gain.linearRampToValueAtTime(0.5, now + 0.02)
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    sub.start(now)
    sub.stop(now + 0.3)
  } catch (e) {
    console.warn("Futuristic audio play failed", e)
  }
}

export function buildTransmissionText(
  data: DailyData,
  lang: string,
  liveTime: string,
  dynamicUrl: string,
  customTafsirNote: string
): string {
  const currentTranslation =
    lang === "en"
      ? data.ayah.translationEn || data.ayah.translationId
      : data.ayah.translationId

  let textToCopy = `✦ MOONWITNESS — ANCIENT SCRIPTURE & COSMIC LORE TRANSMISSION\n`
  textToCopy += `◈ ${data.prayerPeriod?.name || "Prayer Period"} (${formatBilingualDate(data.dateStr, data.formattedDate, lang)} • ${liveTime || "UTC+7"})\n`
  textToCopy += `-------------------------------------------\n\n`
  textToCopy += `⬡ Q.S ${data.ayah.surahName} (${data.ayah.surahNumber}:${data.ayah.ayahNumber})\n\n`
  textToCopy += `${data.ayah.textArabic}\n\n`
  if (data.ayah.textLatin) {
    textToCopy += `_"${data.ayah.textLatin}"_\n\n`
  }
  textToCopy += `Translation:\n"${currentTranslation}"\n\n`
  textToCopy += `✦ Divine Tafsir & Lore Notes: \n"${customTafsirNote}"\n\n`

  const asmaulSurahMeaning =
    lang === "en" && data.asmaulSurah
      ? ASMAUL_HUSNA_EN[data.asmaulSurah.number] ||
        data.asmaulSurah.translationId
      : data.asmaulSurah?.translationId

  if (data.asmaulSurah) {
    textToCopy += `✨ Surah Pair Runic (#${data.asmaulSurah.number}): ${data.asmaulSurah.nameLatin} (${data.asmaulSurah.nameArabic}) — "${asmaulSurahMeaning}"\n`
  }

  const asmaulAyahMeaning =
    lang === "en" && data.asmaulAyah
      ? ASMAUL_HUSNA_EN[data.asmaulAyah.number] || data.asmaulAyah.translationId
      : data.asmaulAyah?.translationId

  if (data.asmaulAyah) {
    textToCopy += `✨ Ayah Pair Runic (#${data.asmaulAyah.number}): ${data.asmaulAyah.nameLatin} (${data.asmaulAyah.nameArabic}) — "${asmaulAyahMeaning}"\n`
  }

  if (data.hadith) {
    const hText =
      lang === "en"
        ? data.hadith.textEn || data.hadith.textId
        : data.hadith.textId
    textToCopy += `\n◈ Prophetic Hadith (${data.hadith.bookName} No. ${data.hadith.number}):\n"${hText}"\n`
  }

  if (data.wisdom) {
    const wText =
      lang === "en"
        ? data.wisdom.quoteEn || data.wisdom.quote
        : data.wisdom.quote
    const wSource =
      lang === "en"
        ? data.wisdom.sourceEn || data.wisdom.source
        : data.wisdom.source
    textToCopy += `\n◆ Ancient Wisdom & Sacred Lore: \n"${wText}"\n— _${wSource}_\n`
  }

  textToCopy += `\n-------------------------------------------\n`
  textToCopy += `⌗ Official Link: ${dynamicUrl}\n`
  textToCopy += `◈ MoonWitness Platform: When the Moon Witness, We Share Messages.`

  return textToCopy
}

export function buildImagePrompt(transmissionText: string): string {
  return `Bertindaklah sebagai Creative Director yang sangat imajinatif, absurd, dan sangat paham kultur Gen-Z & Gamers. Buatkan konsep dan langsung generate gambar berdasarkan konteks ayat yang dilampirkan.

[PENTING: Gunakan orientasi vertikal (aspect ratio 9:16). Sebelum membuat gambar, ACAK secara otomatis 3 elemen di bawah ini agar hasil gambarnya selalu unik, bervariasi, dan futuristik!]

**1. ACAK FORMAT/MEDIUM GAMBAR (Pilih 1 secara acak):**
- Cinematic Game Poster (Gaya cover game AAA/film dengan teks dramatis).
- Manga/Comic Book Panel (Terdapat panel komik terpisah, garis aksi cepat, dan efek suara komik).
- RPG Game UI Screen (Gambar seolah-olah screenshot dari game, lengkap dengan Bar HP, Inventory, dan kotak dialog).
- Analytical Infographic (Banyak elemen grafis analitis, statistik visual, peta digital, dan data informatif).
- Rare Trading Card (Desain seperti kartu TCG kartu koleksi, lengkap dengan bintang/status card).

**2. ACAK GAYA VISUAL (Pilih 1 secara acak):**
- Modern Street-art (Pencahayaan terang, dinamis, jalanan modern)
- Y2K Retro-Futurism (Gaya estetika tahun 2000-an, material krom, warna pop cerah)
- Mecha / Anime Art (Gaya mecha Jepang, dramatis, kosmik, ledakan energi)
- Synthwave Vector (Warna gradien tajam, estetika 80-an retro-modern)

**3. ACAK KOMPOSISI KONTRAS (Pilih 1 secara acak untuk membedakan "Makna Spiritual" vs "Kelakuan Manusia Zaman Now"):**
- Diagonal Split-Screen (Terpotong miring secara tajam dan dramatis).
- Digital Projection (Satu adegan adalah dunia nyata, adegan lain diproyeksikan dari kacamata VR/layar raksasa).
- Mirror/Puddle Reflection (Karakter melihat ke cermin/genangan air, tapi bayangan yang dipantulkan adalah realitas yang berbeda).
- Dimension Portal (Gambar terbagi ke dua ruang realitas yang berbeda).

**Instruksi Elemen Tetap (Wajib Ada di semua format):**
1. **JUDUL BESAR**: "GOD PROMISE - [1-2 Kata Bahasa Inggris]". Kata tambahannya harus bergaya dinamis menyesuaikan ayat. Gunakan font modern tebal.
2. **KARAKTER UTAMA**: 
   - **"Rocksoul"**: Visualisasikan mirip Crayon Shinchan tapi memakai hoodie techwear/gamer, kacamata futuristik/headset RGB, ekspresi tengil & absurd.
   - **"Master"**: Visualisasikan mirip Master Muthen Roshi tapi bergaya cyborg/cyberpunk.
   - **Karakter Ekstra (Opsional/Acak)**: Robot kecil lucu bergaya Arale.
3. **TEKS DOA (Dalam Gambar)**: Buatkan kotak teks/balon dialog berisi doa absurd/lucu maksimal 1-2 kalimat.
   - Wajib diawali kata: "Biiznillah,".
   - Wajib menyebutkan Asmaul Husna yang terlampir di data konteks.
   - Doanya harus spesifik, tajam, dan menyindir kelakuan "NPC/manusia zaman now" sesuai konteks ayat.
4. **FOOTER/QUOTES BAWAH**: 1 kalimat penutup di bawah gambar yang absurd, bergaya bahasa Gen-Z, tapi menyimpan pukulan hikmah yang dalam.

*(SANGAT KRITIKAL: Pastikan penulisan teks di dalam gambar dieja dengan bahasa Indonesia/Inggris yang sangat akurat tanpa typo!)*

Gunakan data konteks di bawah ini sebagai bahan racikanmu, pilih racikan elemen yang paling epik, lalu silakan langsung generate gambarnya:

=== KONTEKS TRANSMISSION LENGKAP ===
${transmissionText}`
}
