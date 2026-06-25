import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import type { Property } from '../../lib/portfolioData';
import { fmtCurrency } from '../../lib/portfolioData';

export default function AnalyticsCharts({ p }: { p: Property }) {
  const rentData = [
    { label: 'Current', value: p.financials.currentRent },
    { label: 'Market', value: p.financials.marketRent },
  ];

  const holdYears = parseInt(p.financials.holdPeriod) || 5;
  const irrLow = parseFloat(p.financials.projectedIRR) / 100;
  const growthData = Array.from({ length: holdYears + 1 }, (_, i) => ({
    year: `Y${i}`,
    value: Math.round(p.askingPrice * Math.pow(1 + irrLow, i)),
  }));

  const noiData = [
    { label: 'Current NOI', value: p.financials.currentNOI },
    { label: 'Stabilized NOI', value: p.financials.stabilizedNOI },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      {/* Rent Bridge */}
      <div className="glass" style={{ borderRadius: 18, padding: '20px 20px 10px' }}>
        <p style={{ margin: '0 0 16px', color: 'rgba(246,240,228,0.42)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
          Rent Bridge
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={rentData} barCategoryGap="30%">
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number) => [fmtCurrency(v), 'Monthly Rent']}
              contentStyle={{ background: '#061426', border: '1px solid rgba(243,231,208,0.12)', borderRadius: 12 }}
              labelStyle={{ color: 'rgba(246,240,228,0.6)' }}
              itemStyle={{ color: '#F6F0E4' }}
            />
            <Bar dataKey="value" fill="#8DB7FF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Value Growth */}
      <div className="glass" style={{ borderRadius: 18, padding: '20px 20px 10px' }}>
        <p style={{ margin: '0 0 16px', color: 'rgba(246,240,228,0.42)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
          Projected Value Growth
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8DB7FF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8DB7FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number) => [fmtCurrency(v), 'Value']}
              contentStyle={{ background: '#061426', border: '1px solid rgba(243,231,208,0.12)', borderRadius: 12 }}
              labelStyle={{ color: 'rgba(246,240,228,0.6)' }}
              itemStyle={{ color: '#F6F0E4' }}
            />
            <Area type="monotone" dataKey="value" stroke="#8DB7FF" fill="url(#gv)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* NOI Upside */}
      <div className="glass" style={{ borderRadius: 18, padding: '20px 20px 10px' }}>
        <p style={{ margin: '0 0 16px', color: 'rgba(246,240,228,0.42)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
          NOI Upside
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={noiData} barCategoryGap="30%">
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: 'rgba(246,240,228,0.42)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number) => [fmtCurrency(v), 'Annual NOI']}
              contentStyle={{ background: '#061426', border: '1px solid rgba(243,231,208,0.12)', borderRadius: 12 }}
              labelStyle={{ color: 'rgba(246,240,228,0.6)' }}
              itemStyle={{ color: '#F6F0E4' }}
            />
            <Bar dataKey="value" fill="#63CFA6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
