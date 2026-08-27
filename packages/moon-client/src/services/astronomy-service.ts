import { apiGet } from "../api-client"
import { API_ENDPOINTS } from "../endpoints"

export class AstronomyService {
  static async getMoonPhase() {
    return apiGet(API_ENDPOINTS.ASTRONOMY.MOON_PHASE)
  }

  static async getUpcomingEclipses() {
    return apiGet(API_ENDPOINTS.ASTRONOMY.ECLIPSES)
  }
}
