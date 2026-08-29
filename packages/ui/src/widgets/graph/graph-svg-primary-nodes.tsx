import React from "react"

export function GraphSvgPrimaryNodes() {
  return (
    <>
      <defs>
        <filter id="node-shadow-emerald" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-shadow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-shadow-blue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-shadow-yellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-shadow-purple" x="-50%" y="-50%" width="200%" height="200%">
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
        <path d="M 0,0 L -150,200" />
        <path d="M 0,0 L -250,50" />
      </g>

      {/* Category Inter-connections */}
      <g className="stroke-white/10" strokeWidth="1" strokeDasharray="3 3" fill="none">
        <path d="M -200,-150 L 0,-200" />
        <path d="M 0,-200 L 200,-150" />
        <path d="M 200,-150 L 250,50" />
        <path d="M 250,50 L 150,200" />
        <path d="M 150,200 L -150,200" />
        <path d="M -150,200 L -250,50" />
        <path d="M -250,50 L -200,-150" />
      </g>

      {/* Level 2 Entity Connections */}
      <g className="stroke-white/5" strokeWidth="0.8" fill="none">
        {/* Prophets entities */}
        <path d="M -200,-150 L -280,-190" />
        <path d="M -200,-150 L -290,-130" />
        <path d="M -200,-150 L -240,-220" />
        {/* Qur'an entities */}
        <path d="M 0,-200 L -60,-270" />
        <path d="M 0,-200 L 0,-280" />
        <path d="M 0,-200 L 60,-270" />
        {/* Hadith entities */}
        <path d="M 200,-150 L 280,-190" />
        <path d="M 200,-150 L 290,-130" />
        <path d="M 200,-150 L 240,-220" />
        {/* Astronomy entities */}
        <path d="M 250,50 L 330,20" />
        <path d="M 250,50 L 340,70" />
        <path d="M 250,50 L 320,110" />
        {/* Ethics entities */}
        <path d="M 150,200 L 200,270" />
        <path d="M 150,200 L 140,285" />
        <path d="M 150,200 L 225,230" />
        {/* Civilization entities */}
        <path d="M -150,200 L -200,270" />
        <path d="M -150,200 L -140,285" />
        <path d="M -150,200 L -225,230" />
        {/* Eschatology entities */}
        <path d="M -250,50 L -330,20" />
        <path d="M -250,50 L -340,70" />
        <path d="M -250,50 L -320,110" />
      </g>

      {/* Cross-Domain Insight Connections (Dashed Gold) */}
      <g className="stroke-accent/30" strokeWidth="1" strokeDasharray="4 4" fill="none">
        <path d="M -200,-150 Q 0,-70 200,-150" />
        <path d="M 0,-200 Q 150,-50 250,50" />
        <path d="M 250,50 Q 50,150 -150,200" />
        <path d="M -250,50 Q -50,50 150,200" />
      </g>

      {/* ==== NODES ==== */}

      {/* 1. CENTRAL NODE: ALLAH */}
      <g transform="translate(0,0)">
        <circle
          r="45"
          className="stroke-success fill-black"
          strokeWidth="2"
          filter="url(#node-shadow-emerald)"
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
          filter="url(#node-shadow-cyan)"
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
          filter="url(#node-shadow-yellow)"
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
          className="stroke-primary fill-black"
          strokeWidth="2"
          filter="url(#node-shadow-purple)"
        />
        <path
          d="M-12,-10 L-2,-10 L-2,10 L-12,10 Z"
          fill="none"
          className="stroke-primary"
          strokeWidth="1.5"
        />
        <path
          d="M2,-10 L12,-10 L12,10 L2,10 Z"
          fill="none"
          className="stroke-primary"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="45"
          textAnchor="middle"
          className="fill-primary"
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
