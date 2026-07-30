import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";

export class SystemService {
  /**
   * Fetch global telemetry (active users, uptime, nodes).
   */
  static async getGlobalTelemetry() {
    return apiClient.get(API_ENDPOINTS.SYSTEM.TELEMETRY);
  }

  /**
   * Fetch global observatory status.
   */
  static async getGlobalStatus() {
    return apiClient.get(API_ENDPOINTS.SYSTEM.GLOBAL_STATUS);
  }

  /**
   * Fetch active mission alerts.
   */
  static async getMissionAlerts() {
    return apiClient.get(API_ENDPOINTS.SYSTEM.MISSION_ALERTS);
  }
}
