import { useMemo, useState } from 'react';
import { Target, TrendingUp, Shield, Clock, MapPin, Building2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PROPERTIES, totalUnits, portfolioValue, fmtCurrency } from '../lib/portfolioData';

const pillars = [
  {
    icon: Target,
    color: '#8DB7FF',
    title: 'Basis Discipline',
    body: 'We target acquisitions at significant discounts to replacement cost, ensuring embedded safety margins regardless of market volatility.',
  },
  {
    icon: TrendingUp,
    color: '#63CFA6',
    title: 'Value-Add Execution',
    body: 'Renovations are underwritten conservatively with phased timelines and vendor-level cost controls to protect returns.',
  },
  {
    icon: Shield,
    color: '#DCC8A3',
    title: 'Risk-Adjusted Returns',
    body: 'Every deal is stress-tested against cap rate expansion, rent growth shortfalls, and higher vacancy assumptions before underwriting.',
  },
  {
    icon: Clock,
    color: '#D66A77',
    title: 'Hold Period Alignment',
    body: 'We match hold periods to the business plan — 5-year sprints for light repositioning, 7-10 years for larger market value plays.',
  },
  {
    icon: MapPin,
    color: '#8DB7FF',
    title: 'Geographic Focus',
    body: 'Deep expertise in Northeast US submarkets — Westchester, Hudson County, and Boston metro — where we have sourcing and operator relationships.',
  },
  {
    icon: Building2,
    color: '#4F8CFF',
    title: 'Portfolio Construction',
    body: 'Balanced exposure across price points and geographies, with a bias toward smaller assets under $3M that face less institutional competition.',
  },
];

const markets = [
  { name: 'Westchester, NY', properties: PROPERTIES.filter(p => p.tag === 'Westchester').length, alloc: 35, color: '#8DB7FF' },
  { name: 'Hudson County, NJ', properties: PROPERTIES.filter(p => p.tag === 'Hudson County').length, alloc: 15, color: '#DCC8A3' },
  { name: 'Boston Metro, MA', properties: PROPERTIES.filter(p => p.tag === 'Boston Metro').length, alloc: 50, color: '#63CFA6' },
];

export default function Strategy() {
  const [rentGrowth, setRentGrowth] = useState(4.2);
  const [exitCap, setExitCap] = useState(6.2);
  const [debtRate, setDebtRate] = useState(6.8);
  const [holdPeriod, setHoldPeriod] = useState(5);
  const [renovationBudget, setRenovationBudget] = useState(220000);
  const [purchasePrice, setPurchasePrice] = useState(Math.round(portfolioValue / PROPERTIES.length));
  const [vacancy, setVacancy] = useState(4.5);

  const underwriting = useMemo(() => {
    const currentNOI = PROPERTIES.reduce((sum, property) => sum + property.financials.currentNOI, 0);
    const baseRenovation = PROPERTIES.reduce((sum, property) => sum + property.financials.renovationBudget, 0) / PROPERTIES.length;
    const growthLift = (rentGrowth - 3.5) * 1.35;
    const capDrag = (exitCap - 6.2) * 2.1;
    const debtDrag = (debtRate - 6.8) * 1.2;
    const holdLift = (holdPeriod - 5) * 0.45;
    const vacancyDrag = (vacancy - 4.5) * 0.8;
    const basisLift = ((portfolioValue / PROPERTIES.length - purchasePrice) / 100000) * 0.22;
    const renovationLift = ((renovationBudget - baseRenovation) / 100000) * 0.42;
    const midpoint = Math.max(5, Math.min(31, 18 + growthLift - capDrag - debtDrag - vacancyDrag + holdLift + renovationLift + basisLift));
    const low = Math.max(6, midpoint - 3.2);
    const high = midpoint + 3.8;
    const multiple = 1 + (midpoint / 100) * holdPeriod * 0.68;
    const noiGrowth = Math.max(0.84, 1 + rentGrowth / 100 * holdPeriod + renovationBudget / 2600000 - vacancy / 160);
    const stabilizedNOI = currentNOI * noiGrowth;
    const exitValue = stabilizedNOI / (exitCap / 100);
    const risk =
      exitCap >= 7 || debtRate >= 8 || rentGrowth < 3 || vacancy > 7 ? 'Defensive' :
      rentGrowth >= 5 && exitCap <= 6 ? 'Aggressive' :
      'Balanced';
    return { low, high, multiple, risk, stabilizedNOI, exitValue };
  }, [debtRate, exitCap, holdPeriod, purchasePrice, renovationBudget, rentGrowth, vacancy]);

  const applyScenario = (scenario: 'Defensive' | 'Base Case' | 'Upside' | 'Recession') => {
    const settings = {
      Defensive: { rentGrowth: 2.4, exitCap: 7.2, debtRate: 7.8, holdPeriod: 7, renovationBudget: 140000, vacancy: 6.5, purchasePrice: 1600000 },
      'Base Case': { rentGrowth: 4.2, exitCap: 6.2, debtRate: 6.8, holdPeriod: 5, renovationBudget: 220000, vacancy: 4.5, purchasePrice: Math.round(portfolioValue / PROPERTIES.length) },
      Upside: { rentGrowth: 5.8, exitCap: 5.7, debtRate: 6.1, holdPeriod: 6, renovationBudget: 340000, vacancy: 3.2, purchasePrice: 1450000 },
      Recession: { rentGrowth: 0.8, exitCap: 7.8, debtRate: 8.4, holdPeriod: 8, renovationBudget: 90000, vacancy: 8.5, purchasePrice: 1325000 },
    }[scenario];
    setRentGrowth(settings.rentGrowth);
    setExitCap(settings.exitCap);
    setDebtRate(settings.debtRate);
    setHoldPeriod(settings.holdPeriod);
    setRenovationBudget(settings.renovationBudget);
    setVacancy(settings.vacancy);
    setPurchasePrice(settings.purchasePrice);
  };

  const sliderStyle = {
    width: '100%',
    accentColor: '#8DB7FF',
  };

  return (
    <div style={{ padding: '48px 24px 80px' }}>
      <div className="section">
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(79,140,255,0.12)', border: '1px solid rgba(79,140,255,0.25)',
            borderRadius: 999, padding: '5px 16px', marginBottom: 20,
            fontSize: 11, color: '#8DB7FF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Investment Strategy
          </span>
          <h1 style={{ margin: '0 0 16px', fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', color: '#F6F0E4', lineHeight: 1.1 }}>
            Northeast Multifamily<br />Value-Add Playbook
          </h1>
          <p style={{ margin: 0, maxWidth: 580, color: 'rgba(246,240,228,0.52)', fontSize: 16, lineHeight: 1.7 }}>
            Institutional-grade underwriting with a principal-driven focus on risk-adjusted returns in high-barrier Northeast markets.
          </p>
        </div>

        {/* Underwriting Simulator */}
        <div className="glass" style={{ borderRadius: 26, padding: '28px 30px', marginBottom: 56, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 10%, rgba(79,140,255,0.16), transparent 38%), radial-gradient(circle at 12% 86%, rgba(94,224,161,0.1), transparent 36%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 28, alignItems: 'stretch' }}>
            <div>
              <span style={{ color: '#8DB7FF', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Interactive Underwriting
              </span>
              <h2 style={{ margin: '8px 0 8px', fontSize: 24, fontWeight: 900, color: '#F6F0E4', letterSpacing: '-0.025em' }}>
                Return Sensitivity Simulator
              </h2>
              <p style={{ margin: '0 0 22px', color: 'rgba(246,240,228,0.48)', fontSize: 13, lineHeight: 1.7, maxWidth: 620 }}>
                Adjust the major value-add assumptions to see how the strategy posture changes. Outputs are directional estimates for education, not investment guarantees.
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                {(['Defensive', 'Base Case', 'Upside', 'Recession'] as const).map((scenario) => (
                  <button
                    key={scenario}
                    onClick={() => applyScenario(scenario)}
                    style={{
                      border: '1px solid rgba(255,255,255,0.11)',
                      borderRadius: 999,
                      padding: '8px 13px',
                      background: scenario === underwriting.risk || (scenario === 'Base Case' && underwriting.risk === 'Balanced')
                        ? 'rgba(79,140,255,0.16)'
                        : 'rgba(255,255,255,0.045)',
                      color: scenario === underwriting.risk || (scenario === 'Base Case' && underwriting.risk === 'Balanced')
                        ? '#c4d4ff'
                        : 'rgba(246,240,228,0.52)',
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
                  { label: 'Rent Growth', value: rentGrowth, suffix: '%', min: 0, max: 8, step: 0.1, set: setRentGrowth, color: '#63CFA6' },
                  { label: 'Exit Cap Rate', value: exitCap, suffix: '%', min: 4.5, max: 8.5, step: 0.1, set: setExitCap, color: '#DCC8A3' },
                  { label: 'Debt Rate', value: debtRate, suffix: '%', min: 4.5, max: 9.5, step: 0.1, set: setDebtRate, color: '#D66A77' },
                  { label: 'Vacancy', value: vacancy, suffix: '%', min: 2, max: 10, step: 0.1, set: setVacancy, color: '#DCC8A3' },
                  { label: 'Hold Period', value: holdPeriod, suffix: ' yrs', min: 3, max: 10, step: 1, set: setHoldPeriod, color: '#8DB7FF' },
                  { label: 'Renovation Budget', value: renovationBudget, suffix: '', min: 50000, max: 450000, step: 10000, set: setRenovationBudget, color: '#DCC8A3', currency: true },
                  { label: 'Purchase Price', value: purchasePrice, suffix: '', min: 900000, max: 3200000, step: 25000, set: setPurchasePrice, color: '#8DB7FF', currency: true },
                ].map(({ label, value, suffix, min, max, step, set, color }) => (
                  <label key={label} style={{
                    display: 'block',
                    borderRadius: 18,
                    padding: '15px 16px',
                    background: 'rgba(255,255,255,0.045)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ color: 'rgba(246,240,228,0.42)', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
                      <span style={{ color, fontSize: 14, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                        {label === 'Renovation Budget' || label === 'Purchase Price' ? fmtCurrency(value) : value.toFixed(step === 1 ? 0 : 1)}{suffix}
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
              background: 'rgba(3,8,20,0.42)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              <p style={{ margin: '0 0 5px', color: 'rgba(246,240,228,0.36)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Live Estimate
              </p>
              <p style={{ margin: '0 0 20px', color: '#63CFA6', fontSize: 42, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
                {underwriting.low.toFixed(1)}-{underwriting.high.toFixed(1)}%
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  { name: 'IRR', value: underwriting.high },
                  { name: 'Multiple', value: underwriting.multiple * 10 },
                  { name: 'Risk', value: underwriting.risk === 'Defensive' ? 42 : underwriting.risk === 'Aggressive' ? 84 : 66 },
                ]}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#061426', border: '1px solid rgba(243,231,208,0.12)', borderRadius: 12 }} />
                  <Bar dataKey="value" fill="#8DB7FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {[
                { label: 'Risk Posture', value: underwriting.risk, color: underwriting.risk === 'Defensive' ? '#DCC8A3' : underwriting.risk === 'Aggressive' ? '#63CFA6' : '#8DB7FF' },
                { label: 'Equity Multiple', value: `${underwriting.multiple.toFixed(2)}x`, color: '#F6F0E4' },
                { label: 'Stabilized NOI', value: fmtCurrency(underwriting.stabilizedNOI), color: '#63CFA6' },
                { label: 'Exit Value Estimate', value: fmtCurrency(underwriting.exitValue), color: '#DCC8A3' },
                { label: 'Portfolio Basis', value: fmtCurrency(portfolioValue), color: '#F6F0E4' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '13px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ color: 'rgba(246,240,228,0.4)', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
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
              <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: '#F6F0E4' }}>{title}</h3>
              <p style={{ margin: 0, color: 'rgba(246,240,228,0.54)', fontSize: 14, lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Market Allocation */}
        <div className="glass" style={{ borderRadius: 24, padding: '32px 36px', marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 800, color: '#F6F0E4', letterSpacing: '-0.02em' }}>
            Market Allocation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {markets.map(({ name, properties, alloc, color }) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ color: '#F6F0E4', fontWeight: 600, fontSize: 14 }}>{name}</span>
                    <span style={{ color: 'rgba(246,240,228,0.38)', fontSize: 12 }}>· {properties} propert{properties === 1 ? 'y' : 'ies'}</span>
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
            { label: 'Total Properties', value: String(PROPERTIES.length), color: '#8DB7FF' },
            { label: 'Total Units', value: String(totalUnits), color: '#63CFA6' },
            { label: 'Portfolio Value', value: fmtCurrency(portfolioValue), color: '#DCC8A3' },
            { label: 'Target IRR Range', value: '15–30%', color: '#D66A77' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass" style={{ borderRadius: 18, padding: '22px 24px' }}>
              <p style={{ margin: '0 0 8px', color: 'rgba(246,240,228,0.4)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</p>
              <p style={{ margin: 0, color, fontWeight: 900, fontSize: 26, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
