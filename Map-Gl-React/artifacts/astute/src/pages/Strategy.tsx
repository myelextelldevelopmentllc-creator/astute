import { useMemo, useState } from 'react';
import { Target, TrendingUp, Shield, Clock, MapPin, Building2 } from 'lucide-react';
import { PROPERTIES, totalUnits, portfolioValue, fmtCurrency } from '../lib/portfolioData';

const pillars = [
  {
    icon: Target,
    color: '#9fb8ff',
    title: 'Basis Discipline',
    body: 'We target acquisitions at significant discounts to replacement cost, ensuring embedded safety margins regardless of market volatility.',
  },
  {
    icon: TrendingUp,
    color: '#5ee0a1',
    title: 'Value-Add Execution',
    body: 'Renovations are underwritten conservatively with phased timelines and vendor-level cost controls to protect returns.',
  },
  {
    icon: Shield,
    color: '#d6b66a',
    title: 'Risk-Adjusted Returns',
    body: 'Every deal is stress-tested against cap rate expansion, rent growth shortfalls, and higher vacancy assumptions before underwriting.',
  },
  {
    icon: Clock,
    color: '#ff6b7a',
    title: 'Hold Period Alignment',
    body: 'We match hold periods to the business plan — 5-year sprints for light repositioning, 7-10 years for larger market value plays.',
  },
  {
    icon: MapPin,
    color: '#a78bfa',
    title: 'Geographic Focus',
    body: 'Deep expertise in Northeast US submarkets — Westchester, Hudson County, and Boston metro — where we have sourcing and operator relationships.',
  },
  {
    icon: Building2,
    color: '#38bdf8',
    title: 'Portfolio Construction',
    body: 'Balanced exposure across price points and geographies, with a bias toward smaller assets under $3M that face less institutional competition.',
  },
];

const markets = [
  { name: 'Westchester, NY', properties: PROPERTIES.filter(p => p.tag === 'Westchester').length, alloc: 35, color: '#9fb8ff' },
  { name: 'Hudson County, NJ', properties: PROPERTIES.filter(p => p.tag === 'Hudson County').length, alloc: 15, color: '#d6b66a' },
  { name: 'Boston Metro, MA', properties: PROPERTIES.filter(p => p.tag === 'Boston Metro').length, alloc: 50, color: '#5ee0a1' },
];

export default function Strategy() {
  const [rentGrowth, setRentGrowth] = useState(4.2);
  const [exitCap, setExitCap] = useState(6.2);
  const [debtRate, setDebtRate] = useState(6.8);
  const [holdPeriod, setHoldPeriod] = useState(5);
  const [renovationBudget, setRenovationBudget] = useState(220000);

  const underwriting = useMemo(() => {
    const currentNOI = PROPERTIES.reduce((sum, property) => sum + property.financials.currentNOI, 0);
    const baseRenovation = PROPERTIES.reduce((sum, property) => sum + property.financials.renovationBudget, 0) / PROPERTIES.length;
    const growthLift = (rentGrowth - 3.5) * 1.35;
    const capDrag = (exitCap - 6.2) * 2.1;
    const debtDrag = (debtRate - 6.8) * 1.2;
    const holdLift = (holdPeriod - 5) * 0.45;
    const renovationLift = ((renovationBudget - baseRenovation) / 100000) * 0.42;
    const midpoint = Math.max(8, Math.min(31, 18 + growthLift - capDrag - debtDrag + holdLift + renovationLift));
    const low = Math.max(6, midpoint - 3.2);
    const high = midpoint + 3.8;
    const multiple = 1 + (midpoint / 100) * holdPeriod * 0.68;
    const noiGrowth = Math.max(0.92, 1 + rentGrowth / 100 * holdPeriod + renovationBudget / 2600000);
    const stabilizedNOI = currentNOI * noiGrowth;
    const exitValue = stabilizedNOI / (exitCap / 100);
    const risk =
      exitCap >= 7 || debtRate >= 8 || rentGrowth < 3 ? 'Defensive' :
      rentGrowth >= 5 && exitCap <= 6 ? 'Aggressive' :
      'Balanced';
    return { low, high, multiple, risk, stabilizedNOI, exitValue };
  }, [debtRate, exitCap, holdPeriod, renovationBudget, rentGrowth]);

  const applyScenario = (scenario: 'Defensive' | 'Base Case' | 'Upside') => {
    const settings = {
      Defensive: { rentGrowth: 2.4, exitCap: 7.2, debtRate: 7.8, holdPeriod: 7, renovationBudget: 140000 },
      'Base Case': { rentGrowth: 4.2, exitCap: 6.2, debtRate: 6.8, holdPeriod: 5, renovationBudget: 220000 },
      Upside: { rentGrowth: 5.8, exitCap: 5.7, debtRate: 6.1, holdPeriod: 6, renovationBudget: 340000 },
    }[scenario];
    setRentGrowth(settings.rentGrowth);
    setExitCap(settings.exitCap);
    setDebtRate(settings.debtRate);
    setHoldPeriod(settings.holdPeriod);
    setRenovationBudget(settings.renovationBudget);
  };

  const sliderStyle = {
    width: '100%',
    accentColor: '#9fb8ff',
  };

  return (
    <div style={{ padding: '48px 24px 80px' }}>
      <div className="section">
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(79,114,255,0.12)', border: '1px solid rgba(79,114,255,0.25)',
            borderRadius: 999, padding: '5px 16px', marginBottom: 20,
            fontSize: 11, color: '#9fb8ff', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Investment Strategy
          </span>
          <h1 style={{ margin: '0 0 16px', fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', color: '#f5f7fb', lineHeight: 1.1 }}>
            Northeast Multifamily<br />Value-Add Playbook
          </h1>
          <p style={{ margin: 0, maxWidth: 580, color: 'rgba(245,247,251,0.52)', fontSize: 16, lineHeight: 1.7 }}>
            Institutional-grade underwriting with a principal-driven focus on risk-adjusted returns in high-barrier Northeast markets.
          </p>
        </div>

        {/* Underwriting Simulator */}
        <div className="glass" style={{ borderRadius: 26, padding: '28px 30px', marginBottom: 56, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 10%, rgba(159,184,255,0.16), transparent 38%), radial-gradient(circle at 12% 86%, rgba(94,224,161,0.1), transparent 36%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 28, alignItems: 'stretch' }}>
            <div>
              <span style={{ color: '#9fb8ff', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Interactive Underwriting
              </span>
              <h2 style={{ margin: '8px 0 8px', fontSize: 24, fontWeight: 900, color: '#f5f7fb', letterSpacing: '-0.025em' }}>
                Return Sensitivity Simulator
              </h2>
              <p style={{ margin: '0 0 22px', color: 'rgba(245,247,251,0.48)', fontSize: 13, lineHeight: 1.7, maxWidth: 620 }}>
                Adjust the major value-add assumptions to see how the strategy posture changes. Outputs are directional estimates for education, not investment guarantees.
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                {(['Defensive', 'Base Case', 'Upside'] as const).map((scenario) => (
                  <button
                    key={scenario}
                    onClick={() => applyScenario(scenario)}
                    style={{
                      border: '1px solid rgba(255,255,255,0.11)',
                      borderRadius: 999,
                      padding: '8px 13px',
                      background: scenario === underwriting.risk || (scenario === 'Base Case' && underwriting.risk === 'Balanced')
                        ? 'rgba(159,184,255,0.16)'
                        : 'rgba(255,255,255,0.045)',
                      color: scenario === underwriting.risk || (scenario === 'Base Case' && underwriting.risk === 'Balanced')
                        ? '#c4d4ff'
                        : 'rgba(245,247,251,0.52)',
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    {scenario}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 18 }}>
                {[
                  { label: 'Rent Growth', value: rentGrowth, suffix: '%', min: 0, max: 8, step: 0.1, set: setRentGrowth, color: '#5ee0a1' },
                  { label: 'Exit Cap Rate', value: exitCap, suffix: '%', min: 4.5, max: 8.5, step: 0.1, set: setExitCap, color: '#d6b66a' },
                  { label: 'Debt Rate', value: debtRate, suffix: '%', min: 4.5, max: 9.5, step: 0.1, set: setDebtRate, color: '#ff6b7a' },
                  { label: 'Hold Period', value: holdPeriod, suffix: ' yrs', min: 3, max: 10, step: 1, set: setHoldPeriod, color: '#9fb8ff' },
                  { label: 'Renovation Budget', value: renovationBudget, suffix: '', min: 50000, max: 450000, step: 10000, set: setRenovationBudget, color: '#d6b66a', currency: true },
                ].map(({ label, value, suffix, min, max, step, set, color }) => (
                  <label key={label} style={{
                    display: 'block',
                    borderRadius: 18,
                    padding: '15px 16px',
                    background: 'rgba(255,255,255,0.045)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ color: 'rgba(245,247,251,0.42)', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
                      <span style={{ color, fontSize: 14, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                        {label === 'Renovation Budget' ? fmtCurrency(value) : value.toFixed(step === 1 ? 0 : 1)}{suffix}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={e => set(Number(e.target.value))}
                      style={sliderStyle}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div style={{
              borderRadius: 22,
              padding: 22,
              background: 'rgba(5,6,9,0.42)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              <p style={{ margin: '0 0 5px', color: 'rgba(245,247,251,0.36)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Live Estimate
              </p>
              <p style={{ margin: '0 0 20px', color: '#5ee0a1', fontSize: 42, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
                {underwriting.low.toFixed(1)}-{underwriting.high.toFixed(1)}%
              </p>
              {[
                { label: 'Risk Posture', value: underwriting.risk, color: underwriting.risk === 'Defensive' ? '#d6b66a' : underwriting.risk === 'Aggressive' ? '#5ee0a1' : '#9fb8ff' },
                { label: 'Equity Multiple', value: `${underwriting.multiple.toFixed(2)}x`, color: '#f5f7fb' },
                { label: 'Stabilized NOI', value: fmtCurrency(underwriting.stabilizedNOI), color: '#5ee0a1' },
                { label: 'Exit Value Estimate', value: fmtCurrency(underwriting.exitValue), color: '#d6b66a' },
                { label: 'Portfolio Basis', value: fmtCurrency(portfolioValue), color: '#f5f7fb' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '13px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ color: 'rgba(245,247,251,0.4)', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
                  <span style={{ color, fontSize: 14, fontWeight: 900 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 56 }}>
          {pillars.map(({ icon: Icon, color, title, body }) => (
            <div key={title} className="glass" style={{ borderRadius: 20, padding: '24px 26px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, marginBottom: 16,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: '#f5f7fb' }}>{title}</h3>
              <p style={{ margin: 0, color: 'rgba(245,247,251,0.54)', fontSize: 14, lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Market Allocation */}
        <div className="glass" style={{ borderRadius: 24, padding: '32px 36px', marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 800, color: '#f5f7fb', letterSpacing: '-0.02em' }}>
            Market Allocation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {markets.map(({ name, properties, alloc, color }) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ color: '#f5f7fb', fontWeight: 600, fontSize: 14 }}>{name}</span>
                    <span style={{ color: 'rgba(245,247,251,0.38)', fontSize: 12 }}>· {properties} propert{properties === 1 ? 'y' : 'ies'}</span>
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: 14 }}>{alloc}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${alloc}%`, borderRadius: 999, background: color, transition: 'width 0.8s ease-out' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total Properties', value: String(PROPERTIES.length), color: '#9fb8ff' },
            { label: 'Total Units', value: String(totalUnits), color: '#5ee0a1' },
            { label: 'Portfolio Value', value: fmtCurrency(portfolioValue), color: '#d6b66a' },
            { label: 'Target IRR Range', value: '15–30%', color: '#ff6b7a' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass" style={{ borderRadius: 18, padding: '22px 24px' }}>
              <p style={{ margin: '0 0 8px', color: 'rgba(245,247,251,0.4)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</p>
              <p style={{ margin: 0, color, fontWeight: 900, fontSize: 26, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
