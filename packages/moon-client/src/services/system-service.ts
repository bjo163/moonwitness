import { apiGet } from "../api-client"
import { API_ENDPOINTS } from "../endpoints"

export class SystemService {
  static async getHealth() {
    return apiGet(API_ENDPOINTS.SYSTEM.HEALTH)
  }

  static async getMetrics() {
    return apiGet(API_ENDPOINTS.SYSTEM.METRICS)
  }
}
