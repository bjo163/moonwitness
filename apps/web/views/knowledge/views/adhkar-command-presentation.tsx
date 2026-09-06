import { Activity, ArrowRight, Moon, Shield, Sun, Sunrise } from "lucide-react"

export type Adhkar = {
  id: string
  title: string
  text_arabic: string
  text_latin: string
  translation_en: string
  category: string
  timing: string
  source: string
}

type AdhkarCommandPresentationProps = {
  data: Adhkar[]
  loading: boolean
  activeCategory: string
  activeDzikir: Adhkar | null
  count: number
  targetCount: number
  onCategoryChange: (category: string) => void
  onCloseDzikir: () => void
  onTap: () => void
  onStartDzikir: (item: Adhkar) => void
}

const categories = [
  { id: "Pagi/Petang", label: "Morning & Evening", icon: Sunrise },
  { id: "Setelah Shalat", label: "After Fardhu", icon: Activity },
  { id: "Tidur", label: "Before Sleep", icon: Moon },
  { id: "Harian", label: "Daily Routine", icon: Sun },
]

function AdhkarCounterModal({
  activeDzikir,
  count,
  targetCount,
  onClose,
  onTap,
}: Pick<
  AdhkarCommandPresentationProps,
  "activeDzikir" | "count" | "targetCount" | "onTap"
> & {
  onClose: () => void
}) {
  if (!activeDzikir) return null

  return (
    <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-card p-2 backdrop-blur-md duration-300 fade-in zoom-in sm:p-4">
      <div className="hide-scrollbar relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-background/95 p-6 shadow-sm sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground transition-colors hover:text-foreground"
        >
          Close
        </button>

        <div className="mb-8 text-center">
          <h2 className="mb-2 font-sans text-xl font-bold text-foreground">
            {activeDzikir.title}
          </h2>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Target: {targetCount}
          </p>
        </div>

        <div className="mb-10 text-center">
          <p
            className="font-arabic text-4xl leading-relaxed text-foreground drop-shadow-sm sm:text-5xl"
            dir="rtl"
          >
            {activeDzikir.text_arabic}
          </p>
          <p className="mt-8 font-sans text-sm text-foreground italic">
            {activeDzikir.text_latin}
          </p>
          <p className="mt-4 font-mono text-xs text-primary">
            "{activeDzikir.translation_en}"
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onTap}
            className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 transition-all active:scale-95 ${
              count >= targetCount
                ? "border-emerald-500 bg-success/20 text-success shadow-sm"
                : "border-border bg-primary/10 text-primary shadow-sm hover:shadow-sm"
            }`}
          >
            <span className="font-sans text-5xl font-black">{count}</span>
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 active:opacity-100" />
          </button>

          <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-muted/30">
            <div
              className="h-full bg-gradient-to-r from-primary/10 to-emerald-400 transition-all duration-300"
              style={{
                width: `${Math.min((count / targetCount) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdhkarCommandPresentation({
  data,
  loading,
  activeCategory,
  activeDzikir,
  count,
  targetCount,
  onCategoryChange,
  onCloseDzikir,
  onTap,
  onStartDzikir,
}: AdhkarCommandPresentationProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-20 font-sans sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm backdrop-blur-xl">
          <Shield className="h-8 w-8 text-primary drop-shadow-sm" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-widest text-foreground uppercase drop-shadow-md sm:text-4xl">
          Adhkar Command Center
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-xs tracking-widest text-primary uppercase">
          Spiritual Armor • Divine Remembrance • Inner Peace
        </p>
      </div>

      <div className="hide-scrollbar mb-8 flex snap-x justify-start gap-3 overflow-x-auto pb-4 sm:justify-center">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`flex shrink-0 snap-center items-center gap-2 rounded-full border px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
                isActive
                  ? "border-border bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:text-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {category.label}
            </button>
          )
        })}
      </div>

      <AdhkarCounterModal
        activeDzikir={activeDzikir}
        count={count}
        targetCount={targetCount}
        onClose={onCloseDzikir}
        onTap={onTap}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Shield className="mb-4 h-12 w-12 text-primary" />
          <h3 className="font-mono text-sm tracking-widest text-foreground">
            NO DATA IN DATABASE
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Please seed the database with adhkar records.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-border hover:bg-card hover:shadow-sm"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-sans text-lg font-bold text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <span className="rounded bg-muted/30 px-2 py-1 font-mono text-[8px] tracking-widest text-foreground uppercase">
                    {item.timing}
                  </span>
                </div>
                <p
                  className="mb-4 line-clamp-3 text-right font-arabic text-2xl leading-relaxed text-foreground"
                  dir="rtl"
                >
                  {item.text_arabic}
                </p>
                <p className="line-clamp-2 font-sans text-xs text-muted-foreground italic">
                  {item.text_latin}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-[9px] tracking-widest text-primary/70 uppercase">
                  {item.source}
                </span>
                <button
                  type="button"
                  onClick={() => onStartDzikir(item)}
                  className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-primary transition-colors hover:bg-primary hover:text-foreground"
                >
                  START <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
