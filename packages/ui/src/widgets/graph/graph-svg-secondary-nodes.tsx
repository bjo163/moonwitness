import React from "react"

export function GraphSvgSecondaryNodes() {
  return (
    <>
      {/* 5. CATEGORY: ASTRONOMY */}
      <g transform="translate(250,50)">
        <circle
          r="30"
          className="stroke-warning fill-black"
          strokeWidth="2"
          filter="url(#svg-glow-yellow)"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="15"
          ry="5"
          fill="none"
          className="stroke-warning"
          strokeWidth="1.5"
          transform="rotate(-20)"
        />
        <circle
          cx="0"
          cy="0"
          r="8"
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
          ASTRONOMY
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          2,143 Events
        </text>
      </g>

      {/* 6. CATEGORY: CONCEPTS */}
      <g transform="translate(150,200)">
        <circle
          r="30"
          className="fill-black stroke-primary"
          strokeWidth="2"
          filter="url(#glow-cyan)"
        />
        <path
          d="M0,8 L0,12 M-5,8 L5,8"
          className="stroke-primary"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="0"
          cy="-2"
          r="8"
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
          CONCEPTS
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          3,218 Concepts
        </text>
      </g>

      {/* 7. CATEGORY: LOCATIONS */}
      <g transform="translate(0,220)">
        <circle
          r="30"
          className="fill-black stroke-secondary"
          strokeWidth="2"
          filter="url(#svg-glow-cyan)"
        />
        <path
          d="M0,12 Q-10,0 -10,-5 A10,10 0 1,1 10,-5 Q10,0 0,12 Z"
          fill="none"
          className="stroke-secondary"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="-5"
          r="3"
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
          LOCATIONS
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          1,842 Places
        </text>
      </g>

      {/* 8. CATEGORY: CIVILIZATIONS */}
      <g transform="translate(-150,200)">
        <circle
          r="30"
          className="stroke-knowledge fill-black"
          strokeWidth="2"
          filter="url(#glow-purple)"
        />
        <path
          d="M-10,10 L0,-10 L10,10 Z M-5,0 L5,0"
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
          CIVILIZATIONS
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          96 Civilizations
        </text>
      </g>

      {/* 9. CATEGORY: HISTORY */}
      <g transform="translate(-250,50)">
        <circle
          r="30"
          className="stroke-success fill-black"
          strokeWidth="2"
          filter="url(#glow-emerald)"
        />
        <path
          d="M-10,10 L10,10 M-8,10 L-8,-5 M0,10 L0,-5 M8,10 L8,-5 M-10,-5 L10,-5 L0,-12 Z"
          fill="none"
          className="stroke-success"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="45"
          textAnchor="middle"
          className="fill-success"
          fontSize="10"
          fontWeight="bold"
          letterSpacing="1"
        >
          HISTORY
        </text>
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-white/50"
          fontSize="8"
        >
          12,842 Events
        </text>
      </g>

      {/* ==== CHILD NODES ==== */}
      <g transform="translate(-380,-120)">
        <circle
          r="14"
          className="fill-black stroke-primary"
          strokeWidth="2"
          filter="url(#glow-cyan)"
        />
        <circle
          r="18"
          fill="none"
          className="animate-[spin_4s_linear_infinite] stroke-primary"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text
          x="22"
          y="3"
          className="fill-white"
          fontSize="10"
          fontWeight="bold"
        >
          Ibrahim (AS)
        </text>
        <rect
          x="-10"
          y="-8"
          width="8"
          height="8"
          rx="4"
          fill="none"
          className="stroke-primary"
          strokeWidth="1"
        />
      </g>
      <g transform="translate(-300,-220)">
        <circle
          r="10"
          className="fill-black stroke-secondary"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Adam (AS)
        </text>
      </g>
      <g transform="translate(-350,-180)">
        <circle
          r="10"
          className="fill-black stroke-secondary"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Noah (AS)
        </text>
      </g>
      <g transform="translate(-360,-60)">
        <circle
          r="10"
          className="fill-black stroke-secondary"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Musa (AS)
        </text>
      </g>
      <g transform="translate(-310,-20)">
        <circle
          r="10"
          className="fill-black stroke-secondary"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Muhammad (SAW)
        </text>
      </g>
      <g transform="translate(-50,-280)">
        <circle
          r="10"
          className="stroke-warning fill-black"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Al-Baqarah
        </text>
      </g>
      <g transform="translate(50,-290)">
        <circle
          r="10"
          className="stroke-warning fill-black"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Al-Fatihah
        </text>
      </g>
      <g transform="translate(80,290)">
        <circle
          r="10"
          className="fill-black stroke-secondary"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Makkah
        </text>
      </g>
      <g transform="translate(-380,-10)">
        <circle
          r="10"
          className="stroke-success fill-black"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Creation of Adam
        </text>
      </g>
      <g transform="translate(350,-10)">
        <circle
          r="10"
          className="stroke-warning fill-black"
          strokeWidth="1.5"
        />
        <text x="15" y="3" className="fill-white/60" fontSize="9">
          Moon Phases
        </text>
      </g>
    </>
  )
}
