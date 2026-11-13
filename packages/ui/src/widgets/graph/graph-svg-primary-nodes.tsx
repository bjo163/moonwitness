type Point = { x: number; y: number }
type Category = Point & { label: string; detail: string; tone: string }

const categories: Category[] = [
  { x: -200, y: -150, label: "Prophets", detail: "25 prophets", tone: "secondary" },
  { x: 0, y: -200, label: "Qur'an", detail: "6,236 verses", tone: "warning" },
  { x: 200, y: -150, label: "Hadith", detail: "75,234 hadiths", tone: "primary" },
  { x: 250, y: 50, label: "Astronomy", detail: "Observatory", tone: "info" },
  { x: 150, y: 200, label: "Ethics", detail: "Moral principles", tone: "success" },
  { x: -150, y: 200, label: "Civilization", detail: "Historical context", tone: "accent" },
  { x: -250, y: 50, label: "Eschatology", detail: "Future events", tone: "primary" },
]
const toneClasses: Record<string, string> = { secondary: "stroke-secondary fill-background", warning: "stroke-warning fill-background", primary: "stroke-primary fill-background", info: "stroke-info fill-background", success: "stroke-success fill-background", accent: "stroke-accent fill-background" }

const spokes: Point[][] = categories.map((category) => [
  { x: 0, y: 0 },
  { x: category.x, y: category.y },
])

function GraphSvgLinks() {
  return <><g className="stroke-white/20" strokeWidth="1.5" fill="none">{spokes.map(([from, to], index) => <path key={`spoke-${index}`} d={`M ${from!.x},${from!.y} L ${to!.x},${to!.y}`} />)}</g><g className="stroke-white/10" strokeWidth="1" strokeDasharray="3 3" fill="none">{categories.map((category, index) => { const next = categories[(index + 1) % categories.length]!; return <path key={`ring-${index}`} d={`M ${category.x},${category.y} L ${next.x},${next.y}`} /> })}</g><g className="stroke-accent/30" strokeWidth="1" strokeDasharray="4 4" fill="none"><path d="M -200,-150 Q 0,-70 200,-150" /><path d="M 0,-200 Q 150,-50 250,50" /><path d="M 250,50 Q 50,150 -150,200" /><path d="M -250,50 Q -50,50 150,200" /></g></>
}

function GraphSvgCategoryNode({ category }: { category: Category }) {
  const tone = toneClasses[category.tone] || "stroke-primary fill-background"
  const labelTone = (tone.split(" ")[0] || "stroke-primary").replace("stroke", "fill")
  return <g transform={`translate(${category.x},${category.y})`}><circle r="30" className={tone} strokeWidth="2" /><circle r="7" className={tone} strokeWidth="1.5" /><text x="0" y="45" textAnchor="middle" className={labelTone} fontSize="10" fontWeight="600">{category.label}</text><text x="0" y="58" textAnchor="middle" className="fill-white/60" fontSize="8">{category.detail}</text></g>
}

function GraphSvgCenterNode() {
  return <g transform="translate(0,0)"><circle r="45" className="fill-background stroke-success" strokeWidth="2" /><circle r="35" fill="none" className="stroke-success" strokeWidth="1" strokeDasharray="4 4" /><text x="0" y="-5" textAnchor="middle" className="font-arabic fill-white" fontSize="26" fontWeight="bold" style={{ direction: "rtl" }}>اللّٰه</text><text x="0" y="15" textAnchor="middle" className="fill-success" fontSize="12" fontWeight="600">Allah</text></g>
}

export function GraphSvgPrimaryNodes() {
  return <><GraphSvgLinks /><GraphSvgCenterNode />{categories.map((category) => <GraphSvgCategoryNode key={category.label} category={category} />)}</>
}
