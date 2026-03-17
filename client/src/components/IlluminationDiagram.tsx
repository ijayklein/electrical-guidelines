/**
 * IlluminationDiagram.tsx
 * Design Philosophy: Industrial Modernism / Spacial brand
 * 
 * SVG floor plan diagrams showing LIGHT FIXTURE placement, switch types,
 * and illumination zone overlays for each room type.
 *
 * All electrical items are wall-mounted or ceiling-mounted — never floating.
 * Illumination zones shown as semi-transparent radial overlays.
 *
 * Symbol legend:
 *   ⊕  Ceiling fixture (ambient) — circle with X
 *   ⊙  Recessed downlight — small filled circle
 *   ≡  Under-cabinet strip light — rectangle on wall
 *   ◈  Wall sconce — diamond on wall
 *   ▲  Accent/spotlight — triangle pointing at surface
 *   S  Single-pole switch — on wall near door
 *   S3 3-way switch — on wall (two locations)
 *   SD Dimmer switch — on wall
 *   SO Occupancy sensor — on wall/ceiling
 *   ~  Illumination zone — radial gradient overlay
 */

import { useState } from 'react';

// ─── Shared SVG primitives ────────────────────────────────────────────────────

/** Ceiling fixture: circle with X (standard symbol) */
function CeilingFixture({ cx, cy, r = 14, color = '#F5A623', label = '', sublabel = '' }: {
  cx: number; cy: number; r?: number; color?: string; label?: string; sublabel?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={color} strokeWidth={2} />
      <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke={color} strokeWidth={1.5} />
      <line x1={cx + r * 0.7} y1={cy - r * 0.7} x2={cx - r * 0.7} y2={cy + r * 0.7} stroke={color} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={3} fill={color} />
      {label && <text x={cx} y={cy + r + 11} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#030424">{label}</text>}
      {sublabel && <text x={cx} y={cy + r + 20} textAnchor="middle" fontSize={7} fill="#555">{sublabel}</text>}
    </g>
  );
}

/** Recessed downlight: filled circle with outer ring */
function RecessedLight({ cx, cy, r = 8, color = '#CDF765', label = '' }: {
  cx: number; cy: number; r?: number; color?: string; label?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="#06004A" strokeWidth={1.5} opacity={0.9} />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#06004A" />
      {label && <text x={cx} y={cy + r + 10} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#030424">{label}</text>}
    </g>
  );
}

/** Wall sconce: diamond shape on wall */
function WallSconce({ x, y, side = 'left', color = '#F5A623', label = '' }: {
  x: number; y: number; side?: 'left' | 'right' | 'top' | 'bottom'; color?: string; label?: string;
}) {
  const size = 9;
  const pts = side === 'left'
    ? `${x},${y} ${x + size},${y - size} ${x + size * 2},${y} ${x + size},${y + size}`
    : side === 'right'
    ? `${x},${y} ${x - size},${y - size} ${x - size * 2},${y} ${x - size},${y + size}`
    : side === 'top'
    ? `${x},${y} ${x - size},${y + size} ${x},${y + size * 2} ${x + size},${y + size}`
    : `${x},${y} ${x - size},${y - size} ${x},${y - size * 2} ${x + size},${y - size}`;
  const lx = side === 'left' ? x + size * 2 + 4 : side === 'right' ? x - size * 2 - 4 : x;
  const ly = side === 'top' ? y + size * 2 + 10 : side === 'bottom' ? y - size * 2 - 4 : y + 3;
  const anchor = side === 'left' ? 'start' : side === 'right' ? 'end' : 'middle';
  return (
    <g>
      <polygon points={pts} fill={color} stroke="#06004A" strokeWidth={1.5} opacity={0.9} />
      {label && <text x={lx} y={ly} textAnchor={anchor} fontSize={7} fontWeight="bold" fill="#030424">{label}</text>}
    </g>
  );
}

/** Under-cabinet / strip light: thin rectangle on wall */
function StripLight({ x, y, width, height, color = '#CDF765', label = '', labelSide = 'below' }: {
  x: number; y: number; width: number; height: number; color?: string; label?: string; labelSide?: 'below' | 'above' | 'right';
}) {
  const lx = labelSide === 'right' ? x + width + 4 : x + width / 2;
  const ly = labelSide === 'below' ? y + height + 10 : labelSide === 'above' ? y - 4 : y + height / 2 + 3;
  const anchor = labelSide === 'right' ? 'start' : 'middle';
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} stroke="#06004A" strokeWidth={1} rx={2} opacity={0.85} />
      {label && <text x={lx} y={ly} textAnchor={anchor} fontSize={7} fontWeight="bold" fill="#030424">{label}</text>}
    </g>
  );
}

/** Accent / track spotlight: small triangle pointing toward surface */
function AccentSpot({ cx, cy, angle = 0, color = '#1705E5', label = '' }: {
  cx: number; cy: number; angle?: number; color?: string; label?: string;
}) {
  return (
    <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
      <polygon points={`${cx},${cy - 10} ${cx - 7},${cy + 6} ${cx + 7},${cy + 6}`} fill={color} stroke="#030424" strokeWidth={1} opacity={0.85} />
      {label && <text x={cx} y={cy + 18} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#030424" transform={`rotate(${-angle}, ${cx}, ${cy + 18})`}>{label}</text>}
    </g>
  );
}

/** Switch symbol on wall */
function Switch({ x, y, type = 'S', side = 'left' }: {
  x: number; y: number; type?: string; side?: 'left' | 'right' | 'top' | 'bottom';
}) {
  const bg = type === 'SD' ? '#1705E5' : type === 'S3' ? '#06004A' : type === 'SO' ? '#CDF765' : '#06004A';
  const fg = type === 'SO' ? '#030424' : '#CDF765';
  const lx = side === 'right' ? x - 18 : side === 'left' ? x + 2 : x - 9;
  const ly = side === 'bottom' ? y - 2 : side === 'top' ? y + 14 : y + 5;
  return (
    <g>
      <rect x={lx} y={ly - 8} width={18} height={12} rx={2} fill={bg} stroke="#030424" strokeWidth={1} />
      <text x={lx + 9} y={ly + 1} textAnchor="middle" fontSize={6.5} fontWeight="bold" fill={fg}>{type}</text>
    </g>
  );
}

/** Illumination zone: radial gradient circle overlay */
function IllumZone({ cx, cy, r, color = '#F5A623', opacity = 0.12, id }: {
  cx: number; cy: number; r: number; color?: string; opacity?: number; id: string;
}) {
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 2.5} />
          <stop offset="60%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
    </g>
  );
}

/** Chandelier: decorative ceiling fixture */
function Chandelier({ cx, cy, r = 18, color = '#F5A623' }: {
  cx: number; cy: number; r?: number; color?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} strokeDasharray="4 2" />
      <circle cx={cx} cy={cy} r={r * 0.4} fill="white" stroke={color} strokeWidth={2} />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy - r * 0.4} stroke={color} strokeWidth={1.5} />
      <line x1={cx} y1={cy + r * 0.4} x2={cx} y2={cy + r} stroke={color} strokeWidth={1.5} />
      <line x1={cx - r} y1={cy} x2={cx - r * 0.4} y2={cy} stroke={color} strokeWidth={1.5} />
      <line x1={cx + r * 0.4} y1={cy} x2={cx + r} y2={cy} stroke={color} strokeWidth={1.5} />
      <text x={cx} y={cy + r + 12} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#030424">CHAND</text>
      <text x={cx} y={cy + r + 21} textAnchor="middle" fontSize={7} fill="#555">Dimmer req'd</text>
    </g>
  );
}

/** Fan/light combo */
function CeilingFan({ cx, cy, color = '#06004A' }: { cx: number; cy: number; color?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={16} fill="white" stroke={color} strokeWidth={2} />
      {[0, 90, 180, 270].map(a => (
        <ellipse key={a} cx={cx} cy={cy} rx={14} ry={5} fill={color} opacity={0.25}
          transform={`rotate(${a}, ${cx}, ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={4} fill={color} />
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#030424">FAN/LIGHT</text>
    </g>
  );
}

// ─── Room Diagrams ────────────────────────────────────────────────────────────

/** BEDROOM illumination diagram */
function BedroomIllumDiagram() {
  // Room: 560×420 SVG, walls at x=50,510 y=50,450
  // North wall (top): bed headboard flush against it
  // Bed: x=155–405, y=50–220 (headboard at y=50)
  // Left nightstand: x=108–155, y=50–120
  // Right nightstand: x=405–452, y=50–120
  // Closet: east wall x=462–510, y=50–180
  // Desk: east wall x=462–510, y=210–310
  // Dresser: south wall y=390–450, x=200–330
  return (
    <svg viewBox="0 0 560 500" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={280} cy={240} r={160} color="#F5A623" opacity={0.10} id="bed-amb" />
      <IllumZone cx={490} cy={260} r={80} color="#CDF765" opacity={0.12} id="bed-desk" />
      <IllumZone cx={130} cy={85} r={35} color="#F5A623" opacity={0.15} id="bed-nsd-l" />
      <IllumZone cx={430} cy={85} r={35} color="#F5A623" opacity={0.15} id="bed-nsd-r" />

      {/* Room walls */}
      <rect x={50} y={50} width={460} height={400} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door opening — south wall */}
      <line x1={50} y1={450} x2={130} y2={450} stroke="#06004A" strokeWidth={3} />
      <line x1={190} y1={450} x2={510} y2={450} stroke="#06004A" strokeWidth={3} />
      <path d="M130,450 A60,60 0 0,1 190,390" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Closet — east wall upper (y=50 to y=160, clear of sconces at y=85 on north wall) */}
      <rect x={462} y={50} width={48} height={110} fill="#e8e8e0" stroke="#06004A" strokeWidth={1.5} />
      <text x={486} y={100} textAnchor="middle" fontSize={8} fill="#555" fontWeight="bold">CLOSET</text>
      <line x1={462} y1={50} x2={510} y2={160} stroke="#aaa" strokeWidth={1} />
      <line x1={510} y1={50} x2={462} y2={160} stroke="#aaa" strokeWidth={1} />

      {/* Desk — east wall lower */}
      <rect x={462} y={180} width={48} height={100} fill="#dde8f0" stroke="#06004A" strokeWidth={1.5} />
      <text x={486} y={232} textAnchor="middle" fontSize={8} fill="#555" fontWeight="bold">DESK</text>

      {/* Bed */}
      <rect x={155} y={50} width={250} height={170} fill="#d8dce8" stroke="#06004A" strokeWidth={1.5} />
      <rect x={155} y={50} width={250} height={35} fill="#b0b8d0" stroke="#06004A" strokeWidth={1} />
      <text x={280} y={145} textAnchor="middle" fontSize={10} fill="#06004A" fontWeight="bold">BED</text>
      <text x={280} y={70} textAnchor="middle" fontSize={8} fill="#030424">HEADBOARD</text>

      {/* Nightstands */}
      <rect x={108} y={50} width={47} height={70} fill="#e0e4ec" stroke="#06004A" strokeWidth={1.5} />
      <text x={131} y={88} textAnchor="middle" fontSize={7} fill="#555">NSD</text>
      <rect x={405} y={50} width={47} height={70} fill="#e0e4ec" stroke="#06004A" strokeWidth={1.5} />
      <text x={428} y={88} textAnchor="middle" fontSize={7} fill="#555">NSD</text>

      {/* Dresser — south wall */}
      <rect x={200} y={390} width={130} height={60} fill="#d8dce8" stroke="#06004A" strokeWidth={1.5} />
      <text x={265} y={423} textAnchor="middle" fontSize={8} fill="#555">DRESSER</text>
      {/* Dresser mirror sconce — on south wall above dresser, centered on dresser width */}
      <WallSconce x={265} y={390} side="bottom" color="#F5A623" label="DRESSER SCONCE" />

      {/* ── LIGHTING FIXTURES ── */}
      {/* Main ceiling fixture — center room, on dimmer */}
      <CeilingFixture cx={280} cy={260} r={16} color="#F5A623" label="CEILING" sublabel="Dimmer" />

      {/* Closet light — ceiling-mounted in closet center */}
      <RecessedLight cx={486} cy={100} r={8} color="#CDF765" label="CLOSET" />

      {/* Nightstand sconces — on NORTH wall behind each nightstand (not on east wall near closet) */}
      {/* Left sconce: behind left nightstand (center x≈131), attached to north wall y=50 */}
      <WallSconce x={131} y={50} side="top" color="#F5A623" label="SCONCE L" />
      {/* Right sconce: behind right nightstand (center x≈428), attached to north wall y=50 */}
      <WallSconce x={428} y={50} side="top" color="#F5A623" label="SCONCE R" />

      {/* Desk task light — strip runs LEFT-TO-RIGHT across desk width (48px wide), above desk surface */}
      <StripLight x={462} y={178} width={48} height={5} color="#CDF765" label="TASK" labelSide="right" />

      {/* ── SWITCHES ── */}
      {/* Main dimmer switch — west wall near door */}
      <Switch x={50} y={390} type="SD" side="left" />
      <text x={75} y={388} fontSize={7} fill="#1705E5" fontWeight="bold">DIMMER</text>
      <text x={75} y={397} fontSize={6} fill="#555">Main light</text>

      {/* 3-way switch — if second door on east wall (near closet) */}
      <Switch x={510} y={390} type="S3" side="right" />
      <text x={487} y={388} textAnchor="end" fontSize={7} fill="#06004A" fontWeight="bold">3-WAY</text>
      <text x={487} y={397} textAnchor="end" fontSize={6} fill="#555">Alt entry</text>

      {/* Closet switch — east wall at closet entry (below closet, above desk) */}
      <Switch x={510} y={165} type="S" side="right" />
      <text x={487} y={163} textAnchor="end" fontSize={7} fill="#06004A" fontWeight="bold">SW</text>
      <text x={487} y={172} textAnchor="end" fontSize={6} fill="#555">Closet</text>

      {/* Legend */}
      <rect x={50} y={460} width={460} height={35} fill="#06004A" rx={4} />
      <circle cx={70} cy={477} r={6} fill="none" stroke="#F5A623" strokeWidth={1.5} />
      <line x1={65} y1={472} x2={75} y2={482} stroke="#F5A623" strokeWidth={1} />
      <line x1={75} y1={472} x2={65} y2={482} stroke="#F5A623" strokeWidth={1} />
      <text x={80} y={481} fontSize={8} fill="#F5F5F1">Ceiling/Sconce</text>
      <circle cx={165} cy={477} r={5} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={174} y={481} fontSize={8} fill="#F5F5F1">Recessed/Strip</text>
      <rect x={255} y={471} width={14} height={8} rx={1} fill="#06004A" stroke="#CDF765" strokeWidth={1} />
      <text x={273} y={481} fontSize={8} fill="#F5F5F1">Switch (SD=Dimmer, S3=3-way)</text>
      <circle cx={430} cy={477} r={55} fill="url(#bed-amb)" />
      <text x={445} y={481} fontSize={8} fill="#F5F5F1">Illum. zone</text>
    </svg>
  );
}

/** KITCHEN illumination diagram */
function KitchenIllumDiagram() {
  return (
    <svg viewBox="0 0 560 500" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={280} cy={240} r={150} color="#F5A623" opacity={0.09} id="kit-amb" />
      <IllumZone cx={180} cy={100} r={70} color="#CDF765" opacity={0.15} id="kit-counter-n" />
      <IllumZone cx={490} cy={220} r={60} color="#CDF765" opacity={0.15} id="kit-counter-e" />
      <IllumZone cx={280} cy={370} r={55} color="#CDF765" opacity={0.13} id="kit-island" />

      {/* Room walls */}
      <rect x={50} y={50} width={460} height={400} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door — south wall */}
      <line x1={50} y1={450} x2={130} y2={450} stroke="#06004A" strokeWidth={3} />
      <line x1={190} y1={450} x2={510} y2={450} stroke="#06004A" strokeWidth={3} />
      <path d="M130,450 A60,60 0 0,1 190,390" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Counter — north wall */}
      <rect x={50} y={50} width={310} height={60} fill="#c8d8e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={205} y={85} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">COUNTER (N)</text>
      {/* Sink */}
      <rect x={130} y={55} width={60} height={50} fill="#a8c0d8" stroke="#06004A" strokeWidth={1} />
      <text x={160} y={83} textAnchor="middle" fontSize={7} fill="#030424">SINK</text>
      {/* Range */}
      <rect x={240} y={55} width={70} height={55} fill="#b0b8c8" stroke="#06004A" strokeWidth={1} />
      <text x={275} y={86} textAnchor="middle" fontSize={7} fill="#030424">RANGE</text>

      {/* Counter — east wall */}
      <rect x={450} y={110} width={60} height={200} fill="#c8d8e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={480} y={215} textAnchor="middle" fontSize={8} fill="#06004A" fontWeight="bold" transform="rotate(-90,480,215)">COUNTER (E)</text>
      {/* Refrigerator */}
      <rect x={450} y={50} width={60} height={60} fill="#b8c8d8" stroke="#06004A" strokeWidth={1.5} />
      <text x={480} y={83} textAnchor="middle" fontSize={8} fill="#030424" fontWeight="bold">FRIDGE</text>

      {/* Island */}
      <rect x={180} y={310} width={200} height={80} fill="#d8e0e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={280} y={355} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">ISLAND</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* Recessed downlights — ceiling grid */}
      <RecessedLight cx={150} cy={200} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={280} cy={200} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={380} cy={200} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={150} cy={290} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={380} cy={290} r={9} color="#CDF765" label="REC" />

      {/* Under-cabinet strip — north counter */}
      <StripLight x={55} y={108} width={300} height={6} color="#CDF765" label="UNDER-CAB STRIP (N wall)" labelSide="below" />

      {/* Under-cabinet strip — east counter */}
      <StripLight x={444} y={115} width={6} height={190} color="#CDF765" label="" />
      <text x={437} y={215} textAnchor="end" fontSize={7} fontWeight="bold" fill="#030424">STRIP</text>

      {/* Pendant lights over island */}
      <CeilingFixture cx={230} cy={350} r={11} color="#F5A623" label="PEND" sublabel="Dimmer" />
      <CeilingFixture cx={330} cy={350} r={11} color="#F5A623" label="PEND" sublabel="Dimmer" />

      {/* Range hood light — above range */}
      <StripLight x={240} y={108} width={70} height={5} color="#F5A623" label="HOOD LIGHT" labelSide="above" />

      {/* ── SWITCHES ── */}
      {/* Dimmer for recessed — west wall near door */}
      <Switch x={50} y={390} type="SD" side="left" />
      <text x={75} y={388} fontSize={7} fill="#1705E5" fontWeight="bold">DIMMER</text>
      <text x={75} y={397} fontSize={6} fill="#555">Recessed</text>

      {/* Switch for under-cabinet */}
      <Switch x={50} y={360} type="S" side="left" />
      <text x={75} y={358} fontSize={7} fill="#06004A" fontWeight="bold">SW</text>
      <text x={75} y={367} fontSize={6} fill="#555">Under-cab</text>

      {/* Switch for pendants */}
      <Switch x={50} y={330} type="SD" side="left" />
      <text x={75} y={328} fontSize={7} fill="#1705E5" fontWeight="bold">DIMMER</text>
      <text x={75} y={337} fontSize={6} fill="#555">Pendants</text>

      {/* Legend */}
      <rect x={50} y={460} width={460} height={35} fill="#06004A" rx={4} />
      <circle cx={70} cy={477} r={7} fill="none" stroke="#F5A623" strokeWidth={1.5} />
      <line x1={64} y1={471} x2={76} y2={483} stroke="#F5A623" strokeWidth={1} />
      <line x1={76} y1={471} x2={64} y2={483} stroke="#F5A623" strokeWidth={1} />
      <text x={82} y={481} fontSize={8} fill="#F5F5F1">Pendant/Ceiling</text>
      <circle cx={170} cy={477} r={6} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={180} y={481} fontSize={8} fill="#F5F5F1">Recessed/Strip</text>
      <rect x={260} y={471} width={14} height={8} rx={1} fill="#1705E5" stroke="#CDF765" strokeWidth={1} />
      <text x={278} y={481} fontSize={8} fill="#F5F5F1">Dimmer switch</text>
      <rect x={360} y={471} width={14} height={8} rx={1} fill="#06004A" stroke="#CDF765" strokeWidth={1} />
      <text x={378} y={481} fontSize={8} fill="#F5F5F1">Single-pole SW</text>
    </svg>
  );
}

/** BATHROOM illumination diagram */
function BathroomIllumDiagram() {
  return (
    <svg viewBox="0 0 400 460" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={200} cy={230} r={120} color="#F5A623" opacity={0.09} id="bath-amb" />
      <IllumZone cx={200} cy={100} r={60} color="#CDF765" opacity={0.15} id="bath-vanity" />

      {/* Room walls */}
      <rect x={40} y={40} width={320} height={360} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door — south wall */}
      <line x1={40} y1={400} x2={100} y2={400} stroke="#06004A" strokeWidth={3} />
      <line x1={160} y1={400} x2={360} y2={400} stroke="#06004A" strokeWidth={3} />
      <path d="M100,400 A60,60 0 0,1 160,340" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Vanity — north wall */}
      <rect x={40} y={40} width={200} height={60} fill="#c8d8e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={140} y={75} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">VANITY</text>
      {/* Sink */}
      <circle cx={140} cy={70} r={20} fill="#a8c0d8" stroke="#06004A" strokeWidth={1} />
      <text x={140} y={74} textAnchor="middle" fontSize={7} fill="#030424">SINK</text>

      {/* Toilet — east wall */}
      <rect x={300} y={40} width={60} height={90} fill="#d8d8d8" stroke="#06004A" strokeWidth={1.5} />
      <text x={330} y={90} textAnchor="middle" fontSize={8} fill="#555">TOILET</text>

      {/* Tub/Shower — south-west */}
      <rect x={40} y={220} width={180} height={180} fill="#b8d0e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={130} y={315} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">TUB / SHOWER</text>
      <text x={130} y={328} textAnchor="middle" fontSize={7} fill="#555">Wet zone</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* Vanity bar light — on NORTH wall above mirror */}
      <StripLight x={40} y={38} width={200} height={8} color="#F5A623" label="VANITY BAR (N wall)" labelSide="below" />

      {/* Recessed ceiling — center room (damp rated) */}
      <RecessedLight cx={200} cy={200} r={10} color="#CDF765" label="REC (damp)" />

      {/* Shower light — wet-rated recessed in shower zone */}
      <RecessedLight cx={130} cy={280} r={9} color="#1705E5" label="WET RATED" />

      {/* Exhaust fan/light combo — ceiling near toilet */}
      <CeilingFixture cx={310} cy={180} r={12} color="#06004A" label="FAN/LIGHT" sublabel="Exhaust" />

      {/* ── SWITCHES ── */}
      {/* Switch for vanity bar — east of door */}
      <Switch x={160} y={400} type="S" side="bottom" />
      <text x={160} y={420} textAnchor="middle" fontSize={7} fill="#06004A" fontWeight="bold">SW-VANITY</text>

      {/* Switch for exhaust fan/light — separate from vanity */}
      <Switch x={40} y={340} type="S" side="left" />
      <text x={65} y={338} fontSize={7} fill="#06004A" fontWeight="bold">SW</text>
      <text x={65} y={347} fontSize={6} fill="#555">Fan/Light</text>

      {/* GFCI note near wet zone */}
      <rect x={220} y={280} width={100} height={28} rx={3} fill="#06004A" opacity={0.85} />
      <text x={270} y={293} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#CDF765">⚠ WET ZONE</text>
      <text x={270} y={303} textAnchor="middle" fontSize={6} fill="#F5F5F1">Wet-rated fixtures only</text>
      <text x={270} y={312} textAnchor="middle" fontSize={6} fill="#F5F5F1">No switches inside zone</text>

      {/* Legend */}
      <rect x={40} y={415} width={320} height={35} fill="#06004A" rx={4} />
      <rect x={55} y={425} width={30} height={6} rx={1} fill="#F5A623" />
      <text x={90} y={432} fontSize={8} fill="#F5F5F1">Vanity bar</text>
      <circle cx={155} cy={428} r={6} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={165} y={432} fontSize={8} fill="#F5F5F1">Recessed (damp)</text>
      <circle cx={250} cy={428} r={6} fill="#1705E5" stroke="#030424" strokeWidth={1} />
      <text x={260} y={432} fontSize={8} fill="#F5F5F1">Wet-rated</text>
    </svg>
  );
}

/** LIVING ROOM illumination diagram */
function LivingRoomIllumDiagram() {
  return (
    <svg viewBox="0 0 600 500" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={300} cy={240} r={180} color="#F5A623" opacity={0.08} id="lr-amb" />
      <IllumZone cx={490} cy={150} r={70} color="#1705E5" opacity={0.10} id="lr-accent" />
      <IllumZone cx={120} cy={300} r={60} color="#F5A623" opacity={0.12} id="lr-reading" />

      {/* Room walls */}
      <rect x={50} y={50} width={500} height={400} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door — south wall */}
      <line x1={50} y1={450} x2={130} y2={450} stroke="#06004A" strokeWidth={3} />
      <line x1={190} y1={450} x2={550} y2={450} stroke="#06004A" strokeWidth={3} />
      <path d="M130,450 A60,60 0 0,1 190,390" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* TV wall — east */}
      <rect x={510} y={100} width={40} height={120} fill="#c0c8d8" stroke="#06004A" strokeWidth={1.5} />
      <text x={530} y={165} textAnchor="middle" fontSize={8} fill="#06004A" fontWeight="bold" transform="rotate(-90,530,165)">TV WALL</text>

      {/* Sofa */}
      <rect x={100} y={250} width={260} height={80} fill="#d0d8e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={230} y={295} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">SOFA</text>

      {/* Fireplace — north wall */}
      <rect x={200} y={50} width={150} height={50} fill="#b8b0a8" stroke="#06004A" strokeWidth={1.5} />
      <text x={275} y={80} textAnchor="middle" fontSize={9} fill="#030424" fontWeight="bold">FIREPLACE</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* Recessed downlights — ceiling grid */}
      <RecessedLight cx={150} cy={160} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={300} cy={160} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={420} cy={160} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={150} cy={240} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={420} cy={240} r={9} color="#CDF765" label="REC" />

      {/* Accent spots — above fireplace mantel */}
      <AccentSpot cx={230} cy={105} angle={0} color="#1705E5" label="ACCENT" />
      <AccentSpot cx={320} cy={105} angle={0} color="#1705E5" label="ACCENT" />

      {/* Wall sconce — reading light near sofa, west wall */}
      <WallSconce x={50} y={290} side="left" color="#F5A623" label="SCONCE" />

      {/* Cove/valance light — near ceiling north wall */}
      <StripLight x={55} y={55} width={140} height={5} color="#F5A623" label="COVE" labelSide="below" />
      <StripLight x={360} y={55} width={140} height={5} color="#F5A623" label="COVE" labelSide="below" />

      {/* ── SWITCHES ── */}
      {/* Dimmer for recessed — west wall near door */}
      <Switch x={50} y={390} type="SD" side="left" />
      <text x={75} y={388} fontSize={7} fill="#1705E5" fontWeight="bold">DIMMER</text>
      <text x={75} y={397} fontSize={6} fill="#555">Recessed</text>

      {/* 3-way switch — east wall (second entry) */}
      <Switch x={550} y={390} type="S3" side="right" />
      <text x={527} y={388} textAnchor="end" fontSize={7} fill="#06004A" fontWeight="bold">3-WAY</text>
      <text x={527} y={397} textAnchor="end" fontSize={6} fill="#555">Alt entry</text>

      {/* Switch for accent */}
      <Switch x={50} y={360} type="S" side="left" />
      <text x={75} y={358} fontSize={7} fill="#06004A" fontWeight="bold">SW</text>
      <text x={75} y={367} fontSize={6} fill="#555">Accent/Cove</text>

      {/* Legend */}
      <rect x={50} y={460} width={500} height={35} fill="#06004A" rx={4} />
      <circle cx={70} cy={477} r={6} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={80} y={481} fontSize={8} fill="#F5F5F1">Recessed (ambient)</text>
      <polygon points="170,471 163,483 177,483" fill="#1705E5" />
      <text x={182} y={481} fontSize={8} fill="#F5F5F1">Accent spot</text>
      <polygon points="255,471 248,483 262,483" fill="#F5A623" />
      <text x={267} y={481} fontSize={8} fill="#F5F5F1">Sconce/Cove</text>
      <rect x={345} y={471} width={14} height={8} rx={1} fill="#1705E5" stroke="#CDF765" strokeWidth={1} />
      <text x={363} y={481} fontSize={8} fill="#F5F5F1">Dimmer</text>
      <rect x={415} y={471} width={14} height={8} rx={1} fill="#06004A" stroke="#CDF765" strokeWidth={1} />
      <text x={433} y={481} fontSize={8} fill="#F5F5F1">3-Way SW</text>
    </svg>
  );
}

/** DINING ROOM illumination diagram */
function DiningRoomIllumDiagram() {
  return (
    <svg viewBox="0 0 500 480" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={250} cy={220} r={130} color="#F5A623" opacity={0.12} id="dr-chand" />
      <IllumZone cx={250} cy={220} r={70} color="#F5A623" opacity={0.18} id="dr-chand2" />
      <IllumZone cx={100} cy={300} r={50} color="#CDF765" opacity={0.12} id="dr-buffet" />

      {/* Room walls */}
      <rect x={50} y={50} width={400} height={360} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door — south wall */}
      <line x1={50} y1={410} x2={120} y2={410} stroke="#06004A" strokeWidth={3} />
      <line x1={180} y1={410} x2={450} y2={410} stroke="#06004A" strokeWidth={3} />
      <path d="M120,410 A60,60 0 0,1 180,350" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Dining table */}
      <ellipse cx={250} cy={220} rx={130} ry={70} fill="#d0c8b8" stroke="#06004A" strokeWidth={1.5} />
      <text x={250} y={225} textAnchor="middle" fontSize={10} fill="#06004A" fontWeight="bold">DINING TABLE</text>

      {/* Chairs (simplified) */}
      {[[-100,0],[100,0],[0,-60],[0,60],[-70,-45],[70,-45],[-70,45],[70,45]].map(([dx,dy],i) => (
        <circle key={i} cx={250+dx} cy={220+dy} r={12} fill="#e8e0d0" stroke="#06004A" strokeWidth={1} />
      ))}

      {/* Buffet — west wall */}
      <rect x={50} y={260} width={70} height={100} fill="#d8d0c0" stroke="#06004A" strokeWidth={1.5} />
      <text x={85} y={315} textAnchor="middle" fontSize={8} fill="#555">BUFFET</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* Chandelier — centered over table, on dimmer */}
      <Chandelier cx={250} cy={220} r={22} color="#F5A623" />

      {/* Recessed downlights — perimeter */}
      <RecessedLight cx={130} cy={130} r={8} color="#CDF765" label="REC" />
      <RecessedLight cx={370} cy={130} r={8} color="#CDF765" label="REC" />
      <RecessedLight cx={130} cy={330} r={8} color="#CDF765" label="REC" />
      <RecessedLight cx={370} cy={330} r={8} color="#CDF765" label="REC" />

      {/* Buffet sconce / under-cabinet strip */}
      <StripLight x={50} y={258} width={70} height={5} color="#CDF765" label="BUFFET STRIP" labelSide="right" />

      {/* ── SWITCHES ── */}
      {/* Dimmer for chandelier — west wall near door */}
      <Switch x={50} y={360} type="SD" side="left" />
      <text x={75} y={358} fontSize={7} fill="#1705E5" fontWeight="bold">DIMMER</text>
      <text x={75} y={367} fontSize={6} fill="#555">Chandelier</text>

      {/* Switch for recessed */}
      <Switch x={50} y={330} type="S" side="left" />
      <text x={75} y={328} fontSize={7} fill="#06004A" fontWeight="bold">SW</text>
      <text x={75} y={337} fontSize={6} fill="#555">Recessed</text>

      {/* Legend */}
      <rect x={50} y={425} width={400} height={35} fill="#06004A" rx={4} />
      <circle cx={70} cy={442} r={10} fill="none" stroke="#F5A623" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={85} y={446} fontSize={8} fill="#F5F5F1">Chandelier (dimmer req'd)</text>
      <circle cx={210} cy={442} r={6} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={220} y={446} fontSize={8} fill="#F5F5F1">Recessed perimeter</text>
      <rect x={330} y={436} width={14} height={8} rx={1} fill="#1705E5" stroke="#CDF765" strokeWidth={1} />
      <text x={348} y={446} fontSize={8} fill="#F5F5F1">Dimmer SW</text>
    </svg>
  );
}

/** HOME OFFICE illumination diagram */
function HomeOfficeIllumDiagram() {
  return (
    <svg viewBox="0 0 500 480" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={250} cy={230} r={150} color="#CDF765" opacity={0.09} id="ho-amb" />
      <IllumZone cx={400} cy={150} r={80} color="#CDF765" opacity={0.14} id="ho-desk" />

      {/* Room walls */}
      <rect x={50} y={50} width={400} height={360} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door — south wall */}
      <line x1={50} y1={410} x2={120} y2={410} stroke="#06004A" strokeWidth={3} />
      <line x1={180} y1={410} x2={450} y2={410} stroke="#06004A" strokeWidth={3} />
      <path d="M120,410 A60,60 0 0,1 180,350" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Desk — east wall */}
      <rect x={350} y={50} width={100} height={200} fill="#d0dce8" stroke="#06004A" strokeWidth={1.5} />
      <text x={400} y={155} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">DESK</text>

      {/* Bookshelf — north wall */}
      <rect x={50} y={50} width={280} height={50} fill="#d8d0c0" stroke="#06004A" strokeWidth={1.5} />
      <text x={190} y={80} textAnchor="middle" fontSize={9} fill="#555">BOOKSHELF</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* Recessed downlights — ceiling */}
      <RecessedLight cx={160} cy={200} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={280} cy={200} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={160} cy={310} r={9} color="#CDF765" label="REC" />
      <RecessedLight cx={280} cy={310} r={9} color="#CDF765" label="REC" />

      {/* Task light — strip runs LEFT-TO-RIGHT across desk width (100px), above desk surface */}
      <StripLight x={350} y={48} width={100} height={5} color="#CDF765" label="TASK STRIP" labelSide="right" />

      {/* Bookshelf accent — strip on north wall above shelf */}
      <StripLight x={55} y={50} width={280} height={5} color="#1705E5" label="SHELF ACCENT" labelSide="below" />

      {/* ── SWITCHES ── */}
      {/* Occupancy sensor — ceiling or wall near entry */}
      <Switch x={50} y={390} type="SO" side="left" />
      <text x={75} y={388} fontSize={7} fill="#CDF765" fontWeight="bold" style={{backgroundColor:'#06004A'}}>OCC SENSOR</text>
      <text x={75} y={397} fontSize={6} fill="#555">IECC req'd</text>

      {/* Switch for task/accent */}
      <Switch x={50} y={360} type="S" side="left" />
      <text x={75} y={358} fontSize={7} fill="#06004A" fontWeight="bold">SW</text>
      <text x={75} y={367} fontSize={6} fill="#555">Task/Accent</text>

      {/* Legend */}
      <rect x={50} y={425} width={400} height={35} fill="#06004A" rx={4} />
      <circle cx={70} cy={442} r={6} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={80} y={446} fontSize={8} fill="#F5F5F1">Recessed (4000K neutral)</text>
      <rect x={200} y={436} width={6} height={14} rx={1} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={210} y={446} fontSize={8} fill="#F5F5F1">Task strip</text>
      <rect x={270} y={436} width={14} height={8} rx={1} fill="#CDF765" stroke="#030424" strokeWidth={1} />
      <text x={288} y={446} fontSize={8} fill="#F5F5F1">Occ. sensor (IECC)</text>
    </svg>
  );
}

/** GARAGE illumination diagram */
function GarageIllumDiagram() {
  return (
    <svg viewBox="0 0 600 480" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={300} cy={220} r={200} color="#CDF765" opacity={0.08} id="gar-amb" />
      <IllumZone cx={490} cy={300} r={80} color="#CDF765" opacity={0.13} id="gar-bench" />

      {/* Room walls */}
      <rect x={50} y={50} width={500} height={380} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Garage door — south wall */}
      <rect x={100} y={390} width={360} height={40} fill="#c8c8c8" stroke="#06004A" strokeWidth={2} />
      <text x={280} y={415} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">GARAGE DOOR</text>

      {/* Pedestrian door — west wall */}
      <line x1={50} y1={50} x2={50} y2={130} stroke="#06004A" strokeWidth={3} />
      <line x1={50} y1={190} x2={50} y2={430} stroke="#06004A" strokeWidth={3} />
      <path d="M50,130 A60,60 0 0,0 110,190" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Vehicle bays */}
      <line x1={300} y1={50} x2={300} y2={390} stroke="#aaa" strokeWidth={1} strokeDasharray="6 4" />
      <text x={175} y={230} textAnchor="middle" fontSize={10} fill="#aaa" fontWeight="bold">BAY 1</text>
      <text x={425} y={230} textAnchor="middle" fontSize={10} fill="#aaa" fontWeight="bold">BAY 2</text>

      {/* Workbench — east wall */}
      <rect x={460} y={50} width={90} height={200} fill="#d0c8b8" stroke="#06004A" strokeWidth={1.5} />
      <text x={505} y={155} textAnchor="middle" fontSize={8} fill="#555" fontWeight="bold">WORK-{'\n'}BENCH</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* LED shop lights — ceiling, one per bay */}
      <StripLight x={100} y={55} width={160} height={8} color="#CDF765" label="LED SHOP LIGHT" labelSide="below" />
      <StripLight x={310} y={55} width={160} height={8} color="#CDF765" label="LED SHOP LIGHT" labelSide="below" />

      {/* Garage door opener light */}
      <CeilingFixture cx={175} cy={200} r={12} color="#F5A623" label="OPENER" sublabel="Auto light" />
      <CeilingFixture cx={425} cy={200} r={12} color="#F5A623" label="OPENER" sublabel="Auto light" />

      {/* Workbench task light — strip runs LEFT-TO-RIGHT across bench width (90px), above bench surface */}
      <StripLight x={460} y={48} width={90} height={6} color="#CDF765" label="BENCH STRIP" labelSide="below" />

      {/* Exterior entry light — above pedestrian door */}
      <WallSconce x={50} y={160} side="left" color="#F5A623" label="ENTRY LIGHT" />

      {/* ── SWITCHES ── */}
      {/* 3-way switch — near pedestrian door (interior) */}
      <Switch x={50} y={350} type="S3" side="left" />
      <text x={75} y={348} fontSize={7} fill="#06004A" fontWeight="bold">3-WAY</text>
      <text x={75} y={357} fontSize={6} fill="#555">House door</text>

      {/* 3-way switch — near garage door (second location) */}
      <Switch x={550} y={350} type="S3" side="right" />
      <text x={527} y={348} textAnchor="end" fontSize={7} fill="#06004A" fontWeight="bold">3-WAY</text>
      <text x={527} y={357} textAnchor="end" fontSize={6} fill="#555">Garage door</text>

      {/* Occupancy sensor note */}
      <rect x={200} y={340} width={160} height={22} rx={3} fill="#06004A" opacity={0.85} />
      <text x={280} y={353} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#CDF765">IECC: Occupancy sensor req'd</text>
      <text x={280} y={362} textAnchor="middle" fontSize={6} fill="#F5F5F1">or auto-shutoff control</text>

      {/* Legend */}
      <rect x={50} y={445} width={500} height={30} fill="#06004A" rx={4} />
      <rect x={65} y={453} width={30} height={6} rx={1} fill="#CDF765" />
      <text x={100} y={461} fontSize={8} fill="#F5F5F1">LED shop/strip</text>
      <circle cx={185} cy={456} r={7} fill="none" stroke="#F5A623" strokeWidth={1.5} />
      <text x={196} y={461} fontSize={8} fill="#F5F5F1">Opener light</text>
      <rect x={275} y={451} width={14} height={8} rx={1} fill="#06004A" stroke="#CDF765" strokeWidth={1} />
      <text x={293} y={461} fontSize={8} fill="#F5F5F1">3-Way SW (req'd)</text>
      <polygon points="390,451 383,463 397,463" fill="#F5A623" />
      <text x={402} y={461} fontSize={8} fill="#F5F5F1">Entry sconce</text>
    </svg>
  );
}

/** OUTDOOR / PATIO illumination diagram */
function OutdoorIllumDiagram() {
  return (
    <svg viewBox="0 0 600 480" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={300} cy={300} r={180} color="#F5A623" opacity={0.08} id="out-amb" />
      <IllumZone cx={100} cy={100} r={60} color="#F5A623" opacity={0.15} id="out-entry-f" />
      <IllumZone cx={500} cy={100} r={60} color="#F5A623" opacity={0.15} id="out-entry-r" />

      {/* House wall — north */}
      <rect x={50} y={50} width={500} height={30} fill="#c8c8c8" stroke="#06004A" strokeWidth={3} />
      <text x={300} y={70} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">HOUSE WALL</text>

      {/* Patio/deck area */}
      <rect x={50} y={80} width={500} height={350} fill="#e8e4dc" stroke="#06004A" strokeWidth={2} strokeDasharray="8 4" />
      <text x={300} y={130} textAnchor="middle" fontSize={11} fill="#aaa" fontWeight="bold">PATIO / DECK</text>

      {/* Patio door — house wall */}
      <rect x={220} y={50} width={120} height={30} fill="#a8c0d8" stroke="#06004A" strokeWidth={1.5} />
      <text x={280} y={70} textAnchor="middle" fontSize={8} fill="#030424">PATIO DOOR</text>

      {/* BBQ area */}
      <rect x={380} y={200} width={120} height={80} fill="#d0c8b8" stroke="#06004A" strokeWidth={1.5} />
      <text x={440} y={245} textAnchor="middle" fontSize={9} fill="#555" fontWeight="bold">BBQ / OUTDOOR KITCHEN</text>

      {/* Seating area */}
      <ellipse cx={200} cy={280} rx={100} ry={70} fill="#d8d0c8" stroke="#06004A" strokeWidth={1} strokeDasharray="4 3" />
      <text x={200} y={285} textAnchor="middle" fontSize={9} fill="#555">SEATING</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* Soffit recessed — along house wall */}
      <RecessedLight cx={120} cy={82} r={8} color="#CDF765" label="SOFFIT" />
      <RecessedLight cx={200} cy={82} r={8} color="#CDF765" label="SOFFIT" />
      <RecessedLight cx={360} cy={82} r={8} color="#CDF765" label="SOFFIT" />
      <RecessedLight cx={440} cy={82} r={8} color="#CDF765" label="SOFFIT" />

      {/* Entry wall sconces — beside patio door */}
      <WallSconce x={220} y={65} side="bottom" color="#F5A623" label="SCONCE" />
      <WallSconce x={340} y={65} side="bottom" color="#F5A623" label="SCONCE" />

      {/* String lights — overhead patio */}
      <line x1={50} y1={110} x2={550} y2={110} stroke="#F5A623" strokeWidth={1} strokeDasharray="3 6" />
      <line x1={50} y1={150} x2={550} y2={150} stroke="#F5A623" strokeWidth={1} strokeDasharray="3 6" />
      <text x={300} y={145} textAnchor="middle" fontSize={8} fill="#F5A623" fontWeight="bold">STRING LIGHTS (GFCI circuit)</text>

      {/* Landscape uplights */}
      <AccentSpot cx={100} cy={380} angle={180} color="#1705E5" label="UPLIGHT" />
      <AccentSpot cx={500} cy={380} angle={180} color="#1705E5" label="UPLIGHT" />
      <AccentSpot cx={300} cy={410} angle={180} color="#1705E5" label="UPLIGHT" />

      {/* BBQ task light */}
      <StripLight x={380} y={198} width={120} height={5} color="#CDF765" label="BBQ TASK LIGHT" labelSide="above" />

      {/* ── SWITCHES ── */}
      {/* Interior switch for exterior lights — on house wall inside */}
      <rect x={215} y={50} width={50} height={14} rx={2} fill="#06004A" />
      <text x={240} y={60} textAnchor="middle" fontSize={6} fill="#CDF765" fontWeight="bold">INT. SW (inside)</text>

      {/* Motion sensor / photocell note */}
      <rect x={150} y={170} width={160} height={28} rx={3} fill="#06004A" opacity={0.85} />
      <text x={230} y={183} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#CDF765">IECC: Auto shutoff req'd</text>
      <text x={230} y={193} textAnchor="middle" fontSize={6} fill="#F5F5F1">Motion sensor or photocell</text>

      {/* Legend */}
      <rect x={50} y={445} width={500} height={30} fill="#06004A" rx={4} />
      <circle cx={70} cy={460} r={6} fill="#CDF765" stroke="#06004A" strokeWidth={1} />
      <text x={80} y={464} fontSize={8} fill="#F5F5F1">Soffit recessed (damp)</text>
      <polygon points="185,453 178,465 192,465" fill="#F5A623" />
      <text x={197} y={464} fontSize={8} fill="#F5F5F1">Sconce (wet)</text>
      <polygon points="270,453 263,465 277,465" fill="#1705E5" />
      <text x={282} y={464} fontSize={8} fill="#F5F5F1">Landscape uplight</text>
      <rect x={370} y={453} width={30} height={5} rx={1} fill="#F5A623" />
      <text x={405} y={464} fontSize={8} fill="#F5F5F1">String lights (GFCI)</text>
    </svg>
  );
}

/** LAUNDRY illumination diagram */
function LaundryIllumDiagram() {
  return (
    <svg viewBox="0 0 400 440" className="w-full h-auto">
      {/* Illumination zones */}
      <IllumZone cx={200} cy={220} r={130} color="#CDF765" opacity={0.10} id="lau-amb" />
      <IllumZone cx={200} cy={100} r={70} color="#CDF765" opacity={0.15} id="lau-counter" />

      {/* Room walls */}
      <rect x={40} y={40} width={320} height={340} fill="#F5F5F1" stroke="#06004A" strokeWidth={3} />

      {/* Door — south wall */}
      <line x1={40} y1={380} x2={110} y2={380} stroke="#06004A" strokeWidth={3} />
      <line x1={170} y1={380} x2={360} y2={380} stroke="#06004A" strokeWidth={3} />
      <path d="M110,380 A60,60 0 0,1 170,320" fill="none" stroke="#aaa" strokeWidth={1} strokeDasharray="4 3" />

      {/* Washer + Dryer — north wall */}
      <rect x={40} y={40} width={130} height={100} fill="#c8d8e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={105} y={95} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">WASHER</text>
      <rect x={170} y={40} width={130} height={100} fill="#c8d8e8" stroke="#06004A" strokeWidth={1.5} />
      <text x={235} y={95} textAnchor="middle" fontSize={9} fill="#06004A" fontWeight="bold">DRYER</text>

      {/* Folding counter — east wall */}
      <rect x={300} y={40} width={60} height={200} fill="#d8d0c0" stroke="#06004A" strokeWidth={1.5} />
      <text x={330} y={145} textAnchor="middle" fontSize={8} fill="#555" fontWeight="bold" transform="rotate(-90,330,145)">FOLD COUNTER</text>

      {/* ── LIGHTING FIXTURES ── */}
      {/* LED flush-mount — ceiling center */}
      <CeilingFixture cx={200} cy={240} r={14} color="#CDF765" label="LED FLUSH" sublabel="Occ. sensor" />

      {/* Under-shelf strip — above washer/dryer */}
      <StripLight x={40} y={138} width={260} height={5} color="#CDF765" label="UNDER-SHELF STRIP" labelSide="below" />

      {/* Task strip — runs LEFT-TO-RIGHT across folding counter width (60px), above counter surface */}
      <StripLight x={300} y={38} width={60} height={5} color="#CDF765" label="COUNTER STRIP" labelSide="right" />

      {/* ── SWITCHES ── */}
      {/* Occupancy sensor — wall near entry */}
      <Switch x={40} y={340} type="SO" side="left" />
      <text x={65} y={338} fontSize={7} fill="#030424" fontWeight="bold">OCC</text>
      <text x={65} y={347} fontSize={6} fill="#555">IECC req'd</text>

      {/* Legend */}
      <rect x={40} y={395} width={320} height={35} fill="#06004A" rx={4} />
      <circle cx={60} cy={412} r={7} fill="none" stroke="#CDF765" strokeWidth={2} />
      <line x1={55} y1={407} x2={65} y2={417} stroke="#CDF765" strokeWidth={1.5} />
      <line x1={65} y1={407} x2={55} y2={417} stroke="#CDF765" strokeWidth={1.5} />
      <text x={72} y={416} fontSize={8} fill="#F5F5F1">LED flush (occ. sensor)</text>
      <rect x={185} y={406} width={30} height={5} rx={1} fill="#CDF765" />
      <text x={220} y={416} fontSize={8} fill="#F5F5F1">Under-shelf strip</text>
      <rect x={295} y={406} width={14} height={8} rx={1} fill="#CDF765" stroke="#030424" strokeWidth={1} />
      <text x={313} y={416} fontSize={8} fill="#F5F5F1">Occ. SW</text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ILLUM_ROOMS = [
  { id: 'bedroom',    label: '🛏 Bedroom',       icon: '🛏' },
  { id: 'kitchen',   label: '🍳 Kitchen',        icon: '🍳' },
  { id: 'bathroom',  label: '🚿 Bathroom',       icon: '🚿' },
  { id: 'living',    label: '🛋 Living Room',    icon: '🛋' },
  { id: 'dining',    label: '🍽 Dining Room',    icon: '🍽' },
  { id: 'office',    label: '💼 Home Office',    icon: '💼' },
  { id: 'garage',    label: '🚗 Garage',         icon: '🚗' },
  { id: 'laundry',   label: '🧺 Laundry',        icon: '🧺' },
  { id: 'outdoor',   label: '🌿 Outdoor/Patio',  icon: '🌿' },
];

const ILLUM_NOTES: Record<string, string[]> = {
  bedroom: [
    'Main ceiling fixture on DIMMER — center of room, controlled from entry',
    'Nightstand SCONCES on NORTH wall directly behind each nightstand — NOT on side walls',
    'Dresser SCONCE on SOUTH wall above dresser mirror — furniture-driven task lighting',
    'Closet LED surface-mount inside closet — switch at closet entry on east wall (NEC 410.16)',
    'Desk task strip runs LEFT-TO-RIGHT across full desk width (not front-to-back)',
    '3-WAY switch if room has two entry doors (NEC 210.70(A)(1))',
  ],
  kitchen: [
    'Recessed downlights on DIMMER — grid pattern across ceiling',
    'Under-cabinet strip lights on NORTH and EAST counter walls — separate switch',
    'Pendant lights over island on DIMMER — 30–36 in. above counter surface',
    'Range hood light — integral to hood, separate circuit',
    'All switches on west wall near entry; separate circuits for ambient vs. task',
  ],
  bathroom: [
    'Vanity bar light on NORTH wall above mirror — NOT inside shower zone',
    'Recessed ceiling fixture (DAMP rated) — center of room',
    'Shower/tub recessed (WET rated) — inside wet zone only',
    'Exhaust fan/light combo near toilet — separate switch from vanity',
    'NO switches inside shower/tub zone (NEC 410.10(D))',
  ],
  living: [
    'Recessed downlights on DIMMER — grid pattern, controlled from each entry (3-way)',
    'Accent spotlights above fireplace mantel — separate switch',
    'Wall sconce for reading near sofa — west wall',
    'Cove/valance strip lights near ceiling on north wall — separate switch',
    '3-WAY switches at each room entry (NEC 210.70(A)(1))',
  ],
  dining: [
    'Chandelier centered over table on DIMMER — mandatory per IECC',
    'Chandelier at minimum 7 ft AFF; 30–36 in. above table surface',
    'Recessed perimeter downlights — separate circuit from chandelier',
    'Buffet strip light on west wall above buffet surface',
    'Dimmer switch at entry; separate switch for recessed',
  ],
  office: [
    'Recessed downlights on OCCUPANCY SENSOR — IECC requirement',
    'Task strip on east wall above desk — separate switch',
    'Bookshelf accent strip on north wall — separate switch',
    '3500K–4000K neutral white for focus and alertness',
    'Occupancy/vacancy sensor preferred over standard switch (IECC)',
  ],
  garage: [
    'LED shop lights on ceiling — one per vehicle bay',
    'Garage door opener with integral light — auto-activates on door operation',
    'Workbench task strip on east wall above bench',
    'Exterior entry sconce above pedestrian door (NEC 210.70(A)(2)(b))',
    '3-WAY switches — one at pedestrian door, one near garage door (NEC 210.70)',
    'IECC: Occupancy sensor or auto-shutoff required',
  ],
  laundry: [
    'LED flush-mount on OCCUPANCY SENSOR — IECC requirement',
    'Under-shelf strip above washer/dryer — separate switch',
    'Folding counter task strip on east wall',
    'Lighting circuit SEPARATE from 20A laundry receptacle circuit (NEC 210.52(F))',
    '3500K–4000K neutral white for stain detection and color sorting',
  ],
  outdoor: [
    'Soffit recessed (DAMP rated) along house wall — photocell/motion sensor',
    'Wall sconces beside patio door — WET rated; interior switch required',
    'String lights on GFCI-protected circuit with timer (IECC)',
    'Landscape uplights on low-voltage transformer — separate circuit',
    'BBQ task light above outdoor kitchen counter',
    'IECC: All exterior lighting must have automatic shutoff control',
    'Interior switch for all exterior entry lights (NEC 210.70(A)(2)(b))',
  ],
};

export default function IlluminationDiagram() {
  const [activeRoom, setActiveRoom] = useState('bedroom');

  const renderDiagram = () => {
    switch (activeRoom) {
      case 'bedroom':  return <BedroomIllumDiagram />;
      case 'kitchen':  return <KitchenIllumDiagram />;
      case 'bathroom': return <BathroomIllumDiagram />;
      case 'living':   return <LivingRoomIllumDiagram />;
      case 'dining':   return <DiningRoomIllumDiagram />;
      case 'office':   return <HomeOfficeIllumDiagram />;
      case 'garage':   return <GarageIllumDiagram />;
      case 'laundry':  return <LaundryIllumDiagram />;
      case 'outdoor':  return <OutdoorIllumDiagram />;
      default:         return <BedroomIllumDiagram />;
    }
  };

  const notes = ILLUM_NOTES[activeRoom] || [];

  return (
    <div className="space-y-6">
      {/* Room tabs */}
      <div className="flex flex-wrap gap-2">
        {ILLUM_ROOMS.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveRoom(r.id)}
            className="px-3 py-1.5 text-xs font-bold rounded transition-all duration-150"
            style={{
              backgroundColor: activeRoom === r.id ? '#06004A' : '#F5F5F1',
              color: activeRoom === r.id ? '#CDF765' : '#030424',
              border: activeRoom === r.id ? '2px solid #06004A' : '2px solid #e0e0d8',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Diagram + notes side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG diagram */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border p-4 shadow-sm">
          {renderDiagram()}
        </div>

        {/* Key placement notes */}
        <div className="space-y-4">
          <div className="bg-[#06004A] rounded-lg p-4">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#CDF765', fontFamily: 'var(--font-display)' }}>
              💡 Key Placement Rules
            </h4>
            <ul className="space-y-2">
              {notes.map((note, i) => (
                <li key={i} className="text-xs text-white/90 flex gap-2 items-start leading-snug">
                  <span className="text-[#CDF765] font-bold flex-shrink-0 mt-0.5">→</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Symbol legend */}
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Symbol Legend
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { color: '#F5A623', label: 'Ceiling fixture / Chandelier / Sconce' },
                { color: '#CDF765', label: 'Recessed downlight / Strip light' },
                { color: '#1705E5', label: 'Accent spotlight / Landscape uplight' },
                { color: '#06004A', label: 'Switch (S=single, S3=3-way, SD=dimmer, SO=occ.)' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-foreground">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0 opacity-30" style={{ backgroundColor: '#F5A623', boxShadow: '0 0 6px 4px rgba(245,166,35,0.3)' }} />
                <span className="text-foreground">Illumination zone (radial glow)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
