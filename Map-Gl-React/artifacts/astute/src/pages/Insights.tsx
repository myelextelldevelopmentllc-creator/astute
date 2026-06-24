import { TrendingUp, MapPin, Zap, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
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

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
          <div className="glass" style={{ borderRadius: 20, padding: '24px 24px 14px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#f5f7fb' }}>Median Rent Trend</h3>
            <p style={{ margin: '0 0 20px', color: 'rgba(245,247,251,0.4)', fontSize: 12 }}>Northeast multifamily 2BR, $/mo</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={marketTrends}>
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
              <BarChart data={capRateData} barCategoryGap="35%">
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
          {insights.map(({ icon: Icon, color, tag, title, body, date }) => (
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
