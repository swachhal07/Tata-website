import { useEffect, useRef, useState } from 'react'

export default function TextHoverEffect({ text, className = '' }) {
  const svgRef = useRef(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' })

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const cxPercentage = ((cursor.x - rect.left) / rect.width) * 100
      const cyPercentage = ((cursor.y - rect.top) / rect.height) * 100
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` })
    }
  }, [cursor])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 600 100"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`cursor-pointer select-none uppercase ${className}`}
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f37022" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          cx={maskPosition.cx}
          cy={maskPosition.cy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Base stroke — appears faintly when hovered */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        fontSize="70"
        className="fill-transparent stroke-neutral-700 font-sans font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>

      {/* Animated draw-in stroke — orange */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        fontSize="70"
        className="fill-transparent stroke-[#f37022] font-sans font-bold"
        style={{
          strokeDasharray: 1000,
          animation: 'stroke-draw 4s ease-in-out forwards',
        }}
      >
        {text}
      </text>

      {/* Reveal layer — colourful gradient inside the cursor mask */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        fontSize="70"
        className="fill-transparent font-sans font-bold"
      >
        {text}
      </text>
    </svg>
  )
}

export function FooterBackgroundGradient() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)',
      }}
    />
  )
}
