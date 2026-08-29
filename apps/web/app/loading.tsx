export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="panel-glass animate-pulse mb-6 h-6 w-48 rounded-full" />
          <div className="panel-glass animate-pulse mb-4 h-14 w-80 rounded-xl" />
          <div className="panel-glass animate-pulse h-8 w-96 max-w-full rounded-xl opacity-60" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="panel-glass animate-pulse mb-6 h-12 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="panel-glass animate-pulse h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
