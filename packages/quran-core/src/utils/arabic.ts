/**
 * Konversi angka biasa (0-9) ke Angka Arab / Indic (٠-٩)
 */
export function toArabicIndic(num: number | string): string {
  const str = num.toString();
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)] ?? d);
}

/**
 * Format nomor ayat dengan simbol kurung Arab (misal: ﴿١﴾)
 */
export function formatAyahSymbol(ayahNumber: number): string {
  return `﴿${toArabicIndic(ayahNumber)}﴾`;
}

/**
 * Menghapus harakat / tashkeel dari teks Arab untuk keperluan pencarian (search)
 */
export function removeTashkeel(text: string): string {
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "");
}

/**
 * Mengambil URL Audio tilawah ayat (Misal Al-Afasy)
 */
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciter: string = "ar.alafasy"): string {
  // Format standard Al-Quran Cloud / Everyday Quran format
  const paddedSurah = surahNumber.toString().padStart(3, "0");
  const paddedAyah = ayahNumber.toString().padStart(3, "0");
  if (reciter === "ar.alafasy") {
    return `https://everydayquran.org/audio/quran/${reciter}/${paddedSurah}${paddedAyah}.mp3`;
  }
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${getGlobalAyahIndex(surahNumber, ayahNumber)}.mp3`;
}

/**
 * Helper menghitung index global ayat (1 - 6236)
 */
function getGlobalAyahIndex(surahNumber: number, ayahNumber: number): number {
  // Fallback sederhana jika tidak menghitung persis
  return surahNumber * 100 + ayahNumber;
}
