// RoomDiagram.tsx
// Design: Spacial Brand — Deep Navy #06004A, Lime Green #CDF765, Off-White #F5F5F1
// SVG-based annotated floor plan diagrams showing correct outlet/switch/fixture placement
// ============================================================

import { useState } from 'react';

type DiagramRoom = 'bedroom' | 'kitchen' | 'bathroom' | 'living' | 'office' | 'garage' | 'laundry' | 'outdoor';

interface DiagramConfig {
  label: string;
  icon: string;
  description: string;
  svgContent: React.ReactNode;
}

// ─── SVG Symbol Components ──────────────────────────────────────────────────

const NAVY = '#06004A';
const LIME = '#CDF765';
const WALL_COLOR = '#1a1a3e';
const OUTLET_COLOR = '#2563EB';
const GFCI_COLOR = '#DC2626';
const SWITCH_COLOR = '#16A34A';
const LIGHT_COLOR = '#D97706';
const DEDICATED_COLOR = '#7C3AED';

function Outlet({ x, y, label, gfci = false, size = 10 }: { x: number; y: number; label?: string; gfci?: boolean; size?: number }) {
  return (
    <g>
      <rect
        x={x - size / 2} y={y - size / 2}
        width={size} height={size}
        rx={1.5}
        fill={gfci ? GFCI_COLOR : OUTLET_COLOR}
        stroke="white" strokeWidth={1}
      />
      <line x1={x - 2} y1={y - 3} x2={x - 2} y2={y + 3} stroke="white" strokeWidth={1.5} />
      <line x1={x + 2} y1={y - 3} x2={x + 2} y2={y + 3} stroke="white" strokeWidth={1.5} />
      {label && (
        <text x={x} y={y + size + 8} textAnchor="middle" fontSize={6} fill={gfci ? GFCI_COLOR : OUTLET_COLOR} fontWeight="bold">
          {label}
        </text>
      )}
    </g>
  );
}

function Switch({ x, y, label, threeWay = false }: { x: number; y: number; label?: string; threeWay?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={SWITCH_COLOR} stroke="white" strokeWidth={1} />
      <text x={x} y={y + 1.5} textAnchor="middle" fontSize={6} fill="white" fontWeight="bold">
        {threeWay ? '3W' : 'S'}
      </text>
      {label && (
        <text x={x} y={y + 16} textAnchor="middle" fontSize={6} fill={SWITCH_COLOR} fontWeight="bold">
          {label}
        </text>
      )}
    </g>
  );
}

function LightFixture({ x, y, label, ceiling = true }: { x: number; y: number; label?: string; ceiling?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="none" stroke={LIGHT_COLOR} strokeWidth={1.5} strokeDasharray={ceiling ? 'none' : '3 2'} />
      <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke={LIGHT_COLOR} strokeWidth={1.5} />
      <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={LIGHT_COLOR} strokeWidth={1.5} />
      {label && (
        <text x={x} y={y + 18} textAnchor="middle" fontSize={6} fill={LIGHT_COLOR} fontWeight="bold">
          {label}
        </text>
      )}
    </g>
  );
}

function DedicatedOutlet({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect
        x={x - 7} y={y - 7}
        width={14} height={14}
        rx={2}
        fill={DEDICATED_COLOR}
        stroke="white" strokeWidth={1}
      />
      <text x={x} y={y + 2} textAnchor="middle" fontSize={6} fill="white" fontWeight="bold">D</text>
      {label && (
        <text x={x} y={y + 18} textAnchor="middle" fontSize={6} fill={DEDICATED_COLOR} fontWeight="bold">
          {label}
        </text>
      )}
    </g>
  );
}

function Annotation({ x, y, text, direction = 'right' }: { x: number; y: number; text: string; direction?: 'right' | 'left' | 'up' | 'down' }) {
  const offsets = {
    right: { lx: x + 4, ly: y, tx: x + 8, ty: y + 2 },
    left: { lx: x - 4, ly: y, tx: x - 8, ty: y + 2 },
    up: { lx: x, ly: y - 4, tx: x, ty: y - 8 },
    down: { lx: x, ly: y + 4, tx: x, ty: y + 8 },
  };
  const o = offsets[direction];
  return (
    <g>
      <line x1={x} y1={y} x2={o.lx} y2={o.ly} stroke={NAVY} strokeWidth={0.5} strokeDasharray="2 1" />
    </g>
  );
}

function DimLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={7} fill="#888" fontStyle="italic">{text}</text>
  );
}

// ─── Room Diagrams ──────────────────────────────────────────────────────────

function BedroomDiagram() {
  return (
    <svg viewBox="0 0 320 260" className="w-full h-auto" style={{ maxHeight: 300 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={280} height={220} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Door opening (bottom-left) */}
      <rect x={20} y={185} width={6} height={55} fill="#F8F8F6" />
      <path d="M 26 185 Q 56 185 56 215" fill="none" stroke={WALL_COLOR} strokeWidth={1} strokeDasharray="3 2" />

      {/* Closet (top-right) */}
      <rect x={200} y={20} width={100} height={60} fill="#EDEDEA" stroke={WALL_COLOR} strokeWidth={2} />
      <text x={250} y={55} textAnchor="middle" fontSize={8} fill="#888">CLOSET</text>

      {/* Bed (centered on longest wall — left wall) */}
      <rect x={35} y={90} width={70} height={110} rx={4} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <rect x={35} y={90} width={70} height={20} rx={2} fill="#9CA3AF" />
      <text x={70} y={152} textAnchor="middle" fontSize={8} fill="#6B7280">BED</text>

      {/* Desk (bottom-right) */}
      <rect x={200} y={185} width={100} height={40} rx={2} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1} />
      <text x={250} y={210} textAnchor="middle" fontSize={8} fill="#6B7280">DESK</text>

      {/* Outlets — nightstand positions (both sides of bed) */}
      <Outlet x={35} y={110} label="NSD" />
      <Outlet x={105} y={110} label="NSD" />

      {/* Outlet — desk wall */}
      <Outlet x={220} y={180} label="DESK" />
      <Outlet x={260} y={180} />
      <Outlet x={295} y={180} />

      {/* Outlet — opposite wall (right) */}
      <Outlet x={295} y={100} />
      <Outlet x={295} y={140} />

      {/* Outlet — top wall */}
      <Outlet x={120} y={25} />
      <Outlet x={170} y={25} />

      {/* Switch — at door */}
      <Switch x={35} y={185} label="SW" />

      {/* Ceiling light */}
      <LightFixture x={145} y={130} label="CEIL." />

      {/* Closet light */}
      <LightFixture x={250} y={50} ceiling={false} label="CLOS." />

      {/* Dimension labels */}
      <DimLabel x={160} y={250} text="~14 ft" />
      <DimLabel x={8} y={130} text="~12 ft" />

      {/* NEC note */}
      <text x={160} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        NEC 210.52(A) — No point {'>'} 6 ft from outlet
      </text>
    </svg>
  );
}

function KitchenDiagram() {
  return (
    <svg viewBox="0 0 320 280" className="w-full h-auto" style={{ maxHeight: 300 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={280} height={240} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Door opening */}
      <rect x={20} y={200} width={6} height={60} fill="#F8F8F6" />
      <path d="M 26 200 Q 56 200 56 230" fill="none" stroke={WALL_COLOR} strokeWidth={1} strokeDasharray="3 2" />

      {/* Counters — L-shape */}
      {/* Top counter */}
      <rect x={26} y={26} width={274} height={40} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={160} y={50} textAnchor="middle" fontSize={8} fill="#6B7280">COUNTER / CABINETS</text>
      {/* Left counter */}
      <rect x={26} y={26} width={40} height={200} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />

      {/* Sink */}
      <rect x={130} y={30} width={50} height={32} rx={3} fill="#93C5FD" stroke="#3B82F6" strokeWidth={1.5} />
      <text x={155} y={50} textAnchor="middle" fontSize={7} fill="#1D4ED8">SINK</text>

      {/* Range */}
      <rect x={220} y={30} width={60} height={36} rx={2} fill="#6B7280" stroke="#374151" strokeWidth={1.5} />
      <text x={250} y={52} textAnchor="middle" fontSize={7} fill="white">RANGE</text>

      {/* Island */}
      <rect x={100} y={140} width={150} height={60} rx={4} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={175} y={175} textAnchor="middle" fontSize={8} fill="#6B7280">ISLAND</text>

      {/* Refrigerator */}
      <rect x={26} y={26} width={40} height={50} rx={2} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1.5} />
      <text x={46} y={55} textAnchor="middle" fontSize={7} fill="white">REF</text>

      {/* GFCI Outlets — countertop (every 4 ft) */}
      <Outlet x={90} y={70} gfci label="4ft" />
      <Outlet x={120} y={70} gfci />
      <Outlet x={165} y={70} gfci label="4ft" />
      <Outlet x={200} y={70} gfci />
      <Outlet x={235} y={70} gfci label="4ft" />
      <Outlet x={280} y={70} gfci />

      {/* Left counter outlets */}
      <Outlet x={70} y={100} gfci label="GFCI" />
      <Outlet x={70} y={140} gfci />

      {/* Island outlets */}
      <Outlet x={130} y={140} gfci label="ISL" />
      <Outlet x={175} y={140} gfci />
      <Outlet x={220} y={140} gfci />

      {/* Dedicated circuits */}
      <DedicatedOutlet x={46} y={85} label="FRIDGE" />
      <DedicatedOutlet x={250} y={72} label="RANGE" />

      {/* Switch */}
      <Switch x={35} y={200} label="SW" />

      {/* Ceiling light */}
      <LightFixture x={175} y={110} label="CEIL." />

      {/* Under-cabinet (dashed line) */}
      <line x1={80} y1={68} x2={290} y2={68} stroke={LIGHT_COLOR} strokeWidth={1} strokeDasharray="4 2" />
      <text x={185} y={65} textAnchor="middle" fontSize={6} fill={LIGHT_COLOR}>UNDER-CABINET LIGHTING</text>

      {/* NEC note */}
      <text x={160} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        NEC 210.52(C) — Outlet every 4 ft on countertops · GFCI required
      </text>
    </svg>
  );
}

function BathroomDiagram() {
  return (
    <svg viewBox="0 0 240 220" className="w-full h-auto" style={{ maxHeight: 260 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={200} height={180} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Door */}
      <rect x={20} y={155} width={6} height={45} fill="#F8F8F6" />
      <path d="M 26 155 Q 56 155 56 185" fill="none" stroke={WALL_COLOR} strokeWidth={1} strokeDasharray="3 2" />

      {/* Vanity / sink */}
      <rect x={26} y={26} width={80} height={40} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <ellipse cx={66} cy={46} rx={18} ry={12} fill="#93C5FD" stroke="#3B82F6" strokeWidth={1.5} />
      <text x={66} y={50} textAnchor="middle" fontSize={7} fill="#1D4ED8">SINK</text>

      {/* Toilet */}
      <rect x={145} y={26} width={50} height={60} rx={4} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1.5} />
      <ellipse cx={170} cy={65} rx={18} ry={12} fill="white" stroke="#9CA3AF" strokeWidth={1} />
      <text x={170} y={50} textAnchor="middle" fontSize={7} fill="#6B7280">TOILET</text>

      {/* Tub/shower */}
      <rect x={26} y={90} width={140} height={100} rx={4} fill="#BFDBFE" stroke="#3B82F6" strokeWidth={1.5} />
      <text x={96} y={145} textAnchor="middle" fontSize={9} fill="#1D4ED8">TUB / SHOWER</text>

      {/* GFCI outlet — within 3 ft of sink */}
      <Outlet x={115} y={45} gfci label="≤3ft" />

      {/* Switch */}
      <Switch x={35} y={155} label="SW" />

      {/* Exhaust fan */}
      <LightFixture x={170} y={100} ceiling={false} label="FAN" />

      {/* Ceiling light */}
      <LightFixture x={66} y={100} label="CEIL." />

      {/* Shower light (wet rated) */}
      <LightFixture x={96} y={145} ceiling={false} label="WET" />

      {/* NEC note */}
      <text x={120} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        NEC 210.52(D) — GFCI within 3 ft of sink · Dedicated 20A circuit
      </text>
    </svg>
  );
}

function LivingRoomDiagram() {
  return (
    <svg viewBox="0 0 340 280" className="w-full h-auto" style={{ maxHeight: 300 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={300} height={240} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Door */}
      <rect x={20} y={195} width={6} height={65} fill="#F8F8F6" />
      <path d="M 26 195 Q 56 195 56 225" fill="none" stroke={WALL_COLOR} strokeWidth={1} strokeDasharray="3 2" />

      {/* TV wall (right) */}
      <rect x={270} y={60} width={50} height={80} rx={2} fill="#374151" stroke="#111827" strokeWidth={1.5} />
      <text x={295} y={105} textAnchor="middle" fontSize={8} fill="white">TV</text>

      {/* Sofa */}
      <rect x={60} y={130} width={160} height={50} rx={4} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={140} y={160} textAnchor="middle" fontSize={8} fill="#6B7280">SOFA</text>

      {/* Coffee table */}
      <rect x={100} y={190} width={80} height={40} rx={2} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1} />

      {/* Outlets — TV wall (standard + mounting height) */}
      <Outlet x={265} y={80} label="TV HT" />
      <Outlet x={265} y={120} label="STD" />

      {/* Outlets — left wall */}
      <Outlet x={25} y={80} />
      <Outlet x={25} y={140} />
      <Outlet x={25} y={200} />

      {/* Outlets — top wall */}
      <Outlet x={100} y={25} />
      <Outlet x={170} y={25} />
      <Outlet x={230} y={25} />

      {/* Outlets — bottom wall */}
      <Outlet x={100} y={255} />
      <Outlet x={170} y={255} />
      <Outlet x={230} y={255} />

      {/* Floor outlet (floating furniture) */}
      <g>
        <circle cx={170} cy={170} r={7} fill="#2563EB" stroke="white" strokeWidth={1} />
        <text x={170} y={172} textAnchor="middle" fontSize={5.5} fill="white" fontWeight="bold">FLR</text>
        <text x={170} y={183} textAnchor="middle" fontSize={6} fill={OUTLET_COLOR}>FLOOR</text>
      </g>

      {/* Switch */}
      <Switch x={35} y={195} label="SW" />

      {/* Ceiling light */}
      <LightFixture x={150} y={90} label="CEIL." />

      {/* NEC note */}
      <text x={170} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        NEC 210.52(A) — No point {'>'} 6 ft from outlet · AFCI required
      </text>
    </svg>
  );
}

function HomeOfficeDiagram() {
  return (
    <svg viewBox="0 0 300 260" className="w-full h-auto" style={{ maxHeight: 280 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={260} height={220} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Door */}
      <rect x={20} y={185} width={6} height={55} fill="#F8F8F6" />
      <path d="M 26 185 Q 56 185 56 215" fill="none" stroke={WALL_COLOR} strokeWidth={1} strokeDasharray="3 2" />

      {/* Desk — right wall */}
      <rect x={180} y={26} width={100} height={50} rx={2} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={230} y={55} textAnchor="middle" fontSize={8} fill="#6B7280">DESK</text>

      {/* Monitor */}
      <rect x={200} y={30} width={40} height={25} rx={1} fill="#374151" stroke="#111827" strokeWidth={1} />

      {/* Bookshelf */}
      <rect x={26} y={26} width={30} height={120} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1} />
      <text x={41} y={90} textAnchor="middle" fontSize={7} fill="#6B7280" transform="rotate(-90,41,90)">SHELF</text>

      {/* Chair */}
      <rect x={190} y={90} width={40} height={40} rx={20} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1} />

      {/* Dense outlets on desk wall — cluster */}
      <Outlet x={185} y={80} label="DESK" />
      <Outlet x={210} y={80} />
      <Outlet x={235} y={80} />
      <Outlet x={260} y={80} />
      <Outlet x={275} y={80} />

      {/* Outlets — left wall */}
      <Outlet x={25} y={160} />
      <Outlet x={25} y={200} />

      {/* Outlets — bottom wall */}
      <Outlet x={100} y={235} />
      <Outlet x={160} y={235} />
      <Outlet x={220} y={235} />

      {/* Outlets — top wall */}
      <Outlet x={110} y={25} />
      <Outlet x={160} y={25} />

      {/* Switch */}
      <Switch x={35} y={185} label="SW" />

      {/* Ceiling light */}
      <LightFixture x={120} y={130} label="CEIL." />

      {/* NEC note */}
      <text x={150} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        Cluster outlets on desk wall · AFCI required · 20A recommended
      </text>
    </svg>
  );
}

function GarageDiagram() {
  return (
    <svg viewBox="0 0 360 260" className="w-full h-auto" style={{ maxHeight: 280 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={320} height={220} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Garage door opening (bottom) */}
      <rect x={80} y={234} width={200} height={6} fill="#F8F8F6" />
      <text x={180} y={252} textAnchor="middle" fontSize={8} fill="#6B7280">GARAGE DOOR</text>

      {/* Car bay 1 */}
      <rect x={30} y={80} width={130} height={130} rx={4} fill="#E5E7EB" stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4 2" />
      <text x={95} y={150} textAnchor="middle" fontSize={9} fill="#9CA3AF">CAR 1</text>

      {/* Car bay 2 */}
      <rect x={180} y={80} width={150} height={130} rx={4} fill="#E5E7EB" stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4 2" />
      <text x={255} y={150} textAnchor="middle" fontSize={9} fill="#9CA3AF">CAR 2</text>

      {/* Workbench */}
      <rect x={26} y={26} width={200} height={40} rx={2} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1.5} />
      <text x={126} y={50} textAnchor="middle" fontSize={8} fill="#6B7280">WORKBENCH</text>

      {/* GFCI Outlets — side walls */}
      <Outlet x={25} y={80} gfci label="GFCI" />
      <Outlet x={25} y={130} gfci />
      <Outlet x={25} y={180} gfci />

      <Outlet x={335} y={80} gfci label="GFCI" />
      <Outlet x={335} y={130} gfci />
      <Outlet x={335} y={180} gfci />

      {/* Workbench outlets */}
      <Outlet x={80} y={68} gfci label="BENCH" />
      <Outlet x={130} y={68} gfci />
      <Outlet x={180} y={68} gfci />

      {/* Dedicated — EV charger */}
      <DedicatedOutlet x={300} y={26} label="EV 240V" />

      {/* Garage door opener (ceiling) */}
      <g>
        <circle cx={180} cy={50} r={7} fill={DEDICATED_COLOR} stroke="white" strokeWidth={1} />
        <text x={180} y={52} textAnchor="middle" fontSize={5.5} fill="white" fontWeight="bold">GDO</text>
        <text x={180} y={64} textAnchor="middle" fontSize={6} fill={DEDICATED_COLOR}>OPENER</text>
      </g>

      {/* Switch */}
      <Switch x={35} y={60} label="SW" />

      {/* Ceiling lights */}
      <LightFixture x={95} y={50} label="CEIL." />
      <LightFixture x={255} y={50} label="CEIL." />

      {/* NEC note */}
      <text x={180} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        NEC 210.52(G) — GFCI required · 1 outlet per bay minimum
      </text>
    </svg>
  );
}

function LaundryDiagram() {
  return (
    <svg viewBox="0 0 260 240" className="w-full h-auto" style={{ maxHeight: 260 }}>
      {/* Room walls */}
      <rect x={20} y={20} width={220} height={200} fill="#F8F8F6" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      {/* Door */}
      <rect x={20} y={175} width={6} height={45} fill="#F8F8F6" />
      <path d="M 26 175 Q 56 175 56 205" fill="none" stroke={WALL_COLOR} strokeWidth={1} strokeDasharray="3 2" />

      {/* Washer */}
      <rect x={35} y={80} width={70} height={80} rx={4} fill="#DBEAFE" stroke="#3B82F6" strokeWidth={1.5} />
      <circle cx={70} cy={120} r={22} fill="none" stroke="#3B82F6" strokeWidth={2} />
      <text x={70} y={124} textAnchor="middle" fontSize={8} fill="#1D4ED8">WASH</text>

      {/* Dryer */}
      <rect x={120} y={80} width={70} height={80} rx={4} fill="#FEE2E2" stroke="#EF4444" strokeWidth={1.5} />
      <circle cx={155} cy={120} r={22} fill="none" stroke="#EF4444" strokeWidth={2} />
      <text x={155} y={124} textAnchor="middle" fontSize={8} fill="#DC2626">DRYER</text>

      {/* Utility sink */}
      <rect x={155} y={26} width={70} height={40} rx={3} fill="#93C5FD" stroke="#3B82F6" strokeWidth={1.5} />
      <text x={190} y={50} textAnchor="middle" fontSize={7} fill="#1D4ED8">SINK</text>

      {/* Shelf above */}
      <rect x={26} y={60} width={170} height={12} rx={1} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1} />
      <text x={111} y={70} textAnchor="middle" fontSize={7} fill="#6B7280">SHELF</text>

      {/* GFCI outlet — washer */}
      <Outlet x={70} y={170} gfci label="WASH" />

      {/* Dedicated — dryer (240V) */}
      <DedicatedOutlet x={155} y={170} label="DRYER 240V" />

      {/* GFCI outlet — sink area */}
      <Outlet x={190} y={70} gfci label="GFCI" />

      {/* Switch */}
      <Switch x={35} y={175} label="SW" />

      {/* Ceiling light */}
      <LightFixture x={110} y={45} label="CEIL." />

      {/* NEC note */}
      <text x={130} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        GFCI required · 30A/240V for dryer · 20A/120V for washer
      </text>
    </svg>
  );
}

function OutdoorDiagram() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-auto" style={{ maxHeight: 260 }}>
      {/* House wall */}
      <rect x={20} y={20} width={280} height={50} fill="#D1D5DB" stroke={WALL_COLOR} strokeWidth={6} rx={2} />
      <text x={160} y={50} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">HOUSE EXTERIOR WALL</text>

      {/* Patio area */}
      <rect x={20} y={70} width={280} height={150} fill="#F0EDE8" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 3" rx={2} />
      <text x={160} y={95} textAnchor="middle" fontSize={10} fill="#9CA3AF">PATIO / DECK</text>

      {/* Patio furniture */}
      <rect x={100} y={110} width={120} height={60} rx={4} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1} />
      <text x={160} y={145} textAnchor="middle" fontSize={8} fill="#6B7280">TABLE &amp; CHAIRS</text>

      {/* GFCI outlets — exterior wall */}
      <Outlet x={70} y={68} gfci label="GFCI" />
      <Outlet x={160} y={68} gfci label="GFCI" />
      <Outlet x={250} y={68} gfci label="GFCI" />

      {/* GFCI outlet — patio post */}
      <Outlet x={50} y={180} gfci label="POST" />
      <Outlet x={270} y={180} gfci label="POST" />

      {/* Outdoor light — wall mounted */}
      <LightFixture x={100} y={68} ceiling={false} label="WALL" />
      <LightFixture x={220} y={68} ceiling={false} label="WALL" />

      {/* Overhead string lights */}
      <line x1={40} y1={90} x2={280} y2={90} stroke={LIGHT_COLOR} strokeWidth={1} strokeDasharray="8 3" />
      <text x={160} y={105} textAnchor="middle" fontSize={6} fill={LIGHT_COLOR}>STRING / OVERHEAD LIGHTS</text>

      {/* Switch — interior side */}
      <Switch x={35} y={40} label="SW" />

      {/* WP label */}
      <text x={70} y={82} textAnchor="middle" fontSize={6} fill={GFCI_COLOR} fontWeight="bold">WP</text>
      <text x={160} y={82} textAnchor="middle" fontSize={6} fill={GFCI_COLOR} fontWeight="bold">WP</text>
      <text x={250} y={82} textAnchor="middle" fontSize={6} fill={GFCI_COLOR} fontWeight="bold">WP</text>

      {/* NEC note */}
      <text x={160} y={16} textAnchor="middle" fontSize={6.5} fill={NAVY} fontWeight="bold">
        NEC 210.52(E) — GFCI + WP covers required · Front &amp; rear of dwelling
      </text>
    </svg>
  );
}

// ─── Diagram Registry ────────────────────────────────────────────────────────

const DIAGRAMS: Record<DiagramRoom, DiagramConfig> = {
  bedroom: {
    label: 'Bedroom',
    icon: '🛏️',
    description: 'Outlets at nightstand positions on both sides of bed, desk cluster, AFCI on all circuits',
    svgContent: <BedroomDiagram />,
  },
  kitchen: {
    label: 'Kitchen',
    icon: '🍳',
    description: 'GFCI outlets every 4 ft on countertops, dedicated circuits for major appliances',
    svgContent: <KitchenDiagram />,
  },
  bathroom: {
    label: 'Bathroom',
    icon: '🚿',
    description: 'GFCI outlet within 3 ft of sink, dedicated 20A circuit, wet-rated fixtures',
    svgContent: <BathroomDiagram />,
  },
  living: {
    label: 'Living Room',
    icon: '🛋️',
    description: 'Outlets at TV wall (standard + mounting height), floor outlet for floating furniture',
    svgContent: <LivingRoomDiagram />,
  },
  office: {
    label: 'Home Office',
    icon: '💼',
    description: 'Dense outlet cluster on desk wall, AFCI protection, 20A circuit recommended',
    svgContent: <HomeOfficeDiagram />,
  },
  garage: {
    label: 'Garage',
    icon: '🚗',
    description: 'GFCI outlets on all walls, one per bay, dedicated 240V for EV charger',
    svgContent: <GarageDiagram />,
  },
  laundry: {
    label: 'Laundry',
    icon: '🧺',
    description: 'GFCI for washer, dedicated 240V/30A for dryer, utility sink GFCI',
    svgContent: <LaundryDiagram />,
  },
  outdoor: {
    label: 'Outdoor / Patio',
    icon: '🌿',
    description: 'GFCI+WP outlets on exterior wall, front and rear of dwelling required',
    svgContent: <OutdoorDiagram />,
  },
};

const DIAGRAM_ORDER: DiagramRoom[] = ['bedroom', 'kitchen', 'bathroom', 'living', 'office', 'garage', 'laundry', 'outdoor'];

// ─── Legend ──────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { color: OUTLET_COLOR, label: 'Standard Outlet' },
    { color: GFCI_COLOR, label: 'GFCI Outlet' },
    { color: DEDICATED_COLOR, label: 'Dedicated Circuit' },
    { color: SWITCH_COLOR, label: 'Switch' },
    { color: LIGHT_COLOR, label: 'Light Fixture' },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function RoomDiagrams() {
  const [selected, setSelected] = useState<DiagramRoom>('bedroom');
  const diagram = DIAGRAMS[selected];

  return (
    <div className="space-y-4">
      {/* Room selector tabs */}
      <div className="flex flex-wrap gap-1.5">
        {DIAGRAM_ORDER.map(room => (
          <button
            key={room}
            onClick={() => setSelected(room)}
            className="text-xs px-3 py-1.5 rounded-sm border font-medium transition-all duration-150"
            style={{
              backgroundColor: selected === room ? NAVY : 'transparent',
              color: selected === room ? 'white' : 'var(--muted-foreground)',
              borderColor: selected === room ? NAVY : 'var(--border)',
            }}
          >
            {DIAGRAMS[room].icon} {DIAGRAMS[room].label}
          </button>
        ))}
      </div>

      {/* Diagram card */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between" style={{ backgroundColor: '#F5F5F1' }}>
          <div>
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: NAVY }}>
              {diagram.icon} {diagram.label} — Outlet Placement Diagram
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">{diagram.description}</p>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono font-bold hidden md:block"
            style={{ backgroundColor: LIME, color: NAVY }}
          >
            NEC 2023
          </span>
        </div>

        {/* SVG diagram */}
        <div className="p-4 bg-white">
          {diagram.svgContent}
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-border" style={{ backgroundColor: '#F5F5F1' }}>
          <Legend />
        </div>
      </div>
    </div>
  );
}
