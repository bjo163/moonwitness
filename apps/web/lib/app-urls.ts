import { APP_PORTS } from "@workspace/types"

export const commandCenterUrl =
  process.env.NEXT_PUBLIC_COMMAND_CENTER_URL?.trim().replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "development"
    ? `http://localhost:${APP_PORTS.COMMAND_CENTER}`
    : undefined)
