// CircuitCalculator.tsx
// Design: Spacial Brand — Deep Navy #06004A, Lime Green #CDF765, Off-White #F5F5F1
// Interactive tool: user inputs room dimensions → NEC-based outlet count + circuit load estimate
// ============================================================

import { useState, useMemo } from 'react';

type RoomType =
  | 'bedroom'
  | 'living'
  | 'kitchen'
  | 'bathroom'
  | 'dining'
  | 'office'
  | 'laundry'
  | 'garage'
  | 'hallway';

interface RoomConfig {
  label: string;
  icon: string;
  baseLoad: number; // watts per outlet (avg)
  circuitAmperage: number;
  voltage: number;
  hasCountertop: boolean;
  gfciRequired: boolean;
  afciRequired: boolean;
  dedicatedCircuits: { name: string; watts: number; amps: number; voltage: number }[];
  notes: string[];
}

const ROOM_CONFIGS: Record<RoomType, RoomConfig> = {
  bedroom: {
    label: 'Bedroom',
    icon: '🛏️',
    baseLoad: 180,
    circuitAmperage: 15,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: false,
    afciRequired: true,
    dedicatedCircuits: [],
    notes: [
      'AFCI protection required on all circuits',
      'Outlets on each side of bed (nightstand positions)',
      'Closet lighting on switched circuit',
    ],
  },
  living: {
    label: 'Living / Family Room',
    icon: '🛋️',
    baseLoad: 200,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: false,
    afciRequired: true,
    dedicatedCircuits: [],
    notes: [
      'AFCI protection required',
      'Consider floor outlet for floating furniture',
      'TV wall: outlets at standard height + mounting height',
    ],
  },
  kitchen: {
    label: 'Kitchen',
    icon: '🍳',
    baseLoad: 1500,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: true,
    gfciRequired: true,
    afciRequired: true,
    dedicatedCircuits: [
      { name: 'Refrigerator', watts: 150, amps: 20, voltage: 120 },
      { name: 'Dishwasher', watts: 1200, amps: 20, voltage: 120 },
      { name: 'Garbage Disposal', watts: 560, amps: 20, voltage: 120 },
      { name: 'Microwave', watts: 1500, amps: 20, voltage: 120 },
    ],
    notes: [
      'Minimum 2 small-appliance circuits (20A each)',
      'All countertop outlets must be GFCI protected',
      'No countertop point more than 2 ft from an outlet',
      'Island/peninsula ≥ 2 ft requires at least one outlet',
    ],
  },
  bathroom: {
    label: 'Bathroom',
    icon: '🚿',
    baseLoad: 1200,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: true,
    afciRequired: false,
    dedicatedCircuits: [],
    notes: [
      'Dedicated 20A circuit required',
      'GFCI required for all outlets',
      'Outlet within 3 ft of each sink basin',
      'Exhaust fan on separate switched circuit',
    ],
  },
  dining: {
    label: 'Dining Room',
    icon: '🍽️',
    baseLoad: 180,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: false,
    afciRequired: true,
    dedicatedCircuits: [],
    notes: [
      'AFCI protection required',
      'Consider floor outlet under table center',
      'Dimmer switch recommended for overhead fixture',
    ],
  },
  office: {
    label: 'Home Office',
    icon: '💼',
    baseLoad: 300,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: false,
    afciRequired: true,
    dedicatedCircuits: [],
    notes: [
      'AFCI protection required',
      'Cluster outlets on primary desk wall',
      'Consider dedicated circuit for workstation',
      'USB-C/A combo outlets recommended at desk',
    ],
  },
  laundry: {
    label: 'Laundry Room',
    icon: '🧺',
    baseLoad: 500,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: true,
    afciRequired: true,
    dedicatedCircuits: [
      { name: 'Electric Dryer', watts: 5600, amps: 30, voltage: 240 },
      { name: 'Washing Machine', watts: 500, amps: 20, voltage: 120 },
    ],
    notes: [
      'GFCI required for all outlets',
      'Dedicated 30A/240V circuit for electric dryer',
      'Dedicated 20A/120V circuit for washing machine',
      'Gas dryer: 120V/20A outlet only',
    ],
  },
  garage: {
    label: 'Garage',
    icon: '🚗',
    baseLoad: 400,
    circuitAmperage: 20,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: true,
    afciRequired: false,
    dedicatedCircuits: [
      { name: 'EV Charger (Level 2)', watts: 9600, amps: 50, voltage: 240 },
      { name: 'Garage Door Opener', watts: 500, amps: 20, voltage: 120 },
    ],
    notes: [
      'GFCI required for all outlets',
      'At least one outlet per vehicle bay',
      'Consider 240V/50A circuit for EV charger',
      'Ceiling outlet for garage door opener',
    ],
  },
  hallway: {
    label: 'Hallway',
    icon: '🚪',
    baseLoad: 100,
    circuitAmperage: 15,
    voltage: 120,
    hasCountertop: false,
    gfciRequired: false,
    afciRequired: true,
    dedicatedCircuits: [],
    notes: [
      'AFCI protection required',
      'Outlet required if hallway ≥ 10 ft long',
      'Switch-controlled lighting at each end',
      '3-way switches for hallways with two entry points',
    ],
  },
};

function calcMinOutlets(lengthFt: number, widthFt: number, roomType: RoomType): number {
  const config = ROOM_CONFIGS[roomType];
  const perimeter = 2 * (lengthFt + widthFt);

  if (roomType === 'kitchen') {
    // Countertop rule: every 4 ft along counter walls
    // Assume 60% of perimeter is counter
    const counterLinFt = perimeter * 0.6;
    return Math.max(4, Math.ceil(counterLinFt / 4));
  }
  if (roomType === 'bathroom') {
    return 1; // minimum 1 within 3 ft of sink
  }
  if (roomType === 'hallway') {
    return lengthFt >= 10 ? 1 : 0;
  }

  // NEC 210.52(A): no point more than 6 ft from outlet → every 12 ft max
  // Count outlets needed along each wall
  const wallSegments = [lengthFt, widthFt, lengthFt, widthFt];
  let total = 0;
  for (const wall of wallSegments) {
    if (wall >= 2) {
      total += Math.max(1, Math.ceil(wall / 12));
    }
  }
  return Math.max(total, 2);
}

function calcCircuitLoad(
  outletCount: number,
  roomType: RoomType,
  sqft: number
): { generalLoad: number; dedicatedLoad: number; totalLoad: number; recommendedCircuits: number } {
  const config = ROOM_CONFIGS[roomType];

  // General lighting load: NEC 220.12 — 3VA per sq ft for dwelling units
  const lightingLoad = sqft * 3;

  // General receptacle load
  const generalLoad = Math.round(lightingLoad + outletCount * config.baseLoad * 0.1);

  // Dedicated circuit load
  const dedicatedLoad = config.dedicatedCircuits.reduce((sum, c) => sum + c.watts, 0);

  const totalLoad = generalLoad + dedicatedLoad;

  // Recommended circuits: general + dedicated
  const generalCircuits = Math.max(1, Math.ceil(generalLoad / (config.circuitAmperage * config.voltage * 0.8)));
  const dedicatedCircuits = config.dedicatedCircuits.length;
  const recommendedCircuits = generalCircuits + dedicatedCircuits;

  return { generalLoad, dedicatedLoad, totalLoad, recommendedCircuits };
}

export default function CircuitCalculator() {
  const [roomType, setRoomType] = useState<RoomType>('bedroom');
  const [length, setLength] = useState<string>('14');
  const [width, setWidth] = useState<string>('12');
  const [hasIsland, setHasIsland] = useState(false);
  const [hasDryer, setHasDryer] = useState(true);
  const [hasEV, setHasEV] = useState(false);

  const config = ROOM_CONFIGS[roomType];

  const lengthNum = parseFloat(length) || 0;
  const widthNum = parseFloat(width) || 0;
  const sqft = lengthNum * widthNum;

  const results = useMemo(() => {
    if (!lengthNum || !widthNum) return null;
    const minOutlets = calcMinOutlets(lengthNum, widthNum, roomType);
    const extraOutlets = roomType === 'kitchen' && hasIsland ? 2 : 0;
    const totalOutlets = minOutlets + extraOutlets;

    // Filter dedicated circuits based on options
    let dedicatedCircuits = [...config.dedicatedCircuits];
    if (roomType === 'laundry' && !hasDryer) {
      dedicatedCircuits = dedicatedCircuits.filter(c => c.name !== 'Electric Dryer');
    }
    if (roomType === 'garage' && !hasEV) {
      dedicatedCircuits = dedicatedCircuits.filter(c => c.name !== 'EV Charger (Level 2)');
    }

    const dedicatedLoad = dedicatedCircuits.reduce((sum, c) => sum + c.watts, 0);
    const lightingLoad = Math.round(sqft * 3);
    const generalLoad = Math.round(lightingLoad + totalOutlets * config.baseLoad * 0.1);
    const totalLoad = generalLoad + dedicatedLoad;
    const generalCircuits = Math.max(1, Math.ceil(generalLoad / (config.circuitAmperage * config.voltage * 0.8)));
    const recommendedCircuits = generalCircuits + dedicatedCircuits.length;

    return {
      minOutlets: totalOutlets,
      sqft: Math.round(sqft),
      lightingLoad,
      generalLoad,
      dedicatedLoad,
      totalLoad,
      recommendedCircuits,
      dedicatedCircuits,
      generalCircuits,
    };
  }, [roomType, lengthNum, widthNum, hasIsland, hasDryer, hasEV, config, sqft]);

  const NAVY = '#06004A';
  const LIME = '#CDF765';
  const DARK_NAVY = '#030424';

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border" style={{ backgroundColor: NAVY }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔌</span>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
              Circuit Calculator
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Enter room dimensions to estimate NEC-minimum outlet count and circuit load
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          {/* Room Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Room Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(ROOM_CONFIGS) as RoomType[]).map(rt => (
                <button
                  key={rt}
                  onClick={() => setRoomType(rt)}
                  className="text-xs py-2 px-1.5 rounded-sm border transition-all duration-150 font-medium text-center"
                  style={{
                    backgroundColor: roomType === rt ? LIME : 'transparent',
                    color: roomType === rt ? DARK_NAVY : 'var(--muted-foreground)',
                    borderColor: roomType === rt ? LIME : 'var(--border)',
                    fontWeight: roomType === rt ? 700 : 500,
                  }}
                >
                  <span className="block text-base mb-0.5">{ROOM_CONFIGS[rt].icon}</span>
                  {ROOM_CONFIGS[rt].label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Length (ft)
              </label>
              <input
                type="number"
                min="4"
                max="100"
                value={length}
                onChange={e => setLength(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-2 font-mono"
                style={{ '--tw-ring-color': LIME } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Width (ft)
              </label>
              <input
                type="number"
                min="4"
                max="100"
                value={width}
                onChange={e => setWidth(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-2 font-mono"
                style={{ '--tw-ring-color': LIME } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Conditional options */}
          {roomType === 'kitchen' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Kitchen Options
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasIsland}
                  onChange={e => setHasIsland(e.target.checked)}
                  className="w-4 h-4 rounded-sm"
                />
                <span className="text-sm">Has island or peninsula (≥ 2 ft wide)</span>
              </label>
            </div>
          )}
          {roomType === 'laundry' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Laundry Options
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDryer}
                  onChange={e => setHasDryer(e.target.checked)}
                  className="w-4 h-4 rounded-sm"
                />
                <span className="text-sm">Electric dryer (requires 240V/30A circuit)</span>
              </label>
            </div>
          )}
          {roomType === 'garage' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Garage Options
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEV}
                  onChange={e => setHasEV(e.target.checked)}
                  className="w-4 h-4 rounded-sm"
                />
                <span className="text-sm">EV charger (Level 2 — 240V/50A)</span>
              </label>
            </div>
          )}

          {/* Code notes */}
          <div className="p-4 rounded-sm" style={{ backgroundColor: `${NAVY}10`, border: `1px solid ${NAVY}20` }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>
              Code Notes
            </h4>
            <ul className="space-y-1">
              {config.notes.map((note, i) => (
                <li key={i} className="text-xs flex gap-2 text-foreground">
                  <span style={{ color: NAVY }} className="flex-shrink-0">→</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Results */}
        <div>
          {results && sqft > 0 ? (
            <div className="space-y-4">
              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm p-4 text-center" style={{ backgroundColor: NAVY }}>
                  <div className="text-3xl font-bold" style={{ color: LIME }}>
                    {results.minOutlets}
                  </div>
                  <div className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Min. Outlets (NEC)
                  </div>
                </div>
                <div className="rounded-sm p-4 text-center" style={{ backgroundColor: NAVY }}>
                  <div className="text-3xl font-bold" style={{ color: LIME }}>
                    {results.recommendedCircuits}
                  </div>
                  <div className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Circuits Needed
                  </div>
                </div>
                <div className="rounded-sm p-4 text-center border border-border">
                  <div className="text-2xl font-bold text-foreground">
                    {results.sqft} ft²
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">Room Area</div>
                </div>
                <div className="rounded-sm p-4 text-center border border-border">
                  <div className="text-2xl font-bold text-foreground">
                    {(results.totalLoad / 1000).toFixed(1)} kW
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">Est. Total Load</div>
                </div>
              </div>

              {/* Load breakdown */}
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: '#F5F5F1' }}>
                  Load Breakdown
                </div>
                <div className="divide-y divide-border">
                  <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">Lighting (3 VA/ft²)</span>
                    <span className="font-mono font-bold">{results.lightingLoad} W</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">General Receptacles</span>
                    <span className="font-mono font-bold">{results.generalLoad} W</span>
                  </div>
                  {results.dedicatedLoad > 0 && (
                    <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">Dedicated Appliances</span>
                      <span className="font-mono font-bold">{results.dedicatedLoad} W</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-4 py-2.5 text-sm font-bold" style={{ backgroundColor: `${NAVY}08` }}>
                    <span>Total Estimated Load</span>
                    <span className="font-mono" style={{ color: NAVY }}>{results.totalLoad} W</span>
                  </div>
                </div>
              </div>

              {/* Circuit breakdown */}
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: '#F5F5F1' }}>
                  Circuit Breakdown
                </div>
                <div className="divide-y divide-border">
                  <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">
                      General {config.circuitAmperage}A/{config.voltage}V circuits
                    </span>
                    <span className="font-mono font-bold">{results.generalCircuits}</span>
                  </div>
                  {results.dedicatedCircuits.map((dc, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">{dc.name}</span>
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm text-white"
                        style={{ backgroundColor: NAVY }}
                      >
                        {dc.amps}A/{dc.voltage}V
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protection badges */}
              <div className="flex gap-2 flex-wrap">
                {config.gfciRequired && (
                  <span className="text-xs px-2.5 py-1 rounded-sm font-bold" style={{ backgroundColor: '#DC2626', color: 'white' }}>
                    GFCI Required
                  </span>
                )}
                {config.afciRequired && (
                  <span className="text-xs px-2.5 py-1 rounded-sm font-bold" style={{ backgroundColor: '#D97706', color: 'white' }}>
                    AFCI Required
                  </span>
                )}
                {!config.gfciRequired && !config.afciRequired && (
                  <span className="text-xs px-2.5 py-1 rounded-sm font-bold" style={{ backgroundColor: '#16A34A', color: 'white' }}>
                    Standard Protection
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                * Load estimates use NEC 220.12 (3 VA/ft² lighting) and 80% circuit capacity rule. Actual loads depend on installed fixtures and appliances. Always consult a licensed electrician.
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center py-12">
              <div>
                <div className="text-4xl mb-3">📐</div>
                <p className="text-sm text-muted-foreground">Enter room dimensions to see<br />NEC-based estimates</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
