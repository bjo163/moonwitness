import React from "react"

export function GraphSvgPrimaryNodes() {
  return (
    <>
      <defs>
        <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connecting Lines (Center to Categories) */}
      <g className="stroke-white/20" strokeWidth="1.5" fill="none">
        <path d="M 0,0 L -200,-150" />
        <path d="M 0,0 L 0,-200" />
        <path d="M 0,0 L 200,-150" />
        <path d="M 0,0 L 250,50" />
        <path d="M 0,0 L 150,200" />
        <path d="M 0,0 L 0,220" />
        <path d="M 0,0 L -150,200" />
        <path d="M 0,0 L -250,50" />
      </g>

      {/* Connecting Lines (Categories to Children) */}
      <g
        className="stroke-white/15"
        strokeWidth="1"
        fill="none"
        strokeDasharray="3 3"
      >
        <path d="M -200,-150 L -300,-220" />
        <path d="M -200,-150 L -350,-180" />
        <path
          d="M -200,-150 L -380,-120"
          className="stroke-primary opacity-50"
          strokeDasharray="none"
        />
        <path d="M -200,-150 L -360,-60" />

        <path d="M 0,-200 L -50,-280" />
        <path d="M 0,-200 L 50,-290" />
        <path d="M 0,-200 L 100,-260" />
        <path d="M 0,-200 L 120,-200" />

        <path d="M -250,50 L -380,-10" />
        <path d="M -250,50 L -390,30" />
        <path d="M -250,50 L -370,70" />
        <path d="M -250,50 L -340,110" />
        <path d="M -250,50 L -300,140" />

        <path d="M 200,-150 L 280,-220" />
        <path d="M 200,-150 L 330,-180" />
        <path d="M 200,-150 L 350,-130" />
        <path d="M 200,-150 L 330,-80" />

        <path d="M 250,50 L 350,-10" />
        <path d="M 250,50 L 380,30" />
        <path d="M 250,50 L 370,80" />
        <path d="M 250,50 L 330,120" />
        <path d="M 250,50 L 280,150" />

        <path d="M 150,200 L 250,180" />
        <path d="M 150,200 L 280,220" />
        <path d="M 150,200 L 250,260" />
        <path d="M 150,200 L 200,290" />

        <path d="M 0,220 L -80,290" />
        <path d="M 0,220 L 0,310" />
        <path d="M 0,220 L 80,290" />

        <path d="M -150,200 L -250,180" />
        <path d="M -150,200 L -290,220" />
        <path d="M -150,200 L -260,270" />
        <path d="M -150,200 L -200,300" />
      </g>

      {/* Cross Connections */}
      <g
        className="stroke-warning/40"
        strokeWidth="1"
        fill="none"
        strokeDasharray="4 4"
      >
        <path d="M -380,-120 Q -100,50 80,290" />
        <path d="M -380,-120 Q -50,-200 -50,-280" />
      </g>

      {/* ==== NODES ==== */}

      {/* 1. CENTRAL NODE: ALLAH */}
      <g transform="translate(0,0)">
        <circle
          r="45"
          className="stroke-success fill-black"
          strokeWidth="2"
          filter="url(#glow-emerald)"
        />
        <circle
          r="35"
          fill="none"
          className="stroke-success animate-[spin_20s_linear_infinite]"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="0"
          y="-5"
          textAnchor="middle"
          className="font-arabic fill-white"
          fontSize="26"
          fontWeight="bold"
          style={{ direction: "rtl" }}
        >
          اللّٰه
        </text>
        <text
          x="0"
          y="15"
          textAnchor="middle"
          className="fill-success"
          fontSize="12"
          fontWeight="bold"
          letterSpacing="2"
        >
          ALLAH
        </text>
      </g>

      {/* 2. CATEGORY: PROPHETS */}
      <g transform="translate(-200,-150)">
        <circle
          r="30"
          className="fill-black stroke-secondary"
          strokeWidth="2"
          filter="url(#glow-blue)"
        />
        <path
          d="M-8,-5 Q0,-15 8,-5 L10,10 L-10,10 Z"
          fill="none"
          className="stroke-secondary"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="-10"
          r="4"
          fill="none"
          className="stroke-secondary"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="45"
          textAnchor="middle"
          className="fill-secondary"
          fontSize="10"
          fontWeight="bold"
          letterSpacing="1"
        >
          PROPHETS
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          25 Prophets
        </text>
      </g>

      {/* 3. CATEGORY: QUR'AN */}
      <g transform="translate(0,-200)">
        <circle
          r="30"
          className="stroke-warning fill-black"
          strokeWidth="2"
          filter="url(#glow-yellow)"
        />
        <path
          d="M-10,-10 L10,-10 L10,10 L-10,10 Z"
          fill="none"
          className="stroke-warning"
          strokeWidth="1.5"
        />
        <path
          d="M0,-10 L0,10"
          fill="none"
          className="stroke-warning"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="45"
          textAnchor="middle"
          className="fill-warning"
          fontSize="10"
          fontWeight="bold"
          letterSpacing="1"
        >
          QUR&apos;AN
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          6,236 Verses
        </text>
      </g>

      {/* 4. CATEGORY: HADITH */}
      <g transform="translate(200,-150)">
        <circle
          r="30"
          className="stroke-knowledge fill-black"
          strokeWidth="2"
          filter="url(#glow-purple)"
        />
        <path
          d="M-12,-10 L-2,-10 L-2,10 L-12,10 Z"
          fill="none"
          className="stroke-knowledge"
          strokeWidth="1.5"
        />
        <path
          d="M2,-10 L12,-10 L12,10 L2,10 Z"
          fill="none"
          className="stroke-knowledge"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="45"
          textAnchor="middle"
          className="fill-knowledge"
          fontSize="10"
          fontWeight="bold"
          letterSpacing="1"
        >
          HADITH
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          75,234 Hadiths
        </text>
      </g>
    </>
  )
}
