import { apiGet, apiPost } from "../api-client"
import { API_ENDPOINTS } from "../endpoints"

export class ScriptureService {
  static async getQuranSurahs() {
    return apiGet(API_ENDPOINTS.SCRIPTURES.QURAN_SURAHS)
  }

  static async getQuranAyahs(surahNumber: number) {
    return apiGet(API_ENDPOINTS.SCRIPTURES.QURAN_AYAHS(surahNumber))
  }

  static async getHadithBooks() {
    return apiGet(API_ENDPOINTS.HADITHS.BOOKS)
  }

  static async getHadiths(bookId: string, page = 1) {
    return apiGet(API_ENDPOINTS.HADITHS.LIST(bookId, page))
  }

  static async searchHadiths(query: string) {
    return apiPost("/api/hadith/search", { query })
  }
}
