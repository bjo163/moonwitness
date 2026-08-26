import { Suspense } from "react"
import { ErpProfileView } from "../../views/profile-view"

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ErpProfileView />
    </Suspense>
  )
}