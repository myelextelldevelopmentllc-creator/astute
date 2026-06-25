import { useMemo, useState } from 'react';
import { TrendingUp, MapPin, Zap, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { PROPERTIES, fmtCurrency } from '../lib/portfolioData';

const marketTrends = [
  { label: 'Q1 \'25', rent: 2950, vacancy: 4.2 },
  { label: 'Q2 \'25', rent: 3010, vacancy: 3.8 },
  { label: 'Q3 \'25', rent: 3085, vacancy: 3.5 },
  { label: 'Q4 \'25', rent: 3140, vacancy: 3.1 },
  { label: 'Q1 \'26', rent: 3210, vacancy: 2.9 },
  { label: 'Q2 \'26', rent: 3290, vacancy: 2.7 },
];

const capRateData = [
  { market: 'Yonkers', cap: 6.6 },
  { market: 'Union City', cap: 4.2 },
  { market: 'Somerville', cap: 5.3 },
  { market: 'Boston Core', cap: 4.8 },
  { market: 'NYC Suburbs', cap: 5.9 },
];

const marketProfiles = {
  Westchester: {
    rentGrowth: '5.1%',
    vacancy: '2.8%',
    capRate: '6.2%',
    supplyPressure: 'Low',
    demandDriver: 'NYC commuter overflow',
    signal: 84,
    rentDelta: 0,
    vacancyDelta: 0.1,
    color: '#9fb8ff',
  },
  'Hudson County': {
    rentGrowth: '4.8%',
    vacancy: '3.1%',
    capRate: '5.1%',
    supplyPressure: 'Medium',
    demandDriver: 'PATH / tunnel access',
    signal: 91,
    rentDelta: 70,
    vacancyDelta: 0.2,
    color: '#d6b66a',
  },
  'Boston Metro': {
    rentGrowth: '4.4%',
    vacancy: '2.5%',
    capRate: '5.4%',
    supplyPressure: 'Very low',
    demandDriver: 'Education + biotech',
    signal: 88,
    rentDelta: 160,
    vacancyDelta: -0.2,
    color: '#5ee0a1',
  },
};

type MarketProfileKey = keyof typeof marketProfiles;

const insights = [
  {
    icon: TrendingUp,
    color: '#5ee0a1',
    tag: 'Rent Growth',
    title: 'Northeast Rents Up 4.2% YoY',
    body: 'Constrained housing supply in high-barrier markets continues to push multifamily rents higher. Westchester and Hudson County lead with 5.1% and 4.8% growth respectively, driven by NYC overflow demand and limited new construction.',
    date: 'Jun 2026',
  },
  {
    icon: MapPin,
    color: '#9fb8ff',
    tag: 'Market Intel',
    title: 'Somerville Attracting Institutional Capital',
    body: 'Post-Green Line Extension, Somerville multifamily pricing has compressed to near Boston-proper cap rates. Secondary operators face increased competition from institutional buyers, making sub-$3M assets a relative refuge.',
    date: 'May 2026',
  },
  {
    icon: Zap,
    color: '#d6b66a',
    tag: 'Capital Markets',
    title: 'Bridge Lenders Return to Multifamily',
    body: 'After 18 months of pullback, non-bank bridge lenders are re-entering the Northeast multifamily space with aggressive 70-75% LTC terms. This creates a meaningful tailwind for value-add sponsors with solid track records.',
    date: 'May 2026',
  },
  {
    icon: BarChart2,
    color: '#ff6b7a',
    tag: 'Valuation',
    title: 'Cap Rate Compression Slowing in Outer Markets',
    body: 'After years of compression, tertiary Northeast markets are showing signs of cap rate stabilization in the 6.5–7.5% range. Investors are pricing in higher-for-longer interest rates and are more selective on rent growth assumptions.',
    date: 'Apr 2026',
  },
];

export default function Insights() {
  const [activePulse, setActivePulse] = useState('Rent Growth');
  const [selectedMarket, setSelectedMarket] = useState<MarketProfileKey>('Westchester');
  const profile = marketProfiles[selectedMarket];
  const marketPulse = useMemo(() => {
    return [
      { label: 'Rent Growth', value: profile.rentGrowth, meta: 'YoY asking rent growth', color: '#5ee0a1' },
      { label: 'Vacancy', value: profile.vacancy, meta: 'Current vacancy signal', color: '#9fb8ff' },
      { label: 'Cap Rate', value: profile.capRate, meta: 'Going-in market range', color: '#d6b66a' },
      { label: 'Supply Pressure', value: profile.supplyPressure, meta: 'New delivery pressure', color: '#ff6b7a' },
      { label: 'Demand Driver', value: profile.demandDriver, meta: 'Primary renter catalyst', color: profile.color },
    ];
  }, [profile]);
  const adjustedTrends = useMemo(() => (
    marketTrends.map((point, index) => ({
      ...point,
      rent: point.rent + profile.rentDelta + index * Math.round(profile.signal / 22),
      vacancy: Number(Math.max(1.8, point.vacancy + profile.vacancyDelta - index * 0.02).toFixed(1)),
    }))
  ), [profile]);
  const adjustedCapRates = useMemo(() => (
    capRateData.map((point) => ({
      ...point,
      cap: point.market.includes('Yonkers') && selectedMarket === 'Westchester'
        ? 6.2
        : point.market.includes('Somerville') && selectedMarket === 'Boston Metro'
          ? 5.4
          : point.market.includes('Union City') && selectedMarket === 'Hudson County'
            ? 5.1
            : point.cap,
    }))
  ), [selectedMarket]);
  const opportunityRadar = useMemo(() => [
    { subject: 'Rent Growth', value: Number(profile.rentGrowth.replace('%', '')) * 16 },
    { subject: 'Low Vacancy', value: 100 - Number(profile.vacancy.replace('%', '')) * 10 },
    { subject: 'Liquidity', value: profile.signal },
    { subject: 'Supply', value: profile.supplyPressure === 'Very low' ? 92 : profile.supplyPressure === 'Low' ? 84 : 68 },
    { subject: 'Basis', value: selectedMarket === 'Hudson County' ? 94 : selectedMarket === 'Westchester' ? 82 : 74 },
  ], [profile, selectedMarket]);
  const filteredInsights = insights.filter(i =>
    activePulse === 'All' ||
    i.tag === activePulse ||
    (activePulse === 'Best Signal' && i.tag === 'Market Intel') ||
    (activePulse === 'Cap Rate' && i.tag === 'Valuation') ||
    (activePulse === 'Supply Pressure' && i.tag === 'Valuation') ||
    (activePulse === 'Demand Driver' && i.tag === 'Market Intel') ||
    (activePulse === 'Capital Flow' && i.tag === 'Capital Markets') ||
    (activePulse === 'Vacancy' && i.tag === 'Valuation')
  );

  return (
    <div style={{ padding: '48px 24px 80px' }}>
      <div className="section">
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(94,224,161,0.1)', border: '1px solid rgba(94,224,161,0.2)',
            borderRadius: 999, padding: '5px 16px', marginBottom: 20,
            fontSize: 11, color: '#5ee0a1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Market Intelligence
          </span>
          <h1 style={{ margin: '0 0 14px', fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', color: '#f5f7fb', lineHeight: 1.1 }}>
            Insights
          </h1>
          <p style={{ margin: 0, color: 'rgba(245,247,251,0.5)', fontSize: 16, lineHeight: 1.7, maxWidth: 520 }}>
            Market intelligence, trend analysis, and capital flows for the Northeast multifamily sector.
          </p>
        </div>

        {/* Market pulse */}
        <div className="glass" style={{ borderRadius: 24, padding: 18, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: '0 0 3px', color: '#f5f7fb', fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>Market Pulse</h2>
              <p style={{ margin: 0, color: 'rgba(245,247,251,0.42)', fontSize: 12 }}>Bloomberg-style live lens for active acquisition markets</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(Object.keys(marketProfiles) as MarketProfileKey[]).map((market) => (
                <button
                  key={market}
                  onClick={() => setSelectedMarket(market)}
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    padding: '8px 13px',
                    background: selectedMarket === market ? `${marketProfiles[market].color}20` : 'rgba(255,255,255,0.045)',
                    color: selectedMarket === market ? '#f5f7fb' : 'rgba(245,247,251,0.5)',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16, alignItems: 'stretch' }}>
            <div style={{
              borderRadius: 18,
              padding: 18,
              background: 'rgba(5,6,9,0.38)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{ margin: '0 0 5px', color: 'rgba(245,247,251,0.38)', fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Signal Strength
              </p>
              <p style={{ margin: '0 0 12px', color: profile.color, fontSize: 42, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>
                {profile.signal}
              </p>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${profile.signal}%`, height: '100%', borderRadius: 999, background: profile.color, boxShadow: `0 0 22px ${profile.color}66`, transition: 'width 0.45s ease' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              {marketPulse.map(({ label, value, meta, color }) => {
                const active = activePulse === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActivePulse(active ? 'All' : label)}
                    className="glass"
                    style={{
                      textAlign: 'left',
                      borderRadius: 18,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      border: active ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.09)',
                      background: active ? `linear-gradient(180deg, ${color}16, rgba(255,255,255,0.035))` : undefined,
                      transition: 'transform 0.25s, border-color 0.25s, background 0.25s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  >
                    <span style={{ display: 'block', color: 'rgba(245,247,251,0.38)', fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 }}>
                      {label}
                    </span>
                    <span style={{ display: 'block', color, fontSize: label === 'Demand Driver' ? 18 : 24, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 4 }}>
                      {value}
                    </span>
                    <span style={{ color: 'rgba(245,247,251,0.46)', fontSize: 12, fontWeight: 600 }}>
                      {meta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signal filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[{ label: 'Selected Market', value: selectedMarket, meta: profile.demandDriver, color: profile.color }, { label: 'Portfolio Exposure', value: String(PROPERTIES.filter(p => p.tag === selectedMarket).length), meta: 'Assets in this lens', color: '#9fb8ff' }, { label: 'Pulse Filter', value: activePulse, meta: 'Click below to refine dispatches', color: '#5ee0a1' }].map(({ label, value, meta, color }) => {
            const active = activePulse === label;
            return (
              <div
                key={label}
                className="glass"
                style={{
                  textAlign: 'left',
                  borderRadius: 18,
                  padding: '18px 20px',
                  border: active ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.09)',
                  background: active ? `linear-gradient(180deg, ${color}16, rgba(255,255,255,0.035))` : undefined,
                }}
              >
                <span style={{ display: 'block', color: 'rgba(245,247,251,0.38)', fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {label}
                </span>
                <span style={{ display: 'block', color, fontSize: 24, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 4 }}>
                  {value}
                </span>
                <span style={{ color: 'rgba(245,247,251,0.46)', fontSize: 12, fontWeight: 600 }}>
                  {meta}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['All', 'Rent Growth', 'Market Intel', 'Capital Markets', 'Valuation'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActivePulse(tag)}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 999,
                padding: '8px 14px',
                background: activePulse === tag ? 'rgba(94,224,161,0.14)' : 'rgba(255,255,255,0.045)',
                color: activePulse === tag ? '#9ff0c4' : 'rgba(245,247,251,0.48)',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Charts row */}
        <div className="glass" style={{ borderRadius: 24, padding: 18, marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', padding: '4px 6px 18px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', color: '#f5f7fb', fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>Market Dashboard</h2>
              <p style={{ margin: 0, color: 'rgba(245,247,251,0.42)', fontSize: 12 }}>Active lens: {selectedMarket} · {activePulse}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Base', 'Upside', 'Stress'].map((mode) => (
                <span key={mode} style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: mode === 'Base' ? 'rgba(159,184,255,0.15)' : 'rgba(255,255,255,0.045)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: mode === 'Base' ? '#c4d4ff' : 'rgba(245,247,251,0.38)',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                }}>{mode}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20 }}>
          <div className="glass" style={{ borderRadius: 20, padding: '24px 24px 14px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#f5f7fb' }}>Median Rent Trend</h3>
            <p style={{ margin: '0 0 20px', color: 'rgba(245,247,251,0.4)', fontSize: 12 }}>Northeast multifamily 2BR, $/mo</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={adjustedTrends}>
                <defs>
                  <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5ee0a1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5ee0a1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgba(245,247,251,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${v.toLocaleString()}`} tick={{ fill: 'rgba(245,247,251,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Median Rent']}
                  contentStyle={{ background: '#0c0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }}
                  labelStyle={{ color: 'rgba(245,247,251,0.6)' }}
                  itemStyle={{ color: '#f5f7fb' }}
                />
                <Area type="monotone" dataKey="rent" stroke="#5ee0a1" fill="url(#gr)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass" style={{ borderRadius: 20, padding: '24px 24px 14px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#f5f7fb' }}>Cap Rates by Market</h3>
            <p style={{ margin: '0 0 20px', color: 'rgba(245,247,251,0.4)', fontSize: 12 }}>Current going-in cap rate ranges</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={adjustedCapRates} barCategoryGap="35%">
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="market" tick={{ fill: 'rgba(245,247,251,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fill: 'rgba(245,247,251,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[3, 8]} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, 'Cap Rate']}
                  contentStyle={{ background: '#0c0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }}
                  labelStyle={{ color: 'rgba(245,247,251,0.6)' }}
                  itemStyle={{ color: '#f5f7fb' }}
                />
                <Bar dataKey="cap" fill="#9fb8ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>

        {/* Portfolio IRR comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20, marginBottom: 40 }}>
          <div className="glass" style={{ borderRadius: 22, padding: 22 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 900, color: '#f5f7fb' }}>Opportunity Radar</h3>
            <p style={{ margin: '0 0 16px', color: 'rgba(245,247,251,0.42)', fontSize: 12 }}>{selectedMarket} relative signal stack</p>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={opportunityRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.09)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(245,247,251,0.46)', fontSize: 11 }} />
                <Radar dataKey="value" stroke={profile.color} fill={profile.color} fillOpacity={0.22} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass" style={{ borderRadius: 22, padding: 22 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 900, color: '#f5f7fb' }}>What Changed This Month?</h3>
            <p style={{ margin: '0 0 16px', color: 'rgba(245,247,251,0.42)', fontSize: 12 }}>Signals the acquisition desk would re-underwrite today</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                ['Rent momentum', `${selectedMarket} rent growth printed at ${profile.rentGrowth}, keeping mark-to-market upside active.`],
                ['Vacancy read', `Vacancy sits near ${profile.vacancy}, supporting a ${profile.signal}/100 pulse score.`],
                ['Demand driver', `${profile.demandDriver} remains the primary underwriting catalyst.`],
                ['Supply pressure', `${profile.supplyPressure} supply pressure informs renovation timing and lease-up risk.`],
              ].map(([label, body]) => (
                <div key={label} style={{ borderRadius: 16, padding: 14, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ margin: '0 0 4px', color: profile.color, fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ margin: 0, color: 'rgba(245,247,251,0.62)', fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio IRR comparison */}
        <div className="glass" style={{ borderRadius: 20, padding: '24px 26px', marginBottom: 40 }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#f5f7fb' }}>Portfolio — Projected Returns by Property</h3>
          <p style={{ margin: '0 0 20px', color: 'rgba(245,247,251,0.4)', fontSize: 12 }}>Asking price vs. price per unit across active pipeline</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  {['Property', 'Location', 'Units', 'Asking Price', 'Per Unit', 'Cap Rate In', 'Target IRR', 'Score'].map(h => (
                    <th key={h} style={{ padding: '0 12px 12px 0', textAlign: 'left', color: 'rgba(245,247,251,0.36)', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROPERTIES.map(p => (
                  <tr key={p.id}>
                    {[
                      <span style={{ color: '#f5f7fb', fontWeight: 700 }}>{p.name}</span>,
                      <span style={{ color: 'rgba(245,247,251,0.5)' }}>{p.location}</span>,
                      <span style={{ color: '#d6b66a', fontWeight: 700 }}>{p.units}</span>,
                      <span style={{ color: '#f5f7fb', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(p.askingPrice)}</span>,
                      <span style={{ color: '#f5f7fb', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(p.pricePerUnit)}</span>,
                      <span style={{ color: '#9fb8ff', fontWeight: 700 }}>{p.financials.capRateIn}%</span>,
                      <span style={{ color: '#5ee0a1', fontWeight: 700 }}>{p.irr}</span>,
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 999,
                        background: p.score >= 90 ? 'rgba(94,224,161,0.15)' : 'rgba(159,184,255,0.12)',
                        color: p.score >= 90 ? '#5ee0a1' : '#9fb8ff', fontWeight: 800, fontSize: 12,
                      }}>{p.score}</span>,
                    ].map((cell, i) => (
                      <td key={i} style={{ padding: '13px 12px 13px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight articles */}
        <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 800, color: '#f5f7fb', letterSpacing: '-0.02em' }}>
          Market Dispatches
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filteredInsights.map(({ icon: Icon, color, tag, title, body, date }) => (
            <div key={title} className="glass" style={{ borderRadius: 20, padding: '24px 26px', cursor: 'pointer', transition: 'transform 0.3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: `${color}18`, border: `1px solid ${color}28`,
                  borderRadius: 999, padding: '4px 12px',
                }}>
                  <Icon size={11} color={color} />
                  <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tag}</span>
                </div>
                <span style={{ color: 'rgba(245,247,251,0.32)', fontSize: 11 }}>{date}</span>
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: '#f5f7fb', lineHeight: 1.3 }}>{title}</h3>
              <p style={{ margin: 0, color: 'rgba(245,247,251,0.54)', fontSize: 13, lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
