/**
 * LightingSection.tsx
 * Design: Industrial Modernism / Spacial brand
 * Colors: #06004A (navy), #CDF765 (lime), #F5F5F1 (off-white), #1A1A2E (dark)
 * 
 * Sections:
 * 1. Lighting Layers (Ambient / Task / Accent / Decorative) — interactive cards
 * 2. Switch Types & Ergonomics — interactive grid with placement rules
 * 3. Footcandle Reference Chart — recharts bar chart
 * 4. Space-Specific Lighting Rules — room-by-room lighting details
 * 5. Stairway & Hallway Special Rules — code callout
 */

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Sun, Lamp, Sparkles, Star, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const lightingLayers = [
  {
    id: 'ambient',
    name: 'Ambient (General)',
    icon: Sun,
    color: '#F5C842',
    bgColor: '#FFFBEA',
    description: 'The foundational layer providing overall illumination for safe movement and general activities. Replaces natural light and sets the base brightness of the room.',
    fixtures: ['Recessed downlights (grid layout)', 'Flush-mount ceiling fixtures', 'Semi-flush pendants', 'Cove / valance lighting', 'Track lighting (general wash)'],
    necRef: 'NEC 210.70(A)(1): At least one wall switch–controlled lighting outlet required in every habitable room and bathroom.',
    designTip: 'Aim for even distribution — avoid single-point sources that create harsh shadows. Always install on a dimmer for flexibility.',
    switchType: 'Dimmer (IECC required in living rooms, dining rooms, bedrooms)',
  },
  {
    id: 'task',
    name: 'Task Lighting',
    icon: Lamp,
    color: '#4A90D9',
    bgColor: '#EBF4FF',
    description: 'Focused, bright illumination for specific activities: cooking, reading, grooming, working at a desk. Must be bright enough to prevent eye strain without creating glare.',
    fixtures: ['Under-cabinet LED strips (kitchen counters)', 'Vanity bar / Hollywood strip (bathroom)', 'Desk lamp / floor lamp (office, bedroom)', 'Pendant lights over island or peninsula', 'Reading sconces at nightstand height'],
    necRef: 'No specific NEC section — governed by interior design standards and IECC energy efficiency codes.',
    designTip: 'Position task lights so the light source is between you and the work surface — never behind you, which casts your own shadow.',
    switchType: 'Separate single-pole switch from ambient circuit',
  },
  {
    id: 'accent',
    name: 'Accent Lighting',
    icon: Sparkles,
    color: '#9B59B6',
    bgColor: '#F5EEFF',
    description: 'Directional lighting used to highlight architectural features, artwork, plants, or focal points. Creates visual depth and dimension in a space.',
    fixtures: ['Recessed adjustable spotlights (eyeball trim)', 'Track heads (directional)', 'Picture lights (above artwork)', 'Cabinet interior lights (display cabinets)', 'Landscape uplights (exterior)'],
    necRef: 'No specific NEC section — must comply with general wiring and fixture location rules (NEC 410).',
    designTip: 'Accent lighting should be 3–5× brighter than the ambient level in the highlighted zone to create effective visual contrast.',
    switchType: 'Separate switch or dimmer from ambient circuit',
  },
  {
    id: 'decorative',
    name: 'Decorative / Architectural',
    icon: Star,
    color: '#E67E22',
    bgColor: '#FFF3E8',
    description: 'Fixtures that serve as visual focal points themselves — chandeliers, sconces, LED cove strips. Primarily aesthetic but may contribute to ambient light.',
    fixtures: ['Chandeliers (dining room, foyer)', 'Pendant clusters', 'Wall sconces (hallway, bedroom)', 'LED cove / tray ceiling strips', 'Stair tread lights'],
    necRef: 'NEC 410.36: Fixtures over 50 lbs must be supported independently of the outlet box.',
    designTip: 'Always pair decorative fixtures with a dimmer — they look best at 60–80% brightness during social occasions.',
    switchType: 'Dimmer strongly recommended',
  },
];

const switchTypes = [
  {
    id: 'single-pole',
    symbol: 'S',
    name: 'Single-Pole',
    color: '#2C3E50',
    description: 'Controls a light from one location only. Used in rooms with a single entry point.',
    placement: 'Latch side of door, 48" AFF to center, within 6" of door frame',
    useCases: ['Bedroom (single entry)', 'Bathroom', 'Closet', 'Laundry room', 'Utility room'],
    necRef: 'NEC 404',
    required: false,
  },
  {
    id: 'three-way',
    symbol: 'S3',
    name: '3-Way Switch',
    color: '#1A6B3C',
    description: 'Controls a light from two locations. Required by NEC for stairways with 6+ risers.',
    placement: 'At EACH END of hallway, at TOP and BOTTOM of stairs, at each entry of large rooms',
    useCases: ['Stairways 6+ risers (REQUIRED)', 'Hallways (recommended)', 'Large living rooms', 'Master bedrooms', 'Garage (house door + vehicle door)'],
    necRef: 'NEC 210.70(A)(2)(c)',
    required: true,
    requiredNote: 'REQUIRED by NEC for stairways with 6 or more risers',
  },
  {
    id: 'four-way',
    symbol: 'S4',
    name: '4-Way Switch',
    color: '#8E44AD',
    description: 'Used between two 3-way switches to control a light from three or more locations.',
    placement: 'Intermediate positions between two 3-way switches',
    useCases: ['Long hallways (3 control points)', 'Great rooms (3+ entries)', 'Stairways with landing (3 control points)'],
    necRef: 'NEC 404',
    required: false,
  },
  {
    id: 'dimmer',
    symbol: 'SD',
    name: 'Dimmer Switch',
    color: '#D35400',
    description: 'Variable brightness control. Required by IECC in living rooms, dining rooms, and bedrooms. Must be LED-compatible.',
    placement: 'Same position as single-pole or 3-way; 3-way dimmers must provide full range at EACH location',
    useCases: ['Living room (IECC required)', 'Dining room (IECC required)', 'Master bedroom (IECC required)', 'Kitchen ambient circuit', 'Home theater'],
    necRef: 'NEC 404.14(E); IECC energy codes; NEC 210.70(A)(2)(4) for stair dimmers',
    required: true,
    requiredNote: 'REQUIRED by IECC in living rooms, dining rooms, and bedrooms in most jurisdictions',
  },
  {
    id: 'occupancy',
    symbol: 'SO',
    name: 'Occupancy Sensor',
    color: '#16A085',
    description: 'Auto-on when motion detected, auto-off after timeout. Required by IECC in laundry, garage, utility, and bathrooms in many jurisdictions.',
    placement: 'Same wall position as standard switch; sensor must have clear line-of-sight to room',
    useCases: ['Laundry room (IECC required)', 'Garage (IECC required)', 'Utility/mechanical room', 'Bathroom', 'Closet', 'Hallway'],
    necRef: 'IECC energy codes; NEC 210.70',
    required: true,
    requiredNote: 'REQUIRED by IECC in laundry, garage, and utility rooms in most jurisdictions',
  },
  {
    id: 'vacancy',
    symbol: 'SV',
    name: 'Vacancy Sensor',
    color: '#2980B9',
    description: 'Manual-on, auto-off. Preferred over occupancy sensors in bedrooms and private spaces for privacy.',
    placement: 'Same as standard switch',
    useCases: ['Bedroom (preferred)', 'Home office', 'Dining room'],
    necRef: 'IECC energy codes',
    required: false,
  },
];

const footcandleData = [
  { room: 'Kitchen\n(task)', general: 40, task: 100, color: '#E74C3C' },
  { room: 'Bathroom\n(vanity)', general: 25, task: 85, color: '#E67E22' },
  { room: 'Dining\nRoom', general: 35, task: 50, color: '#F39C12' },
  { room: 'Home\nOffice', general: 40, task: 75, color: '#27AE60' },
  { room: 'Living\nRoom', general: 15, task: 50, color: '#2980B9' },
  { room: 'Bedroom', general: 15, task: 50, color: '#8E44AD' },
  { room: 'Laundry', general: 40, task: 50, color: '#16A085' },
  { room: 'Garage', general: 40, task: 100, color: '#2C3E50' },
  { room: 'Hallway', general: 8, task: 10, color: '#7F8C8D' },
  { room: 'Stairway', general: 15, task: 20, color: '#95A5A6' },
];

const colorTempData = [
  { room: 'Kitchen (ambient)', temp: '2700K–3000K', feel: 'Warm White', hex: '#FFD580', note: 'Welcoming; pairs with 3500K–4000K task lighting' },
  { room: 'Kitchen (task/counter)', temp: '3500K–4000K', feel: 'Neutral White', hex: '#FFF5CC', note: 'Accurate color rendering for food prep' },
  { room: 'Bathroom (vanity)', temp: '3000K–3500K', feel: 'Warm-Neutral', hex: '#FFEAA0', note: 'Mimics natural daylight for accurate grooming' },
  { room: 'Bedroom', temp: '2700K–3000K', feel: 'Warm White', hex: '#FFD580', note: 'Promotes relaxation and sleep' },
  { room: 'Living Room', temp: '2700K–3000K', feel: 'Warm White', hex: '#FFD580', note: 'Comfortable for extended social use' },
  { room: 'Dining Room', temp: '2700K–3000K', feel: 'Warm White', hex: '#FFD580', note: 'Enhances food appearance; creates intimacy' },
  { room: 'Home Office', temp: '3500K–4000K', feel: 'Neutral White', hex: '#FFF5CC', note: 'Promotes alertness and focus' },
  { room: 'Laundry Room', temp: '3500K–4000K', feel: 'Neutral White', hex: '#FFF5CC', note: 'Accurate color for sorting and stain detection' },
  { room: 'Garage', temp: '4000K–5000K', feel: 'Cool/Daylight', hex: '#F0F8FF', note: 'Maximum visibility for work and safety' },
  { room: 'Hallway / Stairway', temp: '2700K–3000K', feel: 'Warm White', hex: '#FFD580', note: 'Consistent with adjacent rooms' },
  { room: 'Outdoor (ambiance)', temp: '2700K–3000K', feel: 'Warm White', hex: '#FFD580', note: 'Inviting; matches interior warm tones' },
  { room: 'Outdoor (security)', temp: '4000K–5000K', feel: 'Cool/Daylight', hex: '#F0F8FF', note: 'Maximum visibility for security' },
];

const specialSpaceRules = [
  {
    space: 'Stairways',
    icon: '🪜',
    severity: 'critical',
    rules: [
      { rule: '3-way switches REQUIRED at each floor level if stairway has 6 or more risers', ref: 'NEC 210.70(A)(2)(c)' },
      { rule: '3-way switches also required at each landing level that includes an entryway', ref: 'NEC 210.70(A)(2)(c)' },
      { rule: 'If dimmers are used on stairs, BOTH switches must provide full range of dimming control at each location', ref: 'NEC 210.70(A)(2)(4)' },
      { rule: 'Stair lighting is a life-safety requirement — inadequate illumination is a leading cause of residential falls', ref: 'NFPA 101' },
    ],
  },
  {
    space: 'Hallways',
    icon: '🚪',
    severity: 'important',
    rules: [
      { rule: 'At least one switched lighting outlet required in all hallways', ref: 'NEC 210.70(A)(2)(a)' },
      { rule: '3-way switches strongly recommended (some local codes require) for hallways with entries at both ends', ref: 'Local codes vary' },
      { rule: 'Hallways 10 ft or longer require at least one receptacle outlet', ref: 'NEC 210.52(H)' },
      { rule: 'Occupancy sensors are an energy-efficient alternative to 3-way switches in hallways', ref: 'IECC' },
    ],
  },
  {
    space: 'Closets',
    icon: '🚪',
    severity: 'important',
    rules: [
      { rule: 'Incandescent/LED recessed fixtures: minimum 6" clearance from nearest point of storage space', ref: 'NEC 410.16(D)(1)' },
      { rule: 'Surface-mounted incandescent: minimum 12" clearance from storage', ref: 'NEC 410.16(D)(2)' },
      { rule: 'Surface-mounted LED fixtures listed for closet use: 0" clearance permitted', ref: 'NEC 410.16(D)(5)' },
      { rule: 'Open-lamp (bare bulb) incandescent fixtures are PROHIBITED in clothes closets', ref: 'NEC 410.16(C)' },
      { rule: 'Pendant fixtures are PROHIBITED in clothes closets', ref: 'NEC 410.16(C)' },
    ],
  },
  {
    space: 'Bathrooms (Wet Zones)',
    icon: '🚿',
    severity: 'critical',
    rules: [
      { rule: 'No cord-connected, pendant, chain, track, or ceiling fan fixtures within 3 ft horizontal / 8 ft vertical of tub rim or shower threshold', ref: 'NEC 410.10(D)(1)' },
      { rule: 'Fixtures within the shower zone must be marked suitable for WET locations', ref: 'NEC 410.10(D)(2)' },
      { rule: 'Fixtures outside shower zone but within bathroom must be marked suitable for DAMP locations', ref: 'NEC 410.10(D)(2)' },
      { rule: 'Switches must NOT be installed within the bathtub/shower zone', ref: 'NEC 404.4' },
      { rule: 'GFCI protection required for all bathroom lighting circuits in many jurisdictions', ref: 'NEC 210.8(A)(1)' },
    ],
  },
  {
    space: 'Exterior / Outdoor',
    icon: '🌿',
    severity: 'important',
    rules: [
      { rule: 'Switched lighting outlet REQUIRED on exterior side of ALL grade-level entry/exit doors', ref: 'NEC 210.70(A)(2)(b)' },
      { rule: 'Vehicle door in garage does NOT count as an outdoor entrance for this requirement', ref: 'NEC 210.70(A)(2)(b)' },
      { rule: 'All outdoor fixtures must be rated for wet or damp locations as appropriate', ref: 'NEC 410.10(A)' },
      { rule: 'Exterior lighting must have automatic shutoff (motion sensor, photocell, or timer)', ref: 'IECC' },
      { rule: 'Outdoor wiring must use weatherproof conduit or direct-burial cable', ref: 'NEC 225' },
    ],
  },
  {
    space: 'Garages',
    icon: '🚗',
    severity: 'important',
    rules: [
      { rule: 'At least one switched lighting outlet required in attached and detached garages with electric power', ref: 'NEC 210.70(A)(2)(a)' },
      { rule: 'Exterior entry light REQUIRED on exterior side of grade-level pedestrian entry door', ref: 'NEC 210.70(A)(2)(b)' },
      { rule: '3-way switch strongly recommended: control from interior house door AND near vehicle door', ref: 'Best practice' },
      { rule: 'GFCI protection required for all garage outlets and recommended for lighting circuits', ref: 'NEC 210.8(A)(2)' },
    ],
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LightingSection() {
  const [activeLayer, setActiveLayer] = useState('ambient');
  const [activeSwitchType, setActiveSwitchType] = useState('single-pole');
  const [expandedSpace, setExpandedSpace] = useState<string | null>('Stairways');
  const [chartView, setChartView] = useState<'footcandles' | 'colortemp'>('footcandles');

  const selectedLayer = lightingLayers.find(l => l.id === activeLayer)!;
  const selectedSwitch = switchTypes.find(s => s.id === activeSwitchType)!;

  return (
    <div className="space-y-12">

      {/* ── INTRO ── */}
      <div className="bg-[#06004A] text-white rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#CDF765] flex items-center justify-center flex-shrink-0">
            <Sun className="w-6 h-6 text-[#06004A]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#CDF765] mb-2">Illumination Design Principles</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Effective residential lighting requires three overlapping disciplines: <strong className="text-white">NEC code compliance</strong> (mandatory minimums for safety), <strong className="text-white">interior design layering</strong> (ambient, task, accent, and decorative circuits), and <strong className="text-white">switch ergonomics</strong> (where and how occupants control the light). All three must be addressed simultaneously — code sets the floor, design sets the ceiling.
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: LIGHTING LAYERS ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#CDF765] rounded-full" />
          <h3 className="text-xl font-bold text-[#06004A]">The Four Lighting Layers</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Professional lighting design uses four distinct layers, each served by a separate circuit and switch. A room with only one circuit (and one switch) is a common mistake that limits flexibility and reduces quality of life. Every habitable room should have at minimum ambient + task layers on separate controls.
        </p>

        {/* Layer selector tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {lightingLayers.map(layer => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-[#06004A] bg-[#06004A] text-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#06004A]/40'
                }`}
              >
                <Icon className="w-5 h-5 mb-2" style={{ color: isActive ? '#CDF765' : layer.color }} />
                <div className="font-semibold text-sm">{layer.name}</div>
              </button>
            );
          })}
        </div>

        {/* Layer detail card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-1" style={{ background: selectedLayer.color }}>
            <div className="bg-white/90 rounded-lg p-5 md:p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-[#06004A] text-lg mb-2">{selectedLayer.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{selectedLayer.description}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="text-xs font-semibold text-blue-700 mb-1">NEC Code Reference</div>
                    <div className="text-xs text-blue-600">{selectedLayer.necRef}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-amber-700 mb-1">Switch Type</div>
                    <div className="text-xs text-amber-600">{selectedLayer.switchType}</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-[#06004A] text-sm mb-3">Typical Fixtures</div>
                  <ul className="space-y-2">
                    {selectedLayer.fixtures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: selectedLayer.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 bg-[#06004A]/5 rounded-lg p-3">
                    <div className="text-xs font-semibold text-[#06004A] mb-1">Design Tip</div>
                    <div className="text-xs text-gray-600">{selectedLayer.designTip}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SWITCH TYPES ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#CDF765] rounded-full" />
          <h3 className="text-xl font-bold text-[#06004A]">Switch Types & Ergonomics</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Switch placement is as important as outlet placement. The fundamental rule: <strong>every switch must be reachable before entering a dark space</strong>, on the latch side of the door, at 48" AFF. Multi-location control (3-way, 4-way) is required by code in stairways and strongly recommended in hallways, large rooms, and garages.
        </p>

        {/* Ergonomics callout */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Standard Height', value: '48" AFF', sub: 'to center of switch box', icon: '📏' },
            { label: 'ADA Range', value: '15"–48" AFF', sub: 'accessible placement', icon: '♿' },
            { label: 'Door Distance', value: '≤6" from latch', sub: 'always on latch side', icon: '🚪' },
          ].map(item => (
            <div key={item.label} className="bg-[#06004A] text-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-[#CDF765] font-bold text-lg">{item.value}</div>
              <div className="text-white font-semibold text-sm">{item.label}</div>
              <div className="text-white/60 text-xs mt-1">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Switch type selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {switchTypes.map(sw => (
            <button
              key={sw.id}
              onClick={() => setActiveSwitchType(sw.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                activeSwitchType === sw.id
                  ? 'border-[#06004A] bg-[#06004A] text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-[#06004A]/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: activeSwitchType === sw.id ? '#CDF765' : sw.color, color: activeSwitchType === sw.id ? '#06004A' : 'white' }}
                >
                  {sw.symbol}
                </div>
                <div className="font-semibold text-xs">{sw.name}</div>
              </div>
              {sw.required && (
                <div className="text-xs mt-1" style={{ color: activeSwitchType === sw.id ? '#CDF765' : '#E74C3C' }}>
                  ⚠ Code Required
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Switch detail */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5 md:p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: selectedSwitch.color }}
                >
                  {selectedSwitch.symbol}
                </div>
                <div>
                  <h4 className="font-bold text-[#06004A]">{selectedSwitch.name}</h4>
                  <div className="text-xs text-gray-500">{selectedSwitch.necRef}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{selectedSwitch.description}</p>
              {selectedSwitch.required && selectedSwitch.requiredNote && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-700 font-medium">{selectedSwitch.requiredNote}</div>
                  </div>
                </div>
              )}
              <div className="bg-[#06004A]/5 rounded-lg p-3">
                <div className="text-xs font-semibold text-[#06004A] mb-1">Placement Rule</div>
                <div className="text-xs text-gray-600">{selectedSwitch.placement}</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-[#06004A] text-sm mb-3">Typical Use Cases</div>
              <ul className="space-y-2">
                {selectedSwitch.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: selectedSwitch.color }} />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: FOOTCANDLE CHART ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#CDF765] rounded-full" />
          <h3 className="text-xl font-bold text-[#06004A]">Light Level Reference</h3>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setChartView('footcandles')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              chartView === 'footcandles'
                ? 'bg-[#06004A] text-[#CDF765]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Footcandle Levels
          </button>
          <button
            onClick={() => setChartView('colortemp')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              chartView === 'colortemp'
                ? 'bg-[#06004A] text-[#CDF765]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Color Temperature
          </button>
        </div>

        {chartView === 'footcandles' ? (
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <p className="text-xs text-gray-500 mb-4">
              Footcandles (fc) measure illuminance — the amount of light reaching a surface. 1 fc = 1 lumen/sq ft. General levels are for ambient lighting; task levels are for work surfaces.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={footcandleData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="room"
                    tick={{ fontSize: 10, fill: '#555' }}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Footcandles (fc)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }} />
                  <Tooltip
                    formatter={(value, name) => [`${value} fc`, name === 'general' ? 'General/Ambient' : 'Task Level']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                  <Legend
                    formatter={(value) => value === 'general' ? 'General/Ambient' : 'Task Level'}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="general" name="general" fill="#06004A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="task" name="task" fill="#CDF765" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Low Activity', range: '5–10 fc', example: 'Hallways, corridors', color: '#95A5A6' },
                { label: 'General Living', range: '10–30 fc', example: 'Bedrooms, living rooms', color: '#3498DB' },
                { label: 'Task Areas', range: '30–50 fc', example: 'Kitchen, dining, office', color: '#27AE60' },
                { label: 'Detailed Work', range: '50–100 fc', example: 'Counter tasks, vanity', color: '#E74C3C' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="w-3 h-3 rounded-full mb-2" style={{ background: item.color }} />
                  <div className="font-semibold text-xs text-gray-700">{item.label}</div>
                  <div className="text-[#06004A] font-bold text-sm">{item.range}</div>
                  <div className="text-gray-500 text-xs">{item.example}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-[#06004A]/5 border-b border-gray-200">
              <p className="text-xs text-gray-600">
                Color temperature (Kelvin) affects mood, energy, and perceived cleanliness. Warm white (2700K–3000K) is relaxing; neutral white (3500K–4000K) is functional; cool/daylight (4000K–5000K) is energizing and promotes alertness.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#06004A] text-white">
                    <th className="text-left px-4 py-3 font-semibold text-xs">Room / Area</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs">Color Temp</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs">Feel</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden md:table-cell">Design Note</th>
                  </tr>
                </thead>
                <tbody>
                  {colorTempData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium text-[#06004A] text-xs">{row.room}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ background: row.hex }} />
                          <span className="font-semibold text-xs text-gray-700">{row.temp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{row.feel}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 4: SPECIAL SPACE RULES ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#CDF765] rounded-full" />
          <h3 className="text-xl font-bold text-[#06004A]">Space-Specific Lighting Code Rules</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Certain spaces have mandatory lighting requirements that go beyond the general "one switched outlet per room" rule. Stairways, wet areas, closets, and exterior entries all have specific NEC provisions that must be followed regardless of design preferences.
        </p>

        <div className="space-y-3">
          {specialSpaceRules.map(space => {
            const isExpanded = expandedSpace === space.space;
            return (
              <div
                key={space.space}
                className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                  space.severity === 'critical'
                    ? 'border-red-200'
                    : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => setExpandedSpace(isExpanded ? null : space.space)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                    isExpanded
                      ? space.severity === 'critical' ? 'bg-red-50' : 'bg-[#06004A]/5'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{space.icon}</span>
                    <div>
                      <div className="font-bold text-[#06004A] text-sm">{space.space}</div>
                      <div className="text-xs text-gray-500">{space.rules.length} code requirements</div>
                    </div>
                    {space.severity === 'critical' && (
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Life Safety
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-white">
                    <div className="space-y-3">
                      {space.rules.map((rule, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            space.severity === 'critical' ? 'bg-red-100' : 'bg-[#06004A]/10'
                          }`}>
                            <Zap className={`w-3 h-3 ${space.severity === 'critical' ? 'text-red-600' : 'text-[#06004A]'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-700">{rule.rule}</div>
                            <div className="text-xs text-gray-400 mt-0.5 font-mono">{rule.ref}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SUMMARY CALLOUT ── */}
      <div className="bg-[#CDF765] rounded-xl p-6">
        <h4 className="font-bold text-[#06004A] text-lg mb-3">Key Lighting Design Principles — Summary</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Layer, Don\'t Single-Switch', body: 'Every room needs at least ambient + task on separate circuits and switches. A single switch controlling all light is a design failure.' },
            { title: 'Dimmers Are Not Optional', body: 'IECC requires dimmers in living rooms, dining rooms, and bedrooms in most US jurisdictions. Always use LED-compatible dimmers.' },
            { title: '3-Way Switches Save Lives', body: 'Stairways with 6+ risers REQUIRE 3-way switches at each floor level. Hallways and garages strongly benefit from 3-way control.' },
            { title: 'Wet Zones Have Strict Rules', body: 'No pendants, track, or cord fixtures within 3 ft horizontal / 8 ft vertical of tub/shower. Wet-location rated fixtures required in shower zones.' },
          ].map(item => (
            <div key={item.title} className="bg-white/60 rounded-lg p-4">
              <div className="font-bold text-[#06004A] text-sm mb-1">{item.title}</div>
              <div className="text-[#06004A]/70 text-xs leading-relaxed">{item.body}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
