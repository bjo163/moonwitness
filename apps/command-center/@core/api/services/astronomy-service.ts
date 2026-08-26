import { apiClient } from "../client"
import { API_ENDPOINTS } from "../endpoints"

export class AstronomyService {
  /**
   * Fetch current moon phase and illumination data.
   */
  static async getMoonPhase() {
    return apiClient.get(API_ENDPOINTS.ASTRONOMY.MOON_PHASE)
  }

  /**
   * Fetch upcoming solar and lunar eclipses.
   */
  static async getUpcomingEclipses() {
    return apiClient.get(API_ENDPOINTS.ASTRONOMY.ECLIPSES)
  }
}
