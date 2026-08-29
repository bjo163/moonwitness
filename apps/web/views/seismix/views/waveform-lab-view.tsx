"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  AudioWaveform,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Waves,
  Zap,
  Radio,
  Download,
  Maximize2,
} from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { Panel, PanelHeader } from "@workspace/ui"

// ── CONSTANTS ────────────────────────────────────────────
const LAB_CANVAS_HEIGHT = 280
const DEFAULT_PARAMS = {
  frequency: 2.0,
  amplitude: 60,
  damping: 0.3,
  phaseShift: 0,
  noiseLevel: 5,
}

type WavePreset = {
  id: string
  name: string
  description: string
  params: typeof DEFAULT_PARAMS
  color: string
  icon: React.ElementType
}

const PRESETS: WavePreset[] = [
  {
    id: "p-wave-shallow",
    name: "P-WAVE SHALLOW (M3.2)",
    description:
      "Typical P-wave from a shallow focus earthquake at ~10km depth",
    params: {
      frequency: 4.0,
      amplitude: 30,
      damping: 0.5,
      phaseShift: 0,
      noiseLevel: 3,
    },
    color: "#00F0FF",
    icon: Zap,
  },
  {
    id: "s-wave-moderate",
    name: "S-WAVE MODERATE (M5.5)",
    description:
      "Secondary wave pattern from moderate earthquake, visible amplitude increase",
    params: {
      frequency: 2.0,
      amplitude: 55,
      damping: 0.25,
      phaseShift: 1.2,
      noiseLevel: 8,
    },
    color: "#FFE600",
    icon: Waves,
  },
  {
    id: "surface-destructive",
    name: "SURFACE WAVE SEVERE (M7.1)",
    description:
      "Rayleigh wave simulation — maximum amplitude, long period, highly destructive",
    params: {
      frequency: 0.8,
      amplitude: 90,
      damping: 0.1,
      phaseShift: 2.5,
      noiseLevel: 18,
    },
    color: "#FF0055",
    icon: Radio,
  },
  {
    id: "volcanic-tremor",
    name: "VOLCANIC TREMOR",
    description:
      "Continuous harmonic tremor associated with magma movement beneath active volcano",
    params: {
      frequency: 6.0,
      amplitude: 20,
      damping: 0.05,
      phaseShift: 0.5,
      noiseLevel: 12,
    },
    color: "#FF9900",
    icon: AudioWaveform,
  },
]

// ── PARAMETER SLIDER ─────────────────────────────────────
function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
  color,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  unit?: string
  color: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-mono text-[9px]">
        <span className="font-bold tracking-widest text-primary uppercase">
          {label}
        </span>
        <span className="font-bold" style={{ color }}>
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit && <span className="ml-0.5 text-primary">{unit}</span>}
        </span>
      </div>
      <div className="relative h-2 w-full bg-white/5">
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}40, ${color})`,
            boxShadow: `0 0 8px ${color}30`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

// ── WAVEFORM CANVAS ──────────────────────────────────────
function LabCanvas({
  isPlaying,
  params,
  color,
}: {
  isPlaying: boolean
  params: typeof DEFAULT_PARAMS
  color: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const tRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const mid = h / 2

    ctx.clearRect(0, 0, w, h)

    // Background grid
    ctx.strokeStyle = "rgba(0, 240, 255, 0.04)"
    ctx.lineWidth = 0.5
    for (let gy = 0; gy < h; gy += 16) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(w, gy)
      ctx.stroke()
    }
    for (let gx = 0; gx < w; gx += 16) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, h)
      ctx.stroke()
    }

    // Center line
    ctx.strokeStyle = "rgba(0, 240, 255, 0.1)"
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(0, mid)
    ctx.lineTo(w, mid)
    ctx.stroke()
    ctx.setLineDash([])

    // Amplitude scale markers
    ctx.fillStyle = "rgba(0, 240, 255, 0.2)"
    ctx.font = "8px monospace"
    const scalePositions = [0.25, 0.5, 0.75]
    scalePositions.forEach((pos) => {
      const y = h * pos
      ctx.fillText(`${((0.5 - pos) * 200).toFixed(0)}`, 4, y - 2)
    })

    if (!isPlaying && tRef.current === 0) return

    if (isPlaying) tRef.current += 0.05

    const { frequency, amplitude, damping, phaseShift, noiseLevel } = params

    // Draw main waveform
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.beginPath()

    for (let x = 0; x < w; x++) {
      const xNorm = x / w
      const dampFactor = Math.exp(-damping * xNorm * 3)
      const wave1 =
        Math.sin(
          xNorm * Math.PI * 2 * frequency * 10 + tRef.current * 5 + phaseShift
        ) *
        amplitude *
        dampFactor
      const wave2 =
        Math.sin(xNorm * Math.PI * 2 * frequency * 7.3 + tRef.current * 3.7) *
        (amplitude * 0.3) *
        dampFactor
      const noise = (Math.random() - 0.5) * noiseLevel * dampFactor
      const y = mid + wave1 + wave2 + noise

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    // Ghost trail (previous wave)
    ctx.globalAlpha = 0.15
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = 0; x < w; x++) {
      const xNorm = x / w
      const dampFactor = Math.exp(-damping * xNorm * 3)
      const wave1 =
        Math.sin(
          xNorm * Math.PI * 2 * frequency * 10 +
            (tRef.current - 0.3) * 5 +
            phaseShift
        ) *
        amplitude *
        dampFactor
      const y = mid + wave1
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1

    animRef.current = requestAnimationFrame(draw)
  }, [isPlaying, params, color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (parent) {
      canvas.width = parent.clientWidth
      canvas.height = LAB_CANVAS_HEIGHT
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${LAB_CANVAS_HEIGHT}px` }}
    />
  )
}

// ── MAIN VIEW ────────────────────────────────────────────
export function WaveformLabView() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activePreset, setActivePreset] = useState<string>("p-wave-shallow")
  const [params, setParams] = useState({ ...DEFAULT_PARAMS })
  const [activeColor, setActiveColor] = useState("#00F0FF")

  const applyPreset = (preset: WavePreset) => {
    setActivePreset(preset.id)
    setParams({ ...preset.params })
    setActiveColor(preset.color)
  }

  const resetParams = () => {
    setParams({ ...DEFAULT_PARAMS })
    setActiveColor("#00F0FF")
    setActivePreset("")
    setIsPlaying(false)
  }

  const updateParam = (key: keyof typeof DEFAULT_PARAMS, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
    setActivePreset("")
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-20 sm:px-6">
      <ContextBlock
        title="WAVEFORM LABORATORY"
        subtitle="Interactive seismic waveform synthesizer. Manipulate frequency, amplitude, damping, and phase parameters to simulate different earthquake wave patterns."
        operation="WAVEFORM.LAB"
        status={isPlaying ? "SIMULATING" : "READY"}
        accentColor="accent"
      />

      {/* Preset selector */}
      <Panel level="level3" accentColor="accent">
        <PanelHeader
          title="WAVE PRESETS"
          icon={AudioWaveform}
          status={`${PRESETS.length} PATTERNS`}
          accentColor="accent"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((preset) => {
            const Icon = preset.icon
            const isActive = activePreset === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="rounded-xl border border-border/40 bg-card/90 w-full border p-3 text-left transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderColor: isActive
                    ? `${preset.color}50`
                    : "rgba(0,240,255,0.1)",
                  boxShadow: isActive ? `0 0 20px ${preset.color}20` : "none",
                  background: isActive ? `${preset.color}05` : "transparent",
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon
                    className="h-3.5 w-3.5"
                    style={{ color: preset.color }}
                  />
                  <span
                    className="font-mono text-[8px] font-bold tracking-widest"
                    style={{ color: preset.color }}
                  >
                    {preset.name}
                  </span>
                </div>
                <p className="font-mono text-[7px] leading-relaxed text-primary">
                  {preset.description}
                </p>
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Waveform canvas + controls */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Canvas */}
        <Panel level="level1" accentColor="accent" className="lg:col-span-2">
          <PanelHeader
            title="WAVEFORM OUTPUT"
            icon={AudioWaveform}
            status={isPlaying ? "LIVE" : "PAUSED"}
            accentColor="accent"
          />

          <div
            className="relative overflow-hidden border"
            style={{
              borderColor: `${activeColor}20`,
              background: "rgba(5, 7, 10, 0.9)",
            }}
          >
            <LabCanvas
              isPlaying={isPlaying}
              params={params}
              color={activeColor}
            />

            {/* Overlay labels */}
            <div className="absolute top-2 right-3 font-mono text-[7px] font-bold tracking-widest text-primary">
              SEISMIX WAVEFORM LAB V1.0
            </div>
            <div className="absolute bottom-2 left-3 font-mono text-[8px]">
              <span style={{ color: activeColor }}>◉ OUTPUT CHANNEL</span>
              <span className="ml-3 text-primary">
                FREQ: {params.frequency.toFixed(1)} Hz • AMP:{" "}
                {params.amplitude.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Transport controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 border px-4 py-2 font-mono text-[10px] font-bold tracking-widest transition-all "
              style={{
                borderColor: isPlaying
                  ? "rgba(0, 255, 102, 0.4)"
                  : `${activeColor}40`,
                color: isPlaying ? "#00FF66" : activeColor,
                background: isPlaying
                  ? "rgba(0, 255, 102, 0.08)"
                  : `${activeColor}08`,
              }}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />[ PAUSE ]
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />[ SIMULATE ]
                </>
              )}
            </button>
            <button
              onClick={resetParams}
              className="flex items-center gap-2 border border-primary/20 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-primary transition-all  hover:border-primary/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              RESET
            </button>
          </div>
        </Panel>

        {/* Parameter controls */}
        <Panel level="level2" accentColor="system">
          <PanelHeader
            title="PARAMETERS"
            icon={Sliders}
            status="ADJUSTABLE"
            accentColor="system"
          />

          <div className="space-y-5">
            <ParamSlider
              label="FREQUENCY"
              value={params.frequency}
              min={0.1}
              max={10}
              step={0.1}
              onChange={(v) => updateParam("frequency", v)}
              unit="Hz"
              color="#00F0FF"
            />
            <ParamSlider
              label="AMPLITUDE"
              value={params.amplitude}
              min={5}
              max={120}
              step={1}
              onChange={(v) => updateParam("amplitude", v)}
              color="#FFE600"
            />
            <ParamSlider
              label="DAMPING"
              value={params.damping}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateParam("damping", v)}
              color="#FF9900"
            />
            <ParamSlider
              label="PHASE SHIFT"
              value={params.phaseShift}
              min={0}
              max={6.28}
              step={0.1}
              onChange={(v) => updateParam("phaseShift", v)}
              unit="rad"
              color="#A100FF"
            />
            <ParamSlider
              label="NOISE LEVEL"
              value={params.noiseLevel}
              min={0}
              max={30}
              step={1}
              onChange={(v) => updateParam("noiseLevel", v)}
              color="#FF0055"
            />
          </div>

          <div className="mt-5 border-t border-primary/10 pt-3">
            <p className="font-mono text-[7px] leading-relaxed text-primary">
              ADJUST PARAMETERS TO OBSERVE WAVEFORM BEHAVIOR. FREQUENCY CONTROLS
              OSCILLATION RATE. DAMPING REDUCES AMPLITUDE OVER DISTANCE. NOISE
              SIMULATES GEOLOGICAL INTERFERENCE.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}
