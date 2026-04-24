import { useState } from "react";
import { cn } from "@/lib/utils";

// Approximate Bangladesh outline in a 400×490 viewBox
const BD_PATH =
  "M 75,12 L 175,10 L 258,12 L 295,18 L 358,55 L 388,125 L 392,200 " +
  "L 380,298 L 352,375 L 298,450 L 242,475 L 188,472 L 148,460 " +
  "L 105,448 L 62,415 L 38,368 L 22,295 L 28,210 L 48,138 Z";

// 8 division regions (approximate, clipped to BD_PATH)
const DIVISIONS = [
  {
    name: "Rangpur",
    path: "M 22,12 L 178,12 L 178,158 L 22,158 Z",
    lx: 100,
    ly: 82,
  },
  {
    name: "Mymensingh",
    path: "M 178,12 L 292,18 L 295,162 L 178,158 Z",
    lx: 236,
    ly: 82,
  },
  {
    name: "Sylhet",
    path: "M 262,12 L 360,55 L 390,130 L 392,208 L 280,208 L 265,158 Z",
    lx: 332,
    ly: 130,
  },
  {
    name: "Rajshahi",
    path: "M 22,158 L 178,158 L 172,272 L 22,270 Z",
    lx: 96,
    ly: 212,
  },
  {
    name: "Dhaka",
    path: "M 178,158 L 282,158 L 280,272 L 178,272 Z",
    lx: 230,
    ly: 212,
  },
  {
    name: "Khulna",
    path: "M 22,270 L 172,268 L 165,392 L 98,428 L 50,415 L 35,370 L 22,300 Z",
    lx: 94,
    ly: 342,
  },
  {
    name: "Barisal",
    path: "M 165,268 L 280,268 L 282,392 L 215,462 L 162,458 Z",
    lx: 218,
    ly: 362,
  },
  {
    name: "Chittagong",
    path: "M 272,148 L 390,148 L 390,305 L 355,380 L 302,452 L 272,452 Z",
    lx: 336,
    ly: 308,
  },
];

// Generate 8×8 = 64-district grid lines
function getGridLines(): string[] {
  const ox = 22, oy = 12, w = 370, h = 462;
  const lines: string[] = [];
  for (let i = 1; i < 8; i++) {
    const x = ox + (w / 8) * i;
    lines.push(`M ${x.toFixed(1)},${oy} L ${x.toFixed(1)},${oy + h}`);
  }
  for (let i = 1; i < 8; i++) {
    const y = oy + (h / 8) * i;
    lines.push(`M ${ox},${y.toFixed(1)} L ${ox + w},${y.toFixed(1)}`);
  }
  return lines;
}

const GRID_LINES = getGridLines();

interface Props {
  mapMode?: "districts" | "divisions";
}

export default function BangladeshMapWidget({ mapMode: controlled }: Props) {
  const [internal, setInternal] = useState<"districts" | "divisions">("divisions");
  const [hovered, setHovered] = useState<string | null>(null);
  const mapMode = controlled ?? internal;

  return (
    <div className="relative w-full select-none">
      {/* Toggle — only shown when not externally controlled */}
      {controlled == null && (
        <div className="flex gap-2 mb-3 justify-center">
          {(["divisions", "districts"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setInternal(m)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                mapMode === m
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-background/50 text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              {m === "districts" ? "64 Districts" : "8 Divisions"}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <svg
          viewBox="0 0 400 490"
          className="w-full h-auto drop-shadow-2xl"
          aria-label="Interactive Bangladesh map"
        >
          <defs>
            <clipPath id="bd-clip">
              <path d={BD_PATH} />
            </clipPath>
            <filter id="lbl-shadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.85" />
            </filter>
            <filter id="outer-glow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#006A4E" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outer glow around the shape */}
          <path d={BD_PATH} fill="#006A4E" filter="url(#outer-glow)" opacity="0.5" />

          {/* Flag background (green field + red disc) */}
          <g clipPath="url(#bd-clip)">
            <rect x="0" y="0" width="400" height="490" fill="#006A4E" />
            <circle cx="183" cy="242" r="93" fill="#F42A41" opacity="0.88" />
          </g>

          {/* Division region overlays */}
          <g clipPath="url(#bd-clip)">
            {DIVISIONS.map((d) => (
              <path
                key={d.name}
                d={d.path}
                fill={hovered === d.name ? "rgba(255,255,255,0.18)" : "transparent"}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={hovered === d.name ? 1.8 : 0.8}
                style={{
                  opacity: mapMode === "divisions" ? 1 : 0,
                  transition: "opacity 0.45s ease, fill 0.18s ease, stroke-width 0.18s ease",
                  cursor: "pointer",
                  pointerEvents: mapMode === "divisions" ? "all" : "none",
                }}
                onMouseEnter={() => setHovered(d.name)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </g>

          {/* 64-district grid */}
          <g clipPath="url(#bd-clip)">
            {GRID_LINES.map((line, i) => (
              <path
                key={i}
                d={line}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="0.7"
                fill="none"
                style={{
                  opacity: mapMode === "districts" ? 1 : 0,
                  transition: "opacity 0.45s ease",
                }}
              />
            ))}
          </g>

          {/* Bangladesh outline border */}
          <path
            d={BD_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Division labels */}
          {DIVISIONS.map((d) => (
            <text
              key={d.name}
              x={d.lx}
              y={d.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={hovered === d.name ? "11.5" : "9.5"}
              fontWeight={hovered === d.name ? "700" : "500"}
              fill="rgba(255,255,255,0.95)"
              filter="url(#lbl-shadow)"
              style={{
                opacity: mapMode === "divisions" ? 1 : 0,
                transition: "opacity 0.45s ease, font-size 0.15s ease",
                pointerEvents: "none",
                fontFamily: "inherit",
              }}
            >
              {d.name}
            </text>
          ))}

          {/* District mode label */}
          <text
            x="200"
            y="242"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="15"
            fontWeight="700"
            fill="rgba(255,255,255,0.92)"
            filter="url(#lbl-shadow)"
            style={{
              opacity: mapMode === "districts" ? 1 : 0,
              transition: "opacity 0.45s ease",
              pointerEvents: "none",
              fontFamily: "inherit",
            }}
          >
            64 Districts
          </text>
        </svg>

        {/* Hover tooltip */}
        {hovered && mapMode === "divisions" && (
          <div
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-semibold pointer-events-none
                       bg-black/70 backdrop-blur-sm text-white border border-white/20"
          >
            {hovered} Division
          </div>
        )}

        {/* Bottom badge */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center">
          <span className="text-[9px] font-mono font-semibold tracking-widest uppercase text-white/50">
            64 DISTRICTS · 8 DIVISIONS
          </span>
        </div>
      </div>
    </div>
  );
}
