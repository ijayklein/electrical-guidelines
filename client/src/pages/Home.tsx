// ============================================================
// Home Page — Residential Electrical Wiring Guidelines
// Design: Spacial Brand — Deep Navy #06004A, Lime Green #CDF765, Off-White #F5F5F1
// Layout: Sticky left sidebar (navy) + main content
// ============================================================

import { useState, useEffect, useRef } from 'react';
import CircuitCalculator from '@/components/CircuitCalculator';
import RoomDiagrams from '@/components/RoomDiagram';
import { roomData, floorPlanStrategies, protectionSummary, circuitLoadData, outletHeightGuide } from '@/lib/electricalData';
import type { FloorPlanQuality } from '@/lib/electricalData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663437976481/UuAPpHfhL2bXHjq2u8bGzi/hero-electrical-MnoRv5ys6zsbuBxeFDbqwA.webp';
const SPACIAL_LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663437976481/UuAPpHfhL2bXHjq2u8bGzi/spacial-logo-white_b56050d6.png';
const SPACIAL_LOGO_DARK = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663437976481/UuAPpHfhL2bXHjq2u8bGzi/spacial-logo-dark_9d87632f.png';
const KITCHEN_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663437976481/UuAPpHfhL2bXHjq2u8bGzi/kitchen-electrical-FujLw6UBdZLpLVjjJpsDT9.webp';
const BATHROOM_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663437976481/UuAPpHfhL2bXHjq2u8bGzi/bathroom-electrical-2GEdPP6px7cuiyG4Q38VCr.webp';
// Unsplash room images for all remaining room types
const ROOM_IMAGES: Record<string, string> = {
  kitchen: KITCHEN_IMG,
  bathroom: BATHROOM_IMG,
  bedroom: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'living-room': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'dining-room': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
  'home-office': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
  laundry: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80',
  garage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  outdoor: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  hvac: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
};

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'floor-plan', label: 'Floor Plan Strategy' },
  { id: 'general', label: 'General Requirements' },
  { id: 'rooms', label: 'Room-by-Room Guide' },
  { id: 'protection', label: 'GFCI & AFCI' },
  { id: 'circuits', label: 'Circuit Planning' },
  { id: 'heights', label: 'Heights Reference' },
  { id: 'diagrams', label: 'Room Diagrams' },
  { id: 'calculator', label: 'Circuit Calculator' },
];

function CodeBadge({ code }: { code: string }) {
  return (
    <span className="code-badge">{code}</span>
  );
}

function WarningBadge({ text }: { text: string }) {
  return (
    <span className="warning-badge">⚠ {text}</span>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <span className="section-number select-none hidden md:block">{number}</span>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
        {subtitle && <p className="text-muted-foreground mt-1 text-base">{subtitle}</p>}
      </div>
    </div>
  );
}

function FloorPlanQualitySelector({ selected, onChange }: { selected: FloorPlanQuality; onChange: (q: FloorPlanQuality) => void }) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {floorPlanStrategies.map(s => (
        <button
          key={s.quality}
          onClick={() => onChange(s.quality)}
          className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${
            selected === s.quality
              ? 'text-[#030424]'
              : 'bg-white text-foreground border border-border hover:border-[#06004A]'
          }`}
          style={selected === s.quality ? { backgroundColor: '#CDF765' } : {}}
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  );
}

function RoomCard({ room, quality }: { room: typeof roomData[0]; quality: FloorPlanQuality }) {
  const [expanded, setExpanded] = useState(false);
  const img = ROOM_IMAGES[room.id] ?? null;

  return (
    <div className="border border-border bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {img && (
        <div className="h-40 overflow-hidden">
          <img src={img} alt={room.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{room.icon}</span>
            <h3 className="text-xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
              {room.name}
            </h3>
          </div>
          <CodeBadge code={room.necSection} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-secondary rounded-sm p-2">
            <div className="text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Circuit</div>
            <div className="font-bold text-foreground">{room.circuitType}</div>
          </div>
          <div className="bg-secondary rounded-sm p-2">
            <div className="text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Outlet Spacing</div>
            <div className="font-bold text-foreground">{room.outletSpacing}</div>
          </div>
          <div className="bg-secondary rounded-sm p-2">
            <div className="text-muted-foreground font-bold uppercase tracking-wider mb-0.5">GFCI</div>
            <div className={`font-bold ${room.gfciRequired ? '' : 'text-muted-foreground'}`} style={room.gfciRequired ? { color: '#06004A' } : {}}>
              {room.gfciRequired ? '✓ Required' : 'Not Required'}
            </div>
          </div>
          <div className="bg-secondary rounded-sm p-2">
            <div className="text-muted-foreground font-bold uppercase tracking-wider mb-0.5">AFCI</div>
            <div className={`font-bold ${room.afciRequired ? '' : 'text-muted-foreground'}`} style={room.afciRequired ? { color: '#1705E5' } : {}}>
              {room.afciRequired ? '✓ Required' : 'Not Required'}
            </div>
          </div>
        </div>

        {/* Floor plan clue */}
        <div className="requirement-callout mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#06004A' }}>
            Floor Plan Guidance ({quality === 'high' ? 'High Detail' : quality === 'medium' ? 'Medium Detail' : 'Low Detail'})
          </div>
          <p className="text-sm text-foreground leading-relaxed">{room.floorPlanClues[quality]}</p>
        </div>

        {/* Expand button — Spacial lime green */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs font-semibold py-2.5 rounded transition-all duration-150"
          style={{ backgroundColor: expanded ? '#06004A' : '#CDF765', color: expanded ? '#CDF765' : '#030424' }}
        >
          {expanded ? '▲ Hide Details' : '▼ Show Full Requirements'}
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Key requirements */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Key NEC Requirements
              </h4>
              <ul className="space-y-1">
                {room.keyRequirements.map((req, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Design tips */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Design Best Practices
              </h4>
              <ul className="space-y-1">
                {room.designTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: '#06004A' }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            {room.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Code Warnings
                </h4>
                <div className="space-y-2">
                  {room.warnings.map((w, i) => (
                    <div key={i} className="warning-callout text-sm text-foreground">{w}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Dedicated circuits */}
            {room.dedicatedCircuits.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Dedicated Circuits
                </h4>
                <div className="flex flex-wrap gap-1">
                  {room.dedicatedCircuits.map((c, i) => (
                    <span key={i} className="code-badge">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Appliance circuits table */}
            {room.applianceCircuits && room.applianceCircuits.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Appliance Circuit Requirements
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left p-2 font-bold uppercase tracking-wider border border-border">Appliance</th>
                        <th className="text-left p-2 font-bold uppercase tracking-wider border border-border">Voltage</th>
                        <th className="text-left p-2 font-bold uppercase tracking-wider border border-border">Amperage</th>
                        <th className="text-left p-2 font-bold uppercase tracking-wider border border-border">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {room.applianceCircuits.map((a, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}>
                          <td className="p-2 border border-border font-bold">{a.name}</td>
                          <td className="p-2 border border-border">{a.voltage}V</td>
                          <td className="p-2 border border-border font-bold text-primary">{a.amperage}A</td>
                          <td className="p-2 border border-border text-muted-foreground">{a.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedQuality, setSelectedQuality] = useState<FloorPlanQuality>('medium');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — Spacial deep navy */}
      <header className="sticky top-0 z-50 border-b border-white/10 shadow-md" style={{ backgroundColor: '#06004A' }}>
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <span className="text-base font-semibold text-white tracking-wide">
              ⚡ Residential Electrical Guide
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="text-white/50">|</span>
            <a href="https://spacial.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xs text-white/60">Powered by</span>
              <img src={SPACIAL_LOGO_WHITE} alt="Spacial" className="h-9 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — Spacial deep navy */}
        <aside
          className={`fixed md:sticky top-14 h-[calc(100vh-3.5rem)] w-64 overflow-y-auto z-40 flex-shrink-0 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{ backgroundColor: '#06004A' }}
        >
          <nav className="p-4">
            {/* Spacial logo in sidebar */}
            <div className="px-2 mb-6 pt-2">
              <a href="https://spacial.io" target="_blank" rel="noopener noreferrer">
                <img src={SPACIAL_LOGO_WHITE} alt="Spacial" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity" />
              </a>
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Navigation
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded mb-0.5 ${
                  activeSection === item.id
                    ? 'text-[#030424] font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={activeSection === item.id ? { backgroundColor: '#CDF765' } : {}}
              >
                {item.label}
              </button>
            ))}

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Floor Plan Quality
              </div>
              {floorPlanStrategies.map(s => (
                <button
                  key={s.quality}
                  onClick={() => setSelectedQuality(s.quality)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-all duration-150 rounded mb-0.5 ${
                    selectedQuality === s.quality
                      ? 'text-[#030424] font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  style={selectedQuality === s.quality ? { backgroundColor: '#CDF765' } : {}}
                >
                  {s.icon} {s.label}
                </button>
              ))}
              <p className="text-xs px-2 mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Changes floor plan guidance shown in room cards below.
              </p>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <section
            id="overview"
            ref={el => { sectionRefs.current['overview'] = el; }}
            className="relative overflow-hidden"
          >
            <div className="relative h-80 md:h-[420px]">
              <img
                src={HERO_IMG}
                alt="Residential electrical floor plan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 rounded font-mono font-bold" style={{ backgroundColor: '#CDF765', color: '#030424' }}>NEC 2023</span>
                    <span className="text-white/60 text-xs">Single-Family Homes · USA</span>
                  </div>
                  <h1
                    className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    Residential<br />Electrical<br />Wiring Guide
                  </h1>
                  <p className="text-white/70 text-base max-w-lg leading-relaxed">
                    Intelligent placement of outlets, switches, and light fixtures based on floor plan analysis and NEC code requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats bar — Spacial deep navy */}
            <div style={{ backgroundColor: '#070942' }}>
              <div className="container grid grid-cols-2 md:grid-cols-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { label: 'NEC Edition', value: '2023' },
                  { label: 'Room Types Covered', value: '10+' },
                  { label: 'Code Sections', value: '15+' },
                  { label: 'Circuit Types', value: '8' },
                ].map((stat, i) => (
                  <div key={stat.label} className="py-5 px-6 text-center" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                    <div className="text-2xl font-bold" style={{ color: '#CDF765' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="container py-12 space-y-20">
            {/* Floor Plan Strategy */}
            <section
              id="floor-plan"
              ref={el => { sectionRefs.current['floor-plan'] = el; }}
            >
              <SectionHeader
                number="01"
                title="Floor Plan Interpretation Strategy"
                subtitle="How to estimate electrical placement based on available floor plan detail"
              />

              <div className="grid md:grid-cols-3 gap-6">
                {floorPlanStrategies.map(strategy => (
                  <div
                    key={strategy.quality}
                    className="border-2 bg-card rounded-sm overflow-hidden"
                    style={{ borderColor: strategy.color }}
                  >
                    <div
                      className="p-4"
                      style={{
                        backgroundColor: strategy.color,
                        color: strategy.color === '#CDF765' ? '#030424' : 'white'
                      }}
                    >
                      <div className="text-2xl font-bold mb-1">
                        {strategy.icon} {strategy.label}
                      </div>
                      <div className="text-sm opacity-80">{strategy.description}</div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground mb-4 leading-relaxed">{strategy.approach}</p>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Identification Tips
                      </h4>
                      <ul className="space-y-1.5">
                        {strategy.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-foreground flex gap-2">
                            <span className="flex-shrink-0 mt-0.5" style={{ color: strategy.color }}>→</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* General Requirements */}
            <section
              id="general"
              ref={el => { sectionRefs.current['general'] = el; }}
            >
              <SectionHeader
                number="02"
                title="General NEC Requirements"
                subtitle="Baseline rules that apply to all habitable rooms in a single-family home"
              />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="requirement-callout">
                    <div className="flex items-center gap-2 mb-2">
                      <CodeBadge code="NEC 210.52(A)" />
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>Wall Spacing Rule</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      No point along the floor line of any wall can be more than <strong>6 feet</strong> from a receptacle. This effectively requires outlets every <strong>12 feet maximum</strong> along continuous walls. Any wall space 2 feet or wider requires its own outlet.
                    </p>
                  </div>

                  <div className="requirement-callout">
                    <div className="flex items-center gap-2 mb-2">
                      <CodeBadge code="NEC 210.70" />
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>Lighting Outlets</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      At least one <strong>wall switch-controlled lighting outlet</strong> is required in every habitable room, kitchen, bathroom, hallway, stairway, garage, and outdoor entrance. The switch must be located near the room entry point.
                    </p>
                  </div>

                  <div className="requirement-callout">
                    <div className="flex items-center gap-2 mb-2">
                      <CodeBadge code="NEC 210.12" />
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>AFCI Protection</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      All 15A and 20A, 120V branch circuits supplying outlets in habitable rooms — including bedrooms, living rooms, dining rooms, family rooms, hallways, and closets — must have <strong>AFCI protection</strong>.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="safe-callout">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>Standard Heights (Industry Practice)</span>
                    </div>
                    <div className="space-y-2 text-sm text-foreground">
                      <div className="flex justify-between border-b border-border pb-1">
                        <span>Standard wall outlet</span>
                        <strong>12–18 in. from floor</strong>
                      </div>
                      <div className="flex justify-between border-b border-border pb-1">
                        <span>Wall switch</span>
                        <strong>48 in. from floor</strong>
                      </div>
                      <div className="flex justify-between border-b border-border pb-1">
                        <span>Kitchen countertop outlet</span>
                        <strong>42–48 in. from floor</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Bathroom vanity outlet</span>
                        <strong>36–42 in. from floor</strong>
                      </div>
                    </div>
                  </div>

                  <div className="warning-callout">
                    <div className="flex items-center gap-2 mb-2">
                      <WarningBadge text="2023 NEC Update" />
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>Surge Protection Required</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      The 2023 NEC now requires a <strong>Surge Protection Device (SPD)</strong> at the service panel for all new installations and service replacements. This is a significant new requirement that affects all new construction.
                    </p>
                  </div>

                  <div className="warning-callout">
                    <div className="flex items-center gap-2 mb-2">
                      <WarningBadge text="2023 NEC Update" />
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>Outdoor Disconnect</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      Feeders supplied to one- and two-family dwelling units must have <strong>outside emergency disconnects</strong> that are clearly labeled, allowing first responders to disconnect power from outside the dwelling.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Room-by-Room Guide */}
            <section
              id="rooms"
              ref={el => { sectionRefs.current['rooms'] = el; }}
            >
              <SectionHeader
                number="03"
                title="Room-by-Room Guide"
                subtitle="Detailed NEC requirements and design best practices for each space"
              />

              {/* Quality selector */}
              <div className="bg-secondary rounded-sm p-4 mb-6">
                <div className="text-sm font-bold uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  Select Floor Plan Detail Level
                </div>
                <FloorPlanQualitySelector selected={selectedQuality} onChange={setSelectedQuality} />
                <p className="text-xs text-muted-foreground">
                  {floorPlanStrategies.find(s => s.quality === selectedQuality)?.approach}
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roomData.map(room => (
                  <RoomCard key={room.id} room={room} quality={selectedQuality} />
                ))}
              </div>
            </section>

            {/* GFCI & AFCI */}
            <section
              id="protection"
              ref={el => { sectionRefs.current['protection'] = el; }}
            >
              <SectionHeader
                number="04"
                title="GFCI & AFCI Protection"
                subtitle="Where each type of circuit protection is required by NEC 2023"
              />

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {protectionSummary.map(p => (
                  <div key={p.type} className="bg-card border border-border rounded-sm overflow-hidden">
                    <div className="p-4 text-white" style={{ backgroundColor: p.color }}>
                      <div className="text-2xl font-extrabold tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                        {p.type}
                      </div>
                      <div className="text-sm opacity-90 mt-0.5">{p.fullName}</div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground mb-4 leading-relaxed">{p.description}</p>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Required In
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.rooms.map(r => (
                          <span
                            key={r}
                            className="text-xs px-2 py-0.5 rounded-sm font-bold text-white"
                            style={{ backgroundColor: p.color + 'cc' }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* GFCI/AFCI visualization */}
              <div className="bg-card border border-border rounded-sm p-6">
                <h3 className="text-lg font-bold tracking-wide mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                  Protection Requirements by Room
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left p-3 font-bold uppercase tracking-wider border border-border" style={{ fontFamily: 'var(--font-display)' }}>Room / Area</th>
                        <th className="text-center p-3 font-bold uppercase tracking-wider border border-border" style={{ color: '#06004A' }}>GFCI</th>
                        <th className="text-center p-3 font-bold uppercase tracking-wider border border-border" style={{ color: '#1705E5' }}>AFCI</th>
                        <th className="text-left p-3 font-bold uppercase tracking-wider border border-border" style={{ fontFamily: 'var(--font-display)' }}>NEC Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { room: 'Kitchen', gfci: true, afci: true, ref: 'NEC 210.8(A)(6), 210.12' },
                        { room: 'Bathroom', gfci: true, afci: false, ref: 'NEC 210.8(A)(1)' },
                        { room: 'Bedroom', gfci: false, afci: true, ref: 'NEC 210.12(A)' },
                        { room: 'Living / Family Room', gfci: false, afci: true, ref: 'NEC 210.12(A)' },
                        { room: 'Dining Room', gfci: false, afci: true, ref: 'NEC 210.12(A)' },
                        { room: 'Hallway / Closet', gfci: false, afci: true, ref: 'NEC 210.12(A)' },
                        { room: 'Laundry Room', gfci: true, afci: true, ref: 'NEC 210.8(A)(10), 210.12' },
                        { room: 'Garage', gfci: true, afci: false, ref: 'NEC 210.8(A)(2)' },
                        { room: 'Outdoor / Patio', gfci: true, afci: false, ref: 'NEC 210.8(A)(3)' },
                        { room: 'Crawl Space', gfci: true, afci: false, ref: 'NEC 210.8(A)(4)' },
                        { room: 'Unfinished Basement', gfci: true, afci: false, ref: 'NEC 210.8(A)(5)' },
                        { room: 'Home Office', gfci: false, afci: true, ref: 'NEC 210.12(A)' },
                      ].map((row, i) => (
                        <tr key={row.room} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/40'}>
                          <td className="p-3 border border-border font-bold">{row.room}</td>
                          <td className="p-3 border border-border text-center">
                            {row.gfci ? <span className="font-bold text-lg" style={{ color: '#06004A' }}>✓</span> : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="p-3 border border-border text-center">
                            {row.afci ? <span className="font-bold text-lg" style={{ color: '#1705E5' }}>✓</span> : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="p-3 border border-border"><CodeBadge code={row.ref} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Circuit Planning */}
            <section
              id="circuits"
              ref={el => { sectionRefs.current['circuits'] = el; }}
            >
              <SectionHeader
                number="05"
                title="Circuit Planning"
                subtitle="Recommended circuit counts by room and dedicated circuit requirements"
              />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-sm p-6">
                  <h3 className="text-lg font-bold tracking-wide mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    Recommended Circuits by Area
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={circuitLoadData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="room" tick={{ fontSize: 11 }} width={110} />
                      <Tooltip
                        contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                        formatter={(value, name) => [value, name === 'circuits' ? 'Recommended' : 'NEC Minimum']}
                      />
                      <Legend />
                      <Bar dataKey="minRequired" name="NEC Minimum" fill="#D1E3FF" />
                      <Bar dataKey="circuits" name="Recommended" fill="#CDF765" stroke="#06004A" strokeWidth={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-sm p-6">
                    <h3 className="text-lg font-bold tracking-wide mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                      Dedicated Circuit Requirements
                    </h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { appliance: 'Electric Range / Cooktop', spec: '240V, 50A', color: '#06004A' },
                        { appliance: 'Electric Dryer', spec: '240V, 30A', color: '#06004A' },
                        { appliance: 'Central AC / Heat Pump', spec: '240V, 30–60A', color: '#070942' },
                        { appliance: 'Electric Water Heater', spec: '240V, 30A', color: '#070942' },
                        { appliance: 'Refrigerator', spec: '120V, 20A', color: '#1705E5' },
                        { appliance: 'Dishwasher', spec: '120V, 20A', color: '#1705E5' },
                        { appliance: 'Garbage Disposal', spec: '120V, 20A', color: '#1705E5' },
                        { appliance: 'Microwave (Built-in)', spec: '120V, 20A', color: '#1705E5' },
                        { appliance: 'Washing Machine', spec: '120V, 20A', color: '#030424' },
                        { appliance: 'EV Charger (Level 2)', spec: '240V, 50A', color: '#030424' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                          <span className="font-medium">{item.appliance}</span>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-sm text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.spec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Room Diagrams */}
            <section
              id="diagrams"
              ref={el => { sectionRefs.current['diagrams'] = el; }}
            >
              <SectionHeader
                number="07"
                title="Room Outlet Placement Diagrams"
                subtitle="Annotated floor plan diagrams showing NEC-compliant outlet, switch, and fixture positions"
              />
              <RoomDiagrams />
            </section>

            {/* Circuit Calculator */}
            <section
              id="calculator"
              ref={el => { sectionRefs.current['calculator'] = el; }}
            >
              <SectionHeader
                number="08"
                title="Circuit Calculator"
                subtitle="Enter room dimensions to estimate NEC-minimum outlet count and circuit load"
              />
              <CircuitCalculator />
            </section>

            {/* Heights Reference */}
            <section
              id="heights"
              ref={el => { sectionRefs.current['heights'] = el; }}
            >
              <SectionHeader
                number="09"
                title="Installation Heights Quick Reference"
                subtitle="Industry-standard mounting heights for outlets, switches, and fixtures"
              />

              <div className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: '#06004A' }}>
                        <th className="text-left p-4 font-bold uppercase tracking-wider text-white">Item</th>
                        <th className="text-left p-4 font-bold uppercase tracking-wider" style={{ color: '#CDF765' }}>Height from Floor</th>
                        <th className="text-left p-4 font-bold uppercase tracking-wider text-white">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outletHeightGuide.map((item, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/40'}>
                          <td className="p-4 border border-border font-bold">{item.item}</td>
                          <td className="p-4 border border-border">
                            <span className="font-bold font-mono" style={{ color: '#06004A' }}>
                              {item.height}
                            </span>
                          </td>
                          <td className="p-4 border border-border text-muted-foreground">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-5 bg-secondary border border-border rounded-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Important Disclaimer
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This guide is based on the <strong className="text-foreground">2023 National Electrical Code (NEC / NFPA 70)</strong>. Local jurisdictions may adopt different editions or have local amendments. Always verify requirements with your local Authority Having Jurisdiction (AHJ) before beginning any electrical work. All electrical work should be performed by or under the supervision of a licensed electrician. This guide is intended as a reference tool for planning and estimation purposes only.
                </p>
              </div>
            </section>
          </div>

          {/* Footer — Spacial deep navy */}
          <footer className="py-10 mt-8" style={{ backgroundColor: '#030424' }}>
            <div className="container">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <a href="https://spacial.io" target="_blank" rel="noopener noreferrer" className="inline-block mb-3">
                    <img src={SPACIAL_LOGO_WHITE} alt="Spacial" className="h-11 w-auto opacity-90 hover:opacity-100 transition-opacity" />
                  </a>
                  <div className="text-sm font-medium text-white mt-1">
                    Residential Electrical Wiring Guide
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Based on NEC 2023 (NFPA 70) · Single-Family Homes · USA
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'rgba(205,247,101,0.12)', color: '#CDF765', border: '1px solid rgba(205,247,101,0.25)' }}>NEC 2023</span>
                  <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'rgba(205,247,101,0.12)', color: '#CDF765', border: '1px solid rgba(205,247,101,0.25)' }}>NFPA 70</span>
                  <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'rgba(205,247,101,0.12)', color: '#CDF765', border: '1px solid rgba(205,247,101,0.25)' }}>210.52</span>
                  <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'rgba(205,247,101,0.12)', color: '#CDF765', border: '1px solid rgba(205,247,101,0.25)' }}>210.8</span>
                  <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'rgba(205,247,101,0.12)', color: '#CDF765', border: '1px solid rgba(205,247,101,0.25)' }}>210.12</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
