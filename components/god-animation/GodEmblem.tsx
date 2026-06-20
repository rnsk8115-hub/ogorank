export default function GodEmblem() {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-44 animate-gold-pulse"
    >
      <polygon
        points="100,10 130,50 180,50 145,80 160,120 100,95 40,120 55,80 20,50 70,50"
        stroke="#d4af37"
        strokeWidth="2"
        fill="rgba(212,175,55,0.1)"
      />
      <polygon
        points="100,30 122,58 158,58 132,74 143,104 100,84 57,104 68,74 42,58 78,58"
        stroke="#d4af37"
        strokeWidth="1.5"
        fill="rgba(212,175,55,0.05)"
        opacity="0.6"
      />
      <path
        d="M70 130 Q100 120 130 130 L135 200 Q100 210 65 200 Z"
        stroke="#d4af37"
        strokeWidth="2"
        fill="rgba(212,175,55,0.1)"
      />
      <path d="M80 140 L100 135 L120 140 L122 190 L100 195 L78 190 Z"
        stroke="#d4af37"
        strokeWidth="1"
        fill="rgba(212,175,55,0.05)"
      />
      <line x1="50" y1="125" x2="40" y2="165" stroke="#d4af37" strokeWidth="2" />
      <line x1="150" y1="125" x2="160" y2="165" stroke="#d4af37" strokeWidth="2" />
      <ellipse cx="40" cy="168" rx="8" ry="6" stroke="#d4af37" strokeWidth="1.5" fill="rgba(212,175,55,0.2)" />
      <ellipse cx="160" cy="168" rx="8" ry="6" stroke="#d4af37" strokeWidth="1.5" fill="rgba(212,175,55,0.2)" />
      <text
        x="100"
        y="75"
        textAnchor="middle"
        fill="#d4af37"
        fontSize="16"
        fontFamily="'Share Tech Mono', monospace"
        fontWeight="bold"
        letterSpacing="2"
      >
        GOD
      </text>
    </svg>
  )
}
