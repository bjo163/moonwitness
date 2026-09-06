"use client"

import { CopyActionsGroup } from "@workspace/ui"

type CopyActionsProps = {
  reference: string
  link: string
}

export function CopyActions({ reference, link }: CopyActionsProps) {
  return (
    <CopyActionsGroup
      label="Citation actions"
      items={[
        { label: "Copy reference", value: reference },
        { label: "Copy citation", value: reference },
        { label: "Copy link", value: link },
      ]}
    />
  )
}

