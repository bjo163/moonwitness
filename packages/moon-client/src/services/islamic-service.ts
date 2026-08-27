import { apiGet } from "../api-client"
import { API_ENDPOINTS } from "../endpoints"

export class IslamicService {
  static async getPrayerTimes(lat?: number, lng?: number) {
    const endpoint =
      lat && lng
        ? `${API_ENDPOINTS.ISLAMIC.PRAYER_TIMES}?lat=${lat}&lng=${lng}`
        : API_ENDPOINTS.ISLAMIC.PRAYER_TIMES
    return apiGet(endpoint)
  }

  static async getHijriDate(dateStr?: string) {
    const endpoint = dateStr
      ? `${API_ENDPOINTS.ISLAMIC.HIJRI_DATE}?date=${dateStr}`
      : API_ENDPOINTS.ISLAMIC.HIJRI_DATE
    return apiGet(endpoint)
  }

  static async getQiblaDirection(lat?: number, lng?: number) {
    const endpoint =
      lat && lng
        ? `${API_ENDPOINTS.ISLAMIC.QIBLA}?lat=${lat}&lng=${lng}`
        : API_ENDPOINTS.ISLAMIC.QIBLA
    return apiGet(endpoint)
  }
}
