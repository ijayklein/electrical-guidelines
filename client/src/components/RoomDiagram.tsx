/**
 * RoomDiagram.tsx — Annotated SVG floor plan diagrams
 * Design: Spacial Brand — Deep Navy #06004A, Lime Green #CDF765, Off-White #F5F5F1
 *
 * STRICT PLACEMENT RULES:
 * - ALL outlets and switches are placed ON WALL SURFACES (at wall edge coordinates)
 * - Furniture is placed against walls or in room center
 * - Nightstand outlets are on the WALL at nightstand height, NOT on the nightstand
 * - Switch symbols are at upper portion of wall (48" AFF)
 * - Standard outlet symbols are at lower portion of wall (18" AFF)
 * - GFCI outlets = red; Standard outlets = blue; Dedicated circuits = purple
 * - Switches = green; Ceiling fixtures = amber
 *
 * SVG coordinate system per room: viewBox="0 0 560 440"
 * Room boundary: x=50, y=50, width=460, height=340
 * North wall: y=50; South wall: y=390; West wall: x=50; East wall: x=510
 * Wall-mounted item positions:
 *   North wall: cy=58 (outlet at 18" AFF) or cy=70 (switch at 48" AFF)
 *   South wall: cy=382 (outlet) or cy=370 (switch)
 *   West wall:  cx=58 (outlet) or cx=70 (switch)
 *   East wall:  cx=502 (outlet) or cx=490 (switch)
 */

import { useState } from 'react';

// ─── Color constants ───────────────────────────────────────────────────────────
const NAVY = '#06004A';
const OUTLET_BLUE = '#1D4ED8';
const GFCI_RED = '#DC2626';
const DEDICATED_PURPLE = '#7C3AED';
const SWITCH_GREEN = '#16A34A';
const LIGHT_AMBER = '#D97706';
const WALL_FILL = '#F8F9FA';
const FURNITURE_FILL = '#E2E8F0';
const FURNITURE_STROKE = '#94A3B8';
const DIM_COLOR = '#94A3B8';
const NOTE_COLOR = '#64748B';

// ─── Reusable SVG Symbols ──────────────────────────────────────────────────────

/** Duplex outlet: two vertical slots + ground pin in a rounded rectangle */
function Outlet({
  cx, cy, color = OUTLET_BLUE, label = '', labelDir = 'below', s = 9,
}: {
  cx: number; cy: number; color?: string; label?: string;
  labelDir?: 'above' | 'below' | 'left' | 'right'; s?: number;
}) {
  const lx = labelDir === 'left' ? cx - s - 5 : labelDir === 'right' ? cx + s + 5 : cx;
  const ly = labelDir === 'above' ? cy - s - 5 : labelDir === 'below' ? cy + s + 7 : cy + 3;
  const anchor = labelDir === 'left' ? 'end' : labelDir === 'right' ? 'start' : 'middle';
  return (
    <g>
      <rect x={cx - s} y={cy - s * 0.7} width={s * 2} height={s * 1.4} rx={2}
        fill="white" stroke={color} strokeWidth={1.8} />
      <rect x={cx - s * 0.55} y={cy - s * 0.35} width={s * 0.22} height={s * 0.55} rx={1} fill={color} />
      <rect x={cx + s * 0.18} y={cy - s * 0.35} width={s * 0.22} height={s * 0.55} rx={1} fill={color} />
      <circle cx={cx} cy={cy + s * 0.28} r={s * 0.18} fill={color} />
      {label && (
        <text x={lx} y={ly} textAnchor={anchor} fontSize={7} fontFamily="Inter,sans-serif"
          fontWeight="700" fill={color}>{label}</text>
      )}
    </g>
  );
}

/** Switch: circle with "S" */
function Sw({
  cx, cy, label = 'SW', labelDir = 'below', s = 8,
}: {
  cx: number; cy: number; label?: string;
  labelDir?: 'above' | 'below' | 'left' | 'right'; s?: number;
}) {
  const lx = labelDir === 'left' ? cx - s - 5 : labelDir === 'right' ? cx + s + 5 : cx;
  const ly = labelDir === 'above' ? cy - s - 4 : labelDir === 'below' ? cy + s + 6 : cy + 3;
  const anchor = labelDir === 'left' ? 'end' : labelDir === 'right' ? 'start' : 'middle';
  return (
    <g>
      <circle cx={cx} cy={cy} r={s} fill="white" stroke={SWITCH_GREEN} strokeWidth={1.8} />
      <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif"
        fontWeight="800" fill={SWITCH_GREEN}>S</text>
      {label && (
        <text x={lx} y={ly} textAnchor={anchor} fontSize={7} fontFamily="Inter,sans-serif"
          fontWeight="700" fill={SWITCH_GREEN}>{label}</text>
      )}
    </g>
  );
}

/** Ceiling light: dashed circle with crosshair */
function CeilLight({ cx, cy, label = 'CEIL.', r = 13 }: {
  cx: number; cy: number; label?: string; r?: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={LIGHT_AMBER} strokeWidth={1.5} strokeDasharray="3 2" />
      <line x1={cx - r + 3} y1={cy} x2={cx + r - 3} y2={cy} stroke={LIGHT_AMBER} strokeWidth={1.3} />
      <line x1={cx} y1={cy - r + 3} x2={cx} y2={cy + r - 3} stroke={LIGHT_AMBER} strokeWidth={1.3} />
      <circle cx={cx} cy={cy} r={3} fill={LIGHT_AMBER} />
      <text x={cx} y={cy + r + 9} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif"
        fontWeight="600" fill={LIGHT_AMBER}>{label}</text>
    </g>
  );
}

/** Exhaust fan: spinning blades */
function Fan({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} fill="white" stroke="#6B7280" strokeWidth={1.5} />
      <path d={`M${cx},${cy - 7} A7,7 0 0,1 ${cx + 7},${cy}`} stroke="#6B7280" strokeWidth={1.2} fill="none" />
      <path d={`M${cx},${cy + 7} A7,7 0 0,1 ${cx - 7},${cy}`} stroke="#6B7280" strokeWidth={1.2} fill="none" />
      <circle cx={cx} cy={cy} r={2.5} fill="#6B7280" />
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif"
        fontWeight="600" fill="#6B7280">FAN</text>
    </g>
  );
}

/** Door arc */
function Door({ x, y, w = 38, dir = 'right' }: {
  x: number; y: number; w?: number; dir?: 'right' | 'left';
}) {
  if (dir === 'right') return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={NAVY} strokeWidth={2} />
      <path d={`M${x},${y} A${w},${w} 0 0,1 ${x},${y + w}`}
        stroke={DIM_COLOR} strokeWidth={1} fill="none" strokeDasharray="3 2" />
    </g>
  );
  return (
    <g>
      <line x1={x} y1={y} x2={x - w} y2={y} stroke={NAVY} strokeWidth={2} />
      <path d={`M${x},${y} A${w},${w} 0 0,0 ${x},${y + w}`}
        stroke={DIM_COLOR} strokeWidth={1} fill="none" strokeDasharray="3 2" />
    </g>
  );
}

/** Dimension annotation */
function Dim({ x1, y1, x2, y2, label, lx, ly }: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; lx: number; ly: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DIM_COLOR} strokeWidth={0.8} strokeDasharray="3 2" />
      <text x={lx} y={ly} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>{label}</text>
    </g>
  );
}

// ─── Room: BEDROOM ─────────────────────────────────────────────────────────────
/**
 * 14 ft × 12 ft
 * Bed: headboard flush against NORTH wall, centered horizontally
 * Left nightstand: against WEST side of bed, touching north wall
 * Right nightstand: against EAST side of bed, touching north wall
 * Dresser: against SOUTH wall, left side
 * Desk: against EAST wall, lower portion
 * Door: WEST wall, lower portion
 * Closet: NORTH wall, right corner
 *
 * OUTLETS — ALL ON WALL SURFACES:
 * - West wall at y≈92: nightstand outlet (serves left nightstand on wall)
 * - East wall at y≈92: nightstand outlet (serves right nightstand on wall)
 * - North wall x≈95: general outlet left of bed
 * - North wall x≈415: general outlet right of bed / closet area
 * - South wall x≈125, 270, 380: general outlets
 * - East wall y≈255,280,310: desk cluster (3 outlets at desk height)
 * - West wall y≈295: switch near door
 */
function BedroomDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={50} y={50} width={460} height={340} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Door gap — west wall lower */}
      <rect x={46} y={298} width={8} height={44} fill={WALL_FILL} />
      <Door x={54} y={298} w={40} dir="right" />

      {/* Closet — east wall, upper portion (reach-in, 3 ft deep × 6 ft wide) */}
      <rect x={462} y={58} width={48} height={120} fill="#EDEDEA" stroke={FURNITURE_STROKE} strokeWidth={1.5} />
      <text x={486} y={122} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#6B7280" fontWeight="600" transform="rotate(90,486,122)">CLOSET</text>

      {/* Bed — headboard flush against NORTH wall, centered */}
      <rect x={160} y={58} width={240} height={160} rx={4} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1.5} />
      {/* Headboard strip */}
      <rect x={160} y={58} width={240} height={28} rx={3} fill={FURNITURE_STROKE} />
      <text x={280} y={155} textAnchor="middle" fontSize={11} fontFamily="Inter,sans-serif" fill="#475569" fontWeight="600">BED</text>

      {/* Left nightstand — against west side of bed, touching north wall */}
      <rect x={108} y={65} width={50} height={58} rx={2} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={133} y={98} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#64748B">N.STAND</text>

      {/* Right nightstand — against east side of bed, touching north wall (x=400..450, clear of closet on east wall) */}
      <rect x={400} y={65} width={52} height={58} rx={2} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={426} y={98} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#64748B">N.STAND</text>

      {/* Dresser — against SOUTH wall, left */}
      <rect x={62} y={352} width={130} height={32} rx={2} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={127} y={372} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#64748B">DRESSER</text>

      {/* Desk — against EAST wall, lower portion (below closet, clear gap) */}
      <rect x={462} y={210} width={42} height={120} rx={2} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={483} y={275} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif"
        fill="#64748B" transform="rotate(90,483,275)">DESK</text>

      {/* Dimensions */}
      <Dim x1={50} y1={428} x2={510} y2={428} label="~14 ft" lx={280} ly={425} />
      <Dim x1={22} y1={50} x2={22} y2={390} label="~12 ft" lx={36} ly={220} />

      {/* NEC note */}
      <text x={280} y={32} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.52(A) — No point on wall &gt; 6 ft from outlet · AFCI required on all circuits
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ITEMS PLACED ON WALL SURFACES
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL — nightstand outlets directly behind each nightstand */}
      {/* Left nightstand center x≈133 → outlet on north wall at cx=133 */}
      <Outlet cx={133} cy={58} color={OUTLET_BLUE} label="NSD" labelDir="below" />
      {/* Right nightstand center x≈426 → outlet on north wall at cx=426 */}
      <Outlet cx={426} cy={58} color={OUTLET_BLUE} label="NSD" labelDir="below" />

      {/* NORTH WALL — general outlet far left (NEC 6ft spacing, left of nightstand zone) */}
      <Outlet cx={78} cy={58} color={OUTLET_BLUE} labelDir="below" />

      {/* SOUTH WALL — general outlets (dresser area + center + right) */}
      <Outlet cx={127} cy={382} color={OUTLET_BLUE} labelDir="above" />
      <Outlet cx={270} cy={382} color={OUTLET_BLUE} labelDir="above" />
      <Outlet cx={390} cy={382} color={OUTLET_BLUE} labelDir="above" />

      {/* EAST WALL — desk cluster (3 outlets at desk height, below closet) */}
      <Outlet cx={502} cy={225} color={OUTLET_BLUE} label="DESK" labelDir="left" />
      <Outlet cx={502} cy={255} color={OUTLET_BLUE} labelDir="left" />
      <Outlet cx={502} cy={285} color={OUTLET_BLUE} labelDir="left" />

      {/* WEST WALL — switch near door (upper = 48" AFF) */}
      <Sw cx={58} cy={288} label="SW" labelDir="right" />

      {/* CEILING — main light */}
      <CeilLight cx={240} cy={245} />

      {/* EAST WALL — closet light switch (on east wall, at closet entrance) */}
      <Sw cx={502} cy={190} label="CLOS.SW" labelDir="left" />
    </svg>
  );
}

// ─── Room: KITCHEN ─────────────────────────────────────────────────────────────
/**
 * 16 ft × 14 ft
 * Counter/cabinets: NORTH wall (full width) + EAST wall (full height)
 * Refrigerator: NW corner against WEST wall
 * Sink: NORTH wall, center-left
 * Range/cooktop: NORTH wall, center-right
 * Island: center of room
 * Door: SOUTH wall, left
 *
 * OUTLETS — ALL ON WALL/COUNTER BACKSPLASH SURFACES:
 * - North wall backsplash: GFCI every ~4ft (left of sink, right of sink, right of range, far right)
 * - North wall: dedicated 20A for fridge (NW), dedicated 50A/240V for range (behind range)
 * - East wall: 3 GFCI outlets on east counter backsplash
 * - Island SOUTH face: 2 GFCI outlets (accessible from seating side)
 * - South wall: general outlet
 * - West wall: switch near door
 */
function KitchenDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={50} y={50} width={460} height={340} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Door — south wall, left */}
      <rect x={80} y={386} width={44} height={8} fill={WALL_FILL} />
      <Door x={80} y={390} w={40} dir="right" />

      {/* Counter — NORTH wall (full width) */}
      <rect x={58} y={58} width={402} height={52} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={260} y={88} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#374151" fontWeight="600">COUNTER / UPPER CABINETS</text>

      {/* Counter — EAST wall (full height) */}
      <rect x={458} y={58} width={44} height={282} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />

      {/* Refrigerator — NW corner, against WEST wall */}
      <rect x={58} y={58} width={68} height={95} rx={2} fill="#E5E7EB" stroke="#6B7280" strokeWidth={1.5} />
      <text x={92} y={110} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#374151" fontWeight="600">FRIDGE</text>

      {/* Sink — NORTH wall, center-left */}
      <rect x={152} y={60} width={72} height={46} rx={3} fill="#BFDBFE" stroke="#3B82F6" strokeWidth={1.5} />
      <ellipse cx={188} cy={83} rx={24} ry={16} fill="none" stroke="#3B82F6" strokeWidth={1} />
      <text x={188} y={87} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#1D4ED8">SINK</text>

      {/* Range — NORTH wall, center-right */}
      <rect x={258} y={60} width={88} height={46} rx={2} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5} />
      <circle cx={278} cy={76} r={8} fill="none" stroke="#D97706" strokeWidth={1.2} />
      <circle cx={302} cy={76} r={8} fill="none" stroke="#D97706" strokeWidth={1.2} />
      <circle cx={278} cy={96} r={8} fill="none" stroke="#D97706" strokeWidth={1.2} />
      <circle cx={302} cy={96} r={8} fill="none" stroke="#D97706" strokeWidth={1.2} />
      <text x={302} y={86} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#92400E" fontWeight="600">RANGE</text>

      {/* Island — center of room */}
      <rect x={145} y={195} width={220} height={95} rx={4} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={2} />
      <text x={255} y={248} textAnchor="middle" fontSize={10} fontFamily="Inter,sans-serif" fill="#475569" fontWeight="600">ISLAND</text>

      {/* Dimensions */}
      <Dim x1={50} y1={428} x2={510} y2={428} label="~16 ft" lx={280} ly={425} />
      <Dim x1={22} y1={50} x2={22} y2={390} label="~14 ft" lx={36} ly={220} />

      {/* NEC note */}
      <text x={280} y={32} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.52(B) — Two 20A small-appliance circuits · GFCI within 6 ft of sink · Island outlet required
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL/BACKSPLASH SURFACES
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL backsplash — GFCI outlets (above counter surface, on wall) */}
      {/* Left of sink */}
      <Outlet cx={128} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      {/* Right of sink */}
      <Outlet cx={235} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      {/* Right of range */}
      <Outlet cx={362} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      {/* Far right of counter */}
      <Outlet cx={432} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />

      {/* NORTH WALL — refrigerator dedicated 20A circuit */}
      <Outlet cx={78} cy={58} color={DEDICATED_PURPLE} label="20A" labelDir="below" s={8} />

      {/* NORTH WALL — range dedicated 50A/240V (behind range, on wall) */}
      <Outlet cx={302} cy={58} color={DEDICATED_PURPLE} label="50A/240V" labelDir="below" s={8} />

      {/* EAST WALL backsplash — GFCI outlets */}
      <Outlet cx={502} cy={110} color={GFCI_RED} label="GFCI" labelDir="left" s={8} />
      <Outlet cx={502} cy={175} color={GFCI_RED} label="GFCI" labelDir="left" s={8} />
      <Outlet cx={502} cy={240} color={GFCI_RED} label="GFCI" labelDir="left" s={8} />

      {/* ISLAND — outlets on SOUTH face (accessible from seating side, on island wall) */}
      <Outlet cx={195} cy={290} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      <Outlet cx={315} cy={290} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />

      {/* SOUTH WALL — general outlet */}
      <Outlet cx={280} cy={382} color={OUTLET_BLUE} labelDir="above" />

      {/* WEST WALL — switch near door */}
      <Sw cx={58} cy={330} label="SW" labelDir="right" />

      {/* CEILING — main kitchen light */}
      <CeilLight cx={255} cy={155} />
    </svg>
  );
}

// ─── Room: BATHROOM ────────────────────────────────────────────────────────────
/**
 * 10 ft × 8 ft
 * Vanity/sink: NORTH wall, center
 * Toilet: EAST wall, upper
 * Tub/shower: WEST wall, full upper portion
 * Door: SOUTH wall, right
 *
 * OUTLETS — ALL ON WALL SURFACES:
 * - North wall, left of vanity: GFCI (within 3ft of sink)
 * - North wall, right of vanity: GFCI (within 3ft of sink)
 * - South wall center: GFCI (additional outlet)
 * - East wall near door: two switches (vanity light + exhaust fan)
 * - North wall above mirror: vanity light bar
 * - Ceiling over shower: exhaust fan
 * - 3ft exclusion zone from tub/shower marked
 */
function BathroomDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={80} y={60} width={400} height={320} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Door — south wall, right */}
      <rect x={390} y={376} width={50} height={8} fill={WALL_FILL} />
      <Door x={440} y={380} w={40} dir="left" />

      {/* Tub/Shower — WEST wall, full upper portion */}
      <rect x={88} y={68} width={115} height={190} rx={4} fill="#DBEAFE" stroke="#3B82F6" strokeWidth={2} />
      <rect x={94} y={74} width={103} height={178} rx={3} fill="#EFF6FF" stroke="#93C5FD" strokeWidth={1} />
      <text x={146} y={162} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#1D4ED8" fontWeight="600">TUB /</text>
      <text x={146} y={175} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#1D4ED8" fontWeight="600">SHOWER</text>

      {/* 3ft exclusion zone — dashed red line */}
      <line x1={205} y1={68} x2={205} y2={258} stroke="#EF4444" strokeWidth={1.2} strokeDasharray="4 3" />
      <text x={208} y={165} fontSize={7} fontFamily="Inter,sans-serif" fill="#EF4444"
        transform="rotate(90,208,165)">← 3 ft exclusion zone (no outlets)</text>

      {/* Vanity/Sink — NORTH wall, center */}
      <rect x={215} y={68} width={175} height={65} rx={3} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1.5} />
      <ellipse cx={302} cy={100} rx={38} ry={24} fill="#BFDBFE" stroke="#3B82F6" strokeWidth={1.5} />
      <text x={302} y={104} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#1D4ED8">SINK</text>
      <text x={302} y={118} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#64748B">VANITY</text>

      {/* Toilet — EAST wall, upper */}
      <rect x={412} y={68} width={60} height={92} rx={4} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1.5} />
      <ellipse cx={442} cy={128} rx={22} ry={30} fill="#F1F5F9" stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={442} y={132} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#64748B">WC</text>

      {/* Dimensions */}
      <Dim x1={80} y1={428} x2={480} y2={428} label="~10 ft" lx={280} ly={425} />
      <Dim x1={52} y1={60} x2={52} y2={380} label="~8 ft" lx={66} ly={220} />

      {/* NEC note */}
      <text x={280} y={42} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.8(A)(1) — ALL outlets GFCI · No outlet within 3 ft of tub/shower edge
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL SURFACES
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL — GFCI outlets flanking vanity (on wall, within 3ft of sink) */}
      <Outlet cx={222} cy={68} color={GFCI_RED} label="GFCI" labelDir="below" s={9} />
      <Outlet cx={382} cy={68} color={GFCI_RED} label="GFCI" labelDir="below" s={9} />

      {/* NORTH WALL — vanity light bar (wall-mounted above mirror) */}
      <rect x={220} y={60} width={150} height={10} rx={2} fill="#FEF3C7" stroke={LIGHT_AMBER} strokeWidth={1.5} />
      <text x={295} y={56} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill={LIGHT_AMBER} fontWeight="600">VANITY LIGHT</text>

      {/* SOUTH WALL — additional GFCI outlet */}
      <Outlet cx={302} cy={372} color={GFCI_RED} label="GFCI" labelDir="above" s={9} />

      {/* EAST WALL — switches near door (on wall surface, 48" AFF) */}
      <Sw cx={472} cy={305} label="VANITY" labelDir="left" />
      <Sw cx={472} cy={335} label="FAN" labelDir="left" />

      {/* CEILING — exhaust fan over shower zone */}
      <Fan cx={146} cy={275} />
    </svg>
  );
}

// ─── Room: LIVING ROOM ─────────────────────────────────────────────────────────
/**
 * 18 ft × 14 ft
 * Sofa: against SOUTH wall, centered (back against south wall)
 * TV/media console: against NORTH wall, centered
 * Armchair: against WEST wall, middle
 * Coffee table: center of room
 * Door: WEST wall, lower
 *
 * OUTLETS — ALL ON WALL SURFACES:
 * - North wall: TV cluster (2 outlets flanking media console) + 2 general
 * - South wall: 4 outlets (behind sofa ends + center spacing)
 * - West wall: lamp outlet near armchair + general
 * - East wall: 3 outlets for NEC 6ft spacing
 * - West wall: switch near door
 */
function LivingRoomDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={50} y={50} width={460} height={340} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Door — west wall, lower */}
      <rect x={46} y={305} width={8} height={44} fill={WALL_FILL} />
      <Door x={54} y={305} w={40} dir="right" />

      {/* TV/Media console — NORTH wall, centered */}
      <rect x={170} y={58} width={200} height={48} rx={3} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
      <rect x={178} y={62} width={184} height={38} rx={2} fill="#0F172A" />
      <text x={270} y={86} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#94A3B8" fontWeight="600">TV / MEDIA</text>

      {/* Sofa — SOUTH wall, centered (back cushion against south wall) */}
      <rect x={125} y={312} width={290} height={68} rx={5} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1.5} />
      <rect x={125} y={312} width={290} height={20} rx={3} fill={FURNITURE_STROKE} />
      <text x={270} y={358} textAnchor="middle" fontSize={10} fontFamily="Inter,sans-serif" fill="#475569" fontWeight="600">SOFA</text>

      {/* Armchair — WEST wall, middle */}
      <rect x={58} y={195} width={72} height={72} rx={4} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1.5} />
      <text x={94} y={235} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#475569">CHAIR</text>

      {/* Coffee table — center */}
      <rect x={195} y={215} width={160} height={80} rx={4} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={275} y={260} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#64748B">COFFEE TABLE</text>

      {/* Dimensions */}
      <Dim x1={50} y1={428} x2={510} y2={428} label="~18 ft" lx={280} ly={425} />
      <Dim x1={22} y1={50} x2={22} y2={390} label="~14 ft" lx={36} ly={220} />

      {/* NEC note */}
      <text x={280} y={32} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.52(A) — No point on wall &gt; 6 ft from outlet · AFCI required
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL SURFACES
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL — TV cluster + general spacing */}
      <Outlet cx={88} cy={58} color={OUTLET_BLUE} labelDir="below" />
      <Outlet cx={158} cy={58} color={OUTLET_BLUE} label="TV" labelDir="below" />
      <Outlet cx={382} cy={58} color={OUTLET_BLUE} label="TV" labelDir="below" />
      <Outlet cx={462} cy={58} color={OUTLET_BLUE} labelDir="below" />

      {/* SOUTH WALL — behind sofa ends + center spacing */}
      <Outlet cx={100} cy={382} color={OUTLET_BLUE} labelDir="above" />
      <Outlet cx={205} cy={382} color={OUTLET_BLUE} labelDir="above" />
      <Outlet cx={345} cy={382} color={OUTLET_BLUE} labelDir="above" />
      <Outlet cx={445} cy={382} color={OUTLET_BLUE} labelDir="above" />

      {/* WEST WALL — lamp outlet near armchair + general */}
      <Outlet cx={58} cy={130} color={OUTLET_BLUE} labelDir="right" />
      <Outlet cx={58} cy={230} color={OUTLET_BLUE} label="LAMP" labelDir="right" />

      {/* EAST WALL — NEC 6ft spacing */}
      <Outlet cx={502} cy={120} color={OUTLET_BLUE} labelDir="left" />
      <Outlet cx={502} cy={245} color={OUTLET_BLUE} labelDir="left" />
      <Outlet cx={502} cy={355} color={OUTLET_BLUE} labelDir="left" />

      {/* WEST WALL — switch near door */}
      <Sw cx={58} cy={295} label="SW" labelDir="right" />

      {/* CEILING — main light */}
      <CeilLight cx={280} cy={200} />
    </svg>
  );
}

// ─── Room: HOME OFFICE ─────────────────────────────────────────────────────────
/**
 * 12 ft × 10 ft
 * L-shaped desk: NORTH wall segment + EAST wall segment (corner desk)
 * Bookshelf: WEST wall
 * Filing cabinet: SOUTH wall, left
 * Door: WEST wall, lower
 *
 * OUTLETS — ALL ON WALL SURFACES:
 * - North wall: 5 outlets at desk height (dense spacing every ~2ft)
 * - East wall: 3 outlets for east desk segment
 * - West wall: 1 general outlet near bookshelf
 * - South wall: 2 general outlets
 * - West wall: switch near door
 */
function OfficeDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={70} y={50} width={420} height={340} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Door — west wall, lower */}
      <rect x={66} y={298} width={8} height={44} fill={WALL_FILL} />
      <Door x={74} y={298} w={40} dir="right" />

      {/* Desk — NORTH wall segment */}
      <rect x={78} y={58} width={330} height={52} rx={3} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={243} y={89} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#374151" fontWeight="600">DESK (NORTH WALL)</text>

      {/* Desk — EAST wall segment */}
      <rect x={440} y={58} width={42} height={200} rx={3} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={461} y={162} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif"
        fill="#374151" fontWeight="600" transform="rotate(90,461,162)">DESK (EAST)</text>

      {/* Monitor on desk */}
      <rect x={195} y={62} width={62} height={42} rx={2} fill="#1E293B" stroke="#334155" strokeWidth={1} />
      <text x={226} y={88} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#94A3B8">MONITOR</text>

      {/* Bookshelf — WEST wall */}
      <rect x={78} y={80} width={42} height={165} rx={2} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={99} y={168} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif"
        fill="#64748B" transform="rotate(90,99,168)">BOOKSHELF</text>

      {/* Filing cabinet — SOUTH wall, left */}
      <rect x={78} y={350} width={62} height={32} rx={2} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} />
      <text x={109} y={370} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#64748B">FILES</text>

      {/* Dimensions */}
      <Dim x1={70} y1={428} x2={490} y2={428} label="~12 ft" lx={280} ly={425} />
      <Dim x1={42} y1={50} x2={42} y2={390} label="~10 ft" lx={56} ly={220} />

      {/* NEC note */}
      <text x={280} y={32} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.52(A) — Dense desk-wall outlets recommended · Dedicated 20A workstation circuit · AFCI
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL SURFACES
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL — dense desk cluster (5 outlets, every ~2ft on desk wall) */}
      <Outlet cx={120} cy={58} color={OUTLET_BLUE} labelDir="below" s={9} />
      <Outlet cx={185} cy={58} color={OUTLET_BLUE} labelDir="below" s={9} />
      <Outlet cx={255} cy={58} color={OUTLET_BLUE} labelDir="below" s={9} />
      <Outlet cx={325} cy={58} color={OUTLET_BLUE} labelDir="below" s={9} />
      <Outlet cx={395} cy={58} color={DEDICATED_PURPLE} label="20A" labelDir="below" s={9} />

      {/* EAST WALL — east desk segment outlets */}
      <Outlet cx={482} cy={98} color={OUTLET_BLUE} labelDir="left" s={9} />
      <Outlet cx={482} cy={155} color={OUTLET_BLUE} labelDir="left" s={9} />
      <Outlet cx={482} cy={215} color={OUTLET_BLUE} labelDir="left" s={9} />

      {/* WEST WALL — general outlet near bookshelf */}
      <Outlet cx={78} cy={205} color={OUTLET_BLUE} labelDir="right" />

      {/* SOUTH WALL — general outlets */}
      <Outlet cx={270} cy={382} color={OUTLET_BLUE} labelDir="above" />
      <Outlet cx={400} cy={382} color={OUTLET_BLUE} labelDir="above" />

      {/* WEST WALL — switch near door */}
      <Sw cx={78} cy={288} label="SW" labelDir="right" />

      {/* CEILING — main light */}
      <CeilLight cx={270} cy={240} />
    </svg>
  );
}

// ─── Room: GARAGE ──────────────────────────────────────────────────────────────
/**
 * 22 ft × 20 ft (two-car)
 * Two vehicle bays (left + right)
 * Workbench: NORTH wall, right side
 * Garage door: SOUTH wall (full width opening)
 * Entry door: WEST wall, lower
 *
 * OUTLETS — ALL ON WALL SURFACES:
 * - West wall: 2 GFCI outlets for bay 1
 * - East wall: 1 GFCI outlet for bay 2 + dedicated 240V EV charger
 * - North wall: 4 GFCI outlets at workbench
 * - South wall: 1 GFCI near entry door
 * - West wall: 2 switches (lights + GDO)
 */
function GarageDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={40} y={50} width={480} height={340} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Garage door — SOUTH wall, full width */}
      <rect x={80} y={386} width={360} height={8} fill={WALL_FILL} />
      <rect x={80} y={382} width={360} height={12} fill="#CBD5E1" stroke="#94A3B8" strokeWidth={1} />
      <text x={260} y={396} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#64748B">GARAGE DOOR</text>

      {/* Entry door — WEST wall, lower */}
      <rect x={36} y={298} width={8} height={44} fill={WALL_FILL} />
      <Door x={44} y={298} w={40} dir="right" />

      {/* Bay divider */}
      <line x1={280} y1={58} x2={280} y2={382} stroke="#CBD5E1" strokeWidth={2} strokeDasharray="8 4" />
      <text x={160} y={230} textAnchor="middle" fontSize={11} fontFamily="Inter,sans-serif" fill="#CBD5E1" fontWeight="700">BAY 1</text>
      <text x={400} y={230} textAnchor="middle" fontSize={11} fontFamily="Inter,sans-serif" fill="#CBD5E1" fontWeight="700">BAY 2</text>

      {/* Workbench — NORTH wall, right side */}
      <rect x={280} y={58} width={192} height={52} rx={3} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={376} y={89} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#374151" fontWeight="600">WORKBENCH</text>

      {/* Car outlines (dashed) */}
      <rect x={68} y={145} width={172} height={195} rx={8} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} strokeDasharray="5 3" />
      <text x={154} y={248} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#94A3B8">CAR 1</text>
      <rect x={308} y={145} width={172} height={195} rx={8} fill={FURNITURE_FILL} stroke={FURNITURE_STROKE} strokeWidth={1} strokeDasharray="5 3" />
      <text x={394} y={248} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#94A3B8">CAR 2</text>

      {/* Dimensions */}
      <Dim x1={40} y1={428} x2={520} y2={428} label="~22 ft" lx={280} ly={425} />
      <Dim x1={12} y1={50} x2={12} y2={390} label="~20 ft" lx={26} ly={220} />

      {/* NEC note */}
      <text x={280} y={32} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.8(A)(2) — ALL outlets GFCI · At least 1 outlet per vehicle bay · NEC 625 for EV
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL SURFACES
          ═══════════════════════════════════════════════════════════ */}

      {/* WEST WALL — bay 1 GFCI outlets */}
      <Outlet cx={48} cy={130} color={GFCI_RED} label="GFCI" labelDir="right" />
      <Outlet cx={48} cy={220} color={GFCI_RED} label="GFCI" labelDir="right" />

      {/* EAST WALL — bay 2 GFCI outlet + EV charger */}
      <Outlet cx={512} cy={130} color={GFCI_RED} label="GFCI" labelDir="left" />
      <Outlet cx={512} cy={260} color={DEDICATED_PURPLE} label="EV 240V" labelDir="left" s={9} />

      {/* NORTH WALL — workbench GFCI outlets */}
      <Outlet cx={295} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      <Outlet cx={345} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      <Outlet cx={400} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />
      <Outlet cx={455} cy={58} color={GFCI_RED} label="GFCI" labelDir="below" s={8} />

      {/* SOUTH WALL — GFCI near entry door */}
      <Outlet cx={78} cy={382} color={GFCI_RED} label="GFCI" labelDir="above" s={8} />

      {/* WEST WALL — switches near entry door */}
      <Sw cx={48} cy={288} label="LIGHTS" labelDir="right" />
      <Sw cx={48} cy={318} label="GDO" labelDir="right" />

      {/* CEILING — bay lights */}
      <CeilLight cx={160} cy={205} label="BAY 1" />
      <CeilLight cx={400} cy={205} label="BAY 2" />
    </svg>
  );
}

// ─── Room: LAUNDRY ─────────────────────────────────────────────────────────────
/**
 * 10 ft × 8 ft
 * Washer: NORTH wall, left
 * Dryer: NORTH wall, right of washer
 * Utility sink: EAST wall
 * Door: WEST wall, lower
 *
 * OUTLETS — ALL ON WALL SURFACES:
 * - North wall behind washer: 20A GFCI outlet (on wall)
 * - North wall behind dryer: dedicated 30A/240V outlet (on wall)
 * - East wall near sink: GFCI outlet
 * - South wall: general GFCI outlet
 * - West wall: 2 switches (lights + fan)
 */
function LaundryDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Room */}
      <rect x={80} y={60} width={400} height={320} fill={WALL_FILL} stroke={NAVY} strokeWidth={8} />

      {/* Door — west wall, lower */}
      <rect x={76} y={288} width={8} height={44} fill={WALL_FILL} />
      <Door x={84} y={288} w={40} dir="right" />

      {/* Washer — NORTH wall, left */}
      <rect x={88} y={68} width={105} height={105} rx={4} fill="#DBEAFE" stroke="#3B82F6" strokeWidth={1.5} />
      <circle cx={140} cy={120} r={34} fill="#BFDBFE" stroke="#3B82F6" strokeWidth={1.5} />
      <circle cx={140} cy={120} r={22} fill="#EFF6FF" stroke="#93C5FD" strokeWidth={1} />
      <text x={140} y={124} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#1D4ED8" fontWeight="600">WASHER</text>

      {/* Dryer — NORTH wall, right of washer */}
      <rect x={200} y={68} width={105} height={105} rx={4} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5} />
      <circle cx={252} cy={120} r={34} fill="#FEF9C3" stroke="#D97706" strokeWidth={1.5} />
      <circle cx={252} cy={120} r={22} fill="#FFFBEB" stroke="#FCD34D" strokeWidth={1} />
      <text x={252} y={124} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#92400E" fontWeight="600">DRYER</text>

      {/* Upper cabinet above W/D */}
      <rect x={88} y={60} width={217} height={12} rx={1} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1} />
      <text x={196} y={69} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#F9FAFB">UPPER CABINET</text>

      {/* Utility sink — EAST wall */}
      <rect x={422} y={80} width={50} height={82} rx={3} fill="#BFDBFE" stroke="#3B82F6" strokeWidth={1.5} />
      <rect x={427} y={85} width={40} height={68} rx={2} fill="#DBEAFE" stroke="#93C5FD" strokeWidth={1} />
      <text x={447} y={122} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#1D4ED8" fontWeight="600">UTIL.</text>
      <text x={447} y={133} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#1D4ED8" fontWeight="600">SINK</text>

      {/* Dimensions */}
      <Dim x1={80} y1={428} x2={480} y2={428} label="~10 ft" lx={280} ly={425} />
      <Dim x1={52} y1={60} x2={52} y2={380} label="~8 ft" lx={66} ly={220} />

      {/* NEC note */}
      <text x={280} y={42} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.52(F) — 20A GFCI for washer · 30A/240V for dryer · GFCI near sink · AFCI+GFCI
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL SURFACES (behind appliances)
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL — washer outlet (20A GFCI, on wall behind washer) */}
      <Outlet cx={140} cy={68} color={GFCI_RED} label="20A GFCI" labelDir="below" s={9} />

      {/* NORTH WALL — dryer dedicated 240V outlet (on wall behind dryer) */}
      <Outlet cx={252} cy={68} color={DEDICATED_PURPLE} label="30A/240V" labelDir="below" s={9} />

      {/* EAST WALL — GFCI near utility sink */}
      <Outlet cx={472} cy={122} color={GFCI_RED} label="GFCI" labelDir="left" s={9} />

      {/* SOUTH WALL — general GFCI outlet */}
      <Outlet cx={280} cy={372} color={GFCI_RED} label="GFCI" labelDir="above" />

      {/* WEST WALL — switches near door */}
      <Sw cx={88} cy={278} label="LIGHTS" labelDir="right" />
      <Sw cx={88} cy={310} label="FAN" labelDir="right" />

      {/* CEILING — main light + exhaust fan */}
      <CeilLight cx={280} cy={235} />
      <Fan cx={280} cy={165} />
    </svg>
  );
}

// ─── Room: OUTDOOR / PATIO ─────────────────────────────────────────────────────
/**
 * 16 ft × 12 ft
 * House wall: NORTH (interior wall with door)
 * Outdoor dining table: center
 * BBQ/grill: against SOUTH wall, right
 * Seating: against WEST wall
 *
 * OUTLETS — ALL ON WALL SURFACES with weatherproof covers:
 * - North wall (house wall): 2 GFCI/WP outlets
 * - East wall: 1 GFCI/WP outlet
 * - West wall: 1 GFCI/WP outlet
 * - South wall near BBQ: 2 GFCI/WP outlets
 * - North wall: exterior switch (weatherproof) near door
 */
function OutdoorDiagram() {
  return (
    <svg viewBox="0 0 560 440" className="w-full h-full" style={{ maxHeight: 440 }}>
      {/* Patio boundary */}
      <rect x={50} y={50} width={460} height={340} fill="#F0FDF4" stroke={NAVY} strokeWidth={8} />

      {/* NORTH wall = house wall (thicker, different fill) */}
      <rect x={50} y={50} width={460} height={8} fill={NAVY} />
      <text x={280} y={44} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NAVY} fontWeight="700">HOUSE WALL</text>

      {/* Door from house — NORTH wall */}
      <rect x={105} y={50} width={48} height={8} fill="#F0FDF4" />
      <Door x={105} y={58} w={44} dir="right" />

      {/* Outdoor dining table — center */}
      <ellipse cx={280} cy={215} rx={92} ry={62} fill="#D1FAE5" stroke="#6EE7B7" strokeWidth={1.5} />
      <text x={280} y={219} textAnchor="middle" fontSize={9} fontFamily="Inter,sans-serif" fill="#065F46" fontWeight="600">DINING TABLE</text>
      {/* Chairs */}
      {([[-92,0],[92,0],[0,-62],[0,62],[-72,-40],[72,-40],[-72,40],[72,40]] as [number,number][]).map(([dx,dy],i) => (
        <circle key={i} cx={280+dx} cy={215+dy} r={10} fill="#A7F3D0" stroke="#6EE7B7" strokeWidth={1} />
      ))}

      {/* BBQ/Grill — against SOUTH wall, right */}
      <rect x={358} y={342} width={92} height={40} rx={4} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5} />
      <text x={404} y={367} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill="#92400E" fontWeight="600">BBQ / GRILL</text>

      {/* Seating — against WEST wall */}
      <rect x={58} y={185} width={62} height={82} rx={4} fill="#D1FAE5" stroke="#6EE7B7" strokeWidth={1} />
      <text x={89} y={230} textAnchor="middle" fontSize={7} fontFamily="Inter,sans-serif" fill="#065F46">SEATING</text>

      {/* Dimensions */}
      <Dim x1={50} y1={428} x2={510} y2={428} label="~16 ft" lx={280} ly={425} />
      <Dim x1={22} y1={50} x2={22} y2={390} label="~12 ft" lx={36} ly={220} />

      {/* NEC note */}
      <text x={280} y={32} textAnchor="middle" fontSize={8} fontFamily="Inter,sans-serif" fill={NOTE_COLOR}>
        NEC 210.8(A)(3) — ALL outlets GFCI · Weatherproof in-use covers req. (NEC 406.9) · 20A circuit
      </text>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICAL — ALL ON WALL SURFACES with WP covers
          ═══════════════════════════════════════════════════════════ */}

      {/* NORTH WALL (house wall) — general patio GFCI outlets */}
      <Outlet cx={165} cy={58} color={GFCI_RED} label="GFCI/WP" labelDir="below" s={9} />
      <Outlet cx={385} cy={58} color={GFCI_RED} label="GFCI/WP" labelDir="below" s={9} />

      {/* WEST WALL — side GFCI outlet */}
      <Outlet cx={58} cy={155} color={GFCI_RED} label="GFCI/WP" labelDir="right" s={9} />

      {/* EAST WALL — side GFCI outlet */}
      <Outlet cx={502} cy={155} color={GFCI_RED} label="GFCI/WP" labelDir="left" s={9} />

      {/* SOUTH WALL — near BBQ area */}
      <Outlet cx={375} cy={382} color={GFCI_RED} label="GFCI/WP" labelDir="above" s={9} />
      <Outlet cx={455} cy={382} color={GFCI_RED} label="GFCI/WP" labelDir="above" s={9} />

      {/* NORTH WALL — exterior light switch (weatherproof) near door */}
      <Sw cx={92} cy={68} label="WP SW" labelDir="below" />

      {/* CEILING/OVERHEAD — patio lights */}
      <CeilLight cx={200} cy={155} label="OVERHEAD" r={13} />
      <CeilLight cx={390} cy={305} label="TASK" r={11} />
    </svg>
  );
}

// ─── Diagram registry ──────────────────────────────────────────────────────────

type DiagramRoom = 'bedroom' | 'kitchen' | 'bathroom' | 'living' | 'office' | 'garage' | 'laundry' | 'outdoor';

interface RoomDiagramConfig {
  label: string;
  icon: string;
  title: string;
  subtitle: string;
  necRef: string;
  notes: string[];
  Component: React.FC;
}

const DIAGRAMS: Record<DiagramRoom, RoomDiagramConfig> = {
  bedroom: {
    label: 'Bedroom', icon: '🛏',
    title: 'Bedroom — Outlet Placement Diagram',
    subtitle: 'Nightstand outlets on WALL surface at nightstand height · Desk cluster · AFCI on all circuits',
    necRef: 'NEC 210.52(A)',
    notes: [
      'Nightstand outlets are on the NORTH wall directly behind each nightstand — NOT on the side walls or on the furniture itself',
      'No point on any wall may be more than 6 ft from an outlet (NEC 210.52(A))',
      'AFCI protection required on all bedroom circuits (NEC 210.12)',
      'Desk cluster: 3 outlets on east wall at desk height (18" AFF)',
      'Switch at 48" AFF on west wall near door; closet outlet on north wall',
    ],
    Component: BedroomDiagram,
  },
  kitchen: {
    label: 'Kitchen', icon: '🍳',
    title: 'Kitchen — Outlet Placement Diagram',
    subtitle: 'Two 20A small-appliance circuits · GFCI on all countertop outlets · Dedicated appliance circuits',
    necRef: 'NEC 210.52(B)',
    notes: [
      'All countertop outlets on wall backsplash — within 20" of countertop surface (NEC 210.52(C))',
      'GFCI required on all outlets within 6 ft of sink (NEC 210.8(A)(6))',
      'Island outlets on south face of island — accessible from seating side (NEC 210.52(C)(2))',
      'Refrigerator: dedicated 20A circuit on north wall (NW corner)',
      'Range: dedicated 50A/240V circuit on north wall directly behind range',
    ],
    Component: KitchenDiagram,
  },
  bathroom: {
    label: 'Bathroom', icon: '🚿',
    title: 'Bathroom — Outlet Placement Diagram',
    subtitle: 'All outlets GFCI · No outlet within 3 ft of tub/shower · Dedicated 20A circuit',
    necRef: 'NEC 210.8(A)(1)',
    notes: [
      'GFCI outlets on north wall flanking vanity — within 3 ft of sink basin (NEC 210.52(D))',
      '3 ft exclusion zone from tub/shower edge — NO outlets permitted in this zone',
      'Vanity light bar on north wall above mirror (wall-mounted fixture)',
      'Exhaust fan on ceiling over shower zone (IRC M1507 — required)',
      'Two switches on east wall near door: vanity light switch + exhaust fan switch',
    ],
    Component: BathroomDiagram,
  },
  living: {
    label: 'Living Room', icon: '🛋',
    title: 'Living Room — Outlet Placement Diagram',
    subtitle: 'NEC 6 ft wall spacing on all walls · TV cluster · AFCI required',
    necRef: 'NEC 210.52(A)',
    notes: [
      'TV/media cluster: two outlets on north wall flanking media console',
      'Sofa outlets on south wall at sofa ends — behind sofa back against south wall',
      'Lamp outlet on west wall at armchair position (18" AFF)',
      'No point on any wall may be more than 6 ft from an outlet',
      'AFCI protection required on all living room circuits (NEC 210.12)',
    ],
    Component: LivingRoomDiagram,
  },
  office: {
    label: 'Home Office', icon: '💼',
    title: 'Home Office — Outlet Placement Diagram',
    subtitle: 'Dense desk-wall outlets every ~2 ft · Dedicated 20A workstation circuit · AFCI',
    necRef: 'NEC 210.52(A)',
    notes: [
      '5 outlets on north wall at desk height — approximately every 2 ft along desk surface',
      '3 outlets on east wall for east desk segment (L-desk corner)',
      'Dedicated 20A circuit for workstation/UPS on north wall',
      'AFCI protection required on all circuits (NEC 210.12)',
      'Switch on west wall near door at 48" AFF',
    ],
    Component: OfficeDiagram,
  },
  garage: {
    label: 'Garage', icon: '🚗',
    title: 'Garage — Outlet Placement Diagram',
    subtitle: 'All outlets GFCI · One outlet per vehicle bay · EV charger dedicated circuit',
    necRef: 'NEC 210.52(G)',
    notes: [
      'At least one GFCI outlet per vehicle bay (west wall bay 1, east wall bay 2)',
      'Workbench cluster: 4 GFCI outlets on north wall at workbench height',
      'EV charger: dedicated 240V/50A circuit on east wall (NEC 625)',
      'All outlets GFCI protected — no exceptions (NEC 210.8(A)(2))',
      'GDO (garage door opener) switch and light switch on west wall near entry door',
    ],
    Component: GarageDiagram,
  },
  laundry: {
    label: 'Laundry', icon: '🧺',
    title: 'Laundry Room — Outlet Placement Diagram',
    subtitle: 'Dedicated circuits for washer and dryer · GFCI near utility sink · AFCI+GFCI',
    necRef: 'NEC 210.52(F)',
    notes: [
      'Washer: 20A GFCI outlet on north wall directly behind washer (NEC 210.52(F))',
      'Electric dryer: dedicated 30A/240V outlet on north wall directly behind dryer',
      'Utility sink: GFCI outlet on east wall within 3 ft of sink (NEC 210.8(A))',
      'AFCI + GFCI required on all laundry room circuits',
      'Exhaust fan on ceiling for ventilation; switches on west wall near door',
    ],
    Component: LaundryDiagram,
  },
  outdoor: {
    label: 'Outdoor / Patio', icon: '🌿',
    title: 'Outdoor / Patio — Outlet Placement Diagram',
    subtitle: 'All outlets GFCI with weatherproof in-use covers · At least one per wall',
    necRef: 'NEC 210.52(E)',
    notes: [
      'All outlets GFCI protected with weatherproof "in-use" covers (NEC 406.9(B))',
      'At least one outlet on each wall of the dwelling exterior (NEC 210.52(E))',
      'BBQ/grill outlet on south wall near grill — dedicated 20A GFCI/WP',
      'Exterior light switch: weatherproof cover on house wall near door',
      'Overhead patio light and task light near BBQ area on dedicated circuit',
    ],
    Component: OutdoorDiagram,
  },
};

const ROOM_ORDER: DiagramRoom[] = ['bedroom','kitchen','bathroom','living','office','garage','laundry','outdoor'];

// ─── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { color: OUTLET_BLUE, label: 'Standard Outlet' },
    { color: GFCI_RED, label: 'GFCI Outlet' },
    { color: DEDICATED_PURPLE, label: 'Dedicated Circuit' },
    { color: SWITCH_GREEN, label: 'Switch' },
    { color: LIGHT_AMBER, label: 'Light Fixture' },
    { color: '#6B7280', label: 'Exhaust Fan' },
  ];
  return (
    <div className="flex flex-wrap gap-4 mt-3 px-1">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm border-2 flex-shrink-0"
            style={{ borderColor: color, backgroundColor: color + '22' }} />
          <span className="text-xs font-medium text-slate-600">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function RoomDiagrams() {
  const [active, setActive] = useState<DiagramRoom>('bedroom');
  const cfg = DIAGRAMS[active];
  const { Component } = cfg;

  return (
    <div className="space-y-5">
      {/* Room tabs */}
      <div className="flex flex-wrap gap-2">
        {ROOM_ORDER.map((id) => {
          const { label, icon } = DIAGRAMS[id];
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-slate-900 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={isActive ? { backgroundColor: '#CDF765', borderColor: '#CDF765' } : {}}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Diagram card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{cfg.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{cfg.subtitle}</p>
            </div>
            <span className="flex-shrink-0 text-xs font-mono font-semibold px-2 py-1 rounded border border-slate-200 text-slate-600 bg-slate-50">
              {cfg.necRef}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50">
          <Component />
        </div>

        <div className="px-5 pb-4 border-t border-slate-100 pt-3">
          <Legend />
        </div>
      </div>

      {/* Key placement notes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h4 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-wide">Key Placement Notes</h4>
        <ul className="space-y-2">
          {cfg.notes.map((note, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 text-white"
                style={{ backgroundColor: NAVY }}>
                {i + 1}
              </span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
