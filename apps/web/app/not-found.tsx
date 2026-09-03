"use client"

import Link from "next/link"
import { EmptyState, Button } from "@workspace/ui"
import { ContentWrapper } from "@/components/layouts/content-wrapper"
import { Compass } from "lucide-react"

export default function NotFound() {
  return (
    <ContentWrapper className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={Compass}
          title="COORDINATES NOT FOUND"
          description="The celestial sector or scriptural reference you are looking for does not exist in the current database."
        />
        <div className="mt-6 flex justify-center">
          <Link href="/">
            <Button variant="default">RETURN TO operations overview</Button>
          </Link>
        </div>
      </div>
    </ContentWrapper>
  )
}
