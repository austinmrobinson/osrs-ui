// Blume Logo slot: our own stylised mark, after the OSRS Wiki's treatment. "OSRS" on four
// rune stones over a maroon ribbon that reads "UI". Drawn here; no Jagex artwork.
const STONES = [
  { x: 3, y: 3, r: -4, letter: "O" },
  { x: 27, y: 1, r: 3, letter: "S" },
  { x: 51, y: 2, r: -2, letter: "R" },
  { x: 75, y: 3, r: 4, letter: "S" },
];

/** The mark on its own, at any width (height follows the 100 x 54 artwork). */
export function LogoMark({ width = 92, className }: { width?: number; className?: string }) {
  return (
      <svg viewBox="0 0 100 54" width={width} height={(width * 54) / 100} aria-hidden="true" className={className}>
        {STONES.map((s) => (
          <g key={s.x} transform={`rotate(${s.r} ${s.x + 11} ${s.y + 13})`}>
            {/* stone: dark body, pale rim, a soft highlight on the upper left */}
            <rect x={s.x} y={s.y} width={22} height={27} rx={10} fill="#2a241d" stroke="#000" strokeWidth={1.5} />
            <rect x={s.x + 1.5} y={s.y + 1.5} width={19} height={24} rx={8.5} fill="none" stroke="#8c8170" strokeWidth={1.2} />
            <path d={`M${s.x + 5} ${s.y + 9} q1 -4 6 -5`} fill="none" stroke="#a89c86" strokeWidth={1.2} strokeLinecap="round" />
            <text
              x={s.x + 11}
              y={s.y + 19}
              textAnchor="middle"
              fontFamily="var(--osrs-font-quill)"
              fontSize={17}
              fill="#f4ecd8"
              stroke="#000"
              strokeWidth={0.6}
              paintOrder="stroke"
            >
              {s.letter}
            </text>
          </g>
        ))}
        {/* ribbon tails, folded behind the band */}
        <path d="M5 34 h16 v15 h-16 l5 -7.5 z" fill="#4a1414" stroke="#000" strokeWidth={1.2} strokeLinejoin="round" />
        <path d="M95 34 h-16 v15 h16 l-5 -7.5 z" fill="#4a1414" stroke="#000" strokeWidth={1.2} strokeLinejoin="round" />
        <path d="M15 49 l6 3 v-3 z M85 49 l-6 3 v-3 z" fill="#2a0b0b" />
        {/* ribbon band */}
        <rect x={15} y={30} width={70} height={19} fill="#7a1f1f" stroke="#000" strokeWidth={1.2} />
        <path d="M16 32 h68 M16 47 h68" stroke="#d9c7a0" strokeWidth={1} />
        <text
          x={50}
          y={44.5}
          textAnchor="middle"
          fontFamily="var(--osrs-font-quill)"
          fontSize={16}
          fill="#f4ecd8"
          stroke="#000"
          strokeWidth={0.6}
          paintOrder="stroke"
          letterSpacing={1}
        >
          UI
        </text>
      </svg>
  );
}

/** Header logo: plain for now, the site name in Bold 12. */
export default function Logo() {
  return (
    <a href="/" className="osrs-site-logo">
      OSRS UI
    </a>
  );
}
