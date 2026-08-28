import React, { useMemo } from "react"
import { createAvatar } from "@dicebear/core"
import { micah } from "@dicebear/collection"

export interface AutoAvatarProps {
  seed: string
  size?: number
  className?: string
}

export function AutoAvatar({ seed, size = 40, className = "" }: AutoAvatarProps) {
  const avatarSvg = useMemo(() => {
    try {
      const avatar = createAvatar(micah, {
        seed,
        size,
        // Match Moonwitness OS dark/cyberpunk/space theme
        backgroundColor: ["transparent"],
        baseColor: ["f9c9b6", "ac6651", "77311d", "e0a39a"], // Human skin tones
        shirtColor: ["05070a", "0891b2", "d946ef", "1e293b", "06b6d4", "000000"], // Space black, cyans, magenta
        hairColor: ["000000", "1e293b", "ffffff", "d946ef", "0891b2"], // Black, gray, white, or dyed cyan/magenta
        radius: 50,
      })
      const svgStr = avatar.toString()
      // Strip any malicious script/event handlers
      return svgStr
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    } catch {
      return ""
    }
  }, [seed, size])

  if (!avatarSvg) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="font-mono text-xs uppercase">{seed.slice(0, 2)}</span>
      </div>
    )
  }

  // Sanitized SVG vector rendering
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-cyan-900/40 border border-cyan-500/30 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  )
}
