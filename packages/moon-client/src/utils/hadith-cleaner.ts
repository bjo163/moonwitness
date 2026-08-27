/**
 * Clean & Format Raw Hadith Text to be Real, Concise, Clear, and Authentic for Jamaah
 */
export function cleanHadithText(rawText: string): string {
  if (!rawText) return ""

  let cleaned = rawText

  // 1. Remove long scholastic debate footnotes
  const footnoteIndex = cleaned.search(
    /(Abu Isa berkata|Imam Syafi'i|Imam Ahmad|Para ulama berselisih|Dalam bab ini)/i
  )
  if (footnoteIndex > 100) {
    cleaned = cleaned.substring(0, footnoteIndex).trim()
  }

  // 2. Extract Sahabat Perawi Utama
  let companion = ""
  const companionMatch = cleaned.match(/dari\s+\[?([A-Za-z\s]+)\]?\s+bahwa/i)
  if (companionMatch && companionMatch[1]) {
    companion = companionMatch[1].trim()
  }

  // 3. Extract Core Matan
  const matanMatch = cleaned.match(
    /(bahwa\s+(Nabi|Rasulullah|beliau|seseorang)[\s\S]+)/i
  )
  if (matanMatch && matanMatch[1]) {
    cleaned = matanMatch[1].trim()
  } else {
    // Fallback: Strip bracket tokens [Name] -> Name
    cleaned = cleaned.replace(/\[([^\]]+)\]/g, "$1")
    cleaned = cleaned.replace(/^Telah menceritakan kepada kami [^:]+:\s*/i, "")
  }

  // Capitalize opening & add Sahabat narrator prefix if extracted
  if (companion) {
    cleaned = `Dari ${companion} r.a., ${cleaned}`
  } else if (!cleaned.startsWith("Dari") && !cleaned.startsWith("Bahwa")) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  // Normalize spaces & cleanup punctuation
  cleaned = cleaned.replace(/\s+/g, " ").trim()

  return cleaned
}
