import { apiClient } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import { SYSTEM_CONSTANTS } from "../../tokens/constants"

export class IslamicService {
  /**
   * Fetch daily prayer times for a specific location.
   */
  static async getPrayerTimes(
    date: string,
    lat = SYSTEM_CONSTANTS.JAKARTA_LAT,
    lng = SYSTEM_CONSTANTS.JAKARTA_LNG
  ) {
    return apiClient.get(
      `${API_ENDPOINTS.ISLAMIC.PRAYER_TIMES}?date=${date}&latitude=${lat}&longitude=${lng}&method=2`
    )
  }

  /**
   * Fetch specific Surah from the Qur'an.
   */
  static async getSurah(surahNumber: number) {
    return apiClient.get(
      `${API_ENDPOINTS.ISLAMIC.QURAN}/surah/${surahNumber}/en.asad`
    )
  }

  /**
   * Search within the Qur'an text.
   */
  static async searchQuran(keyword: string) {
    return apiClient.get(
      `${API_ENDPOINTS.ISLAMIC.QURAN}/search/${keyword}/all/en`
    )
  }
}
