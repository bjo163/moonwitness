type SecondaryNode = { x: number; y: number; label: string; detail: string; tone: string }

const nodes: SecondaryNode[] = [
  { x: 250, y: 50, label: "Astronomy", detail: "2,143 events", tone: "warning" },
  { x: 150, y: 200, label: "Concepts", detail: "3,218 concepts", tone: "primary" },
  { x: 0, y: 220, label: "Ethics", detail: "1,008 principles", tone: "success" },
  { x: -150, y: 200, label: "Civilizations", detail: "96 civilizations", tone: "accent" },
  { x: -250, y: 50, label: "Eschatology", detail: "12,842 events", tone: "secondary" },
]
const leaves: SecondaryNode[] = [
  { x: -380, y: -120, label: "Prophet histories", detail: "", tone: "secondary" }, { x: -300, y: -220, label: "Revelation", detail: "", tone: "warning" }, { x: -350, y: -180, label: "Lineages", detail: "", tone: "secondary" }, { x: -360, y: -60, label: "Signs", detail: "", tone: "primary" }, { x: -310, y: -20, label: "Narratives", detail: "", tone: "primary" }, { x: -50, y: -280, label: "Textual themes", detail: "", tone: "warning" }, { x: 50, y: -290, label: "Cross references", detail: "", tone: "warning" }, { x: 80, y: 290, label: "Moral practice", detail: "", tone: "success" }, { x: -380, y: -10, label: "Historical evidence", detail: "", tone: "accent" }, { x: 350, y: -10, label: "Celestial records", detail: "", tone: "warning" },
]
const toneClasses: Record<string, string> = { warning: "stroke-warning fill-background", primary: "stroke-primary fill-background", success: "stroke-success fill-background", accent: "stroke-accent fill-background", secondary: "stroke-secondary fill-background" }

function SecondaryNode({ node, leaf = false }: { node: SecondaryNode; leaf?: boolean }) {
  const tone = toneClasses[node.tone] || "stroke-primary fill-background"
  const labelTone = (tone.split(" ")[0] || "stroke-primary").replace("stroke", "fill")
  return <g transform={`translate(${node.x},${node.y})`}><circle r={leaf ? 10 : 24} className={tone} strokeWidth="1.5" /><text x="0" y={leaf ? 18 : 36} textAnchor="middle" className={labelTone} fontSize={leaf ? "7" : "9"}>{node.label}</text>{node.detail && <text x="0" y="48" textAnchor="middle" className="fill-white/50" fontSize="7">{node.detail}</text>}</g>
}

function SecondaryLinks() {
  return <g className="stroke-white/10" strokeWidth="0.8" fill="none">{nodes.map((node) => <path key={node.label} d={`M 0,0 L ${node.x},${node.y}`} />)}{leaves.map((node) => <path key={node.label} d={`M 0,0 L ${node.x},${node.y}`} strokeDasharray="2 3" />)}</g>
}

export function GraphSvgSecondaryNodes() {
  return <><SecondaryLinks />{nodes.map((node) => <SecondaryNode key={node.label} node={node} />)}{leaves.map((node) => <SecondaryNode key={node.label} node={node} leaf />)}</>
}
