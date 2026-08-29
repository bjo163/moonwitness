import type {
  UserProfile,
  SystemStatus,
} from "@workspace/types"
import type { NotificationItem } from "../stores/notification-store"
import type { BookmarkItem } from "../stores/bookmark-store"

export type CrossPortalEvents = {
  AUTH_SESSION_CHANGE: { user: UserProfile; token: string }
  AUTH_LOGOUT: Record<string, never>
  NOTIFICATION_PUSH: { notification: NotificationItem }
  BOOKMARK_SYNC: { bookmarks: BookmarkItem[] }
  SYSTEM_STATUS_CHANGE: { status: SystemStatus }
  ACHIEVEMENT_UNLOCKED: { achievementId: string; points: number }
}
