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
