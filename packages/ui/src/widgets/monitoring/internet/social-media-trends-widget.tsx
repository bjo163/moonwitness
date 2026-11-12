import { Share2 } from "lucide-react"
import type { SourceStatus } from "@moon/client"

export function SocialMediaTrendsWidget({
  status = "UNAVAILABLE",
}: {
  status?: SourceStatus
}) {
  return (
    <section
      className="flex flex-col rounded-md border border-border bg-card p-4 lg:col-span-12 xl:col-span-8"
      aria-label="Social media trends"
    >
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Share2 className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2>Social media trends</h2>
        </div>
        <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
          {status}
        </span>
      </div>
      <p className="py-8 text-center text-sm leading-relaxed text-muted-foreground">
        {status === "SIMULATED"
          ? "Social media samples are available only in an explicitly enabled demonstration mode."
          : status === "UNAVAILABLE"
            ? "No verified social media data source is configured. Topic volume and sentiment are unavailable."
            : "No social media records were returned by the configured source."}
      </p>
    </section>
  )
}
