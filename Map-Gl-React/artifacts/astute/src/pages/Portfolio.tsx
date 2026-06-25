import { useMemo, useState } from 'react';
import { PROPERTIES, portfolioValue, totalUnits, fmtCurrency } from '../lib/portfolioData';
import PropertyCard from '../components/portfolio/PropertyCard';
import MapView from '../components/portfolio/MapView';
import { LayoutGrid, Map, TrendingUp, Building2, Layers, DollarSign, Radar, SlidersHorizontal } from 'lucide-react';

type View = 'grid' | 'map';
type SortKey = 'score' | 'price' | 'units' | 'market';

export default function Portfolio() {
  const [view, setView] = useState<View>('grid');
  const [market, setMarket] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const avgIRR = '18–26%';
  const markets = useMemo(() => ['All', ...Array.from(new Set(PROPERTIES.map(p => p.tag)))], []);
  const highestScore = useMemo(() => [...PROPERTIES].sort((a, b) => b.score - a.score)[0], []);
  const strongestMarket = useMemo(() => {
    const grouped = PROPERTIES.reduce<Record<string, { score: number; count: number; units: number }>>((acc, p) => {
      acc[p.tag] ??= { score: 0, count: 0, units: 0 };
      acc[p.tag].score += p.score;
      acc[p.tag].count += 1;
      acc[p.tag].units += p.units;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, m]) => ({ name, avgScore: Math.round(m.score / m.count), units: m.units }))
      .sort((a, b) => b.avgScore - a.avgScore)[0];
  }, []);
  const visibleProperties = useMemo(() => {
    const filtered = market === 'All' ? PROPERTIES : PROPERTIES.filter(p => p.tag === market);
    return [...filtered].sort((a, b) => {
      if (sortKey === 'score') return b.score - a.score;
      if (sortKey === 'price') return b.askingPrice - a.askingPrice;
      if (sortKey === 'units') return b.units - a.units;
      return a.tag.localeCompare(b.tag) || b.score - a.score;
    });
  }, [market, sortKey]);

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '48px 24px 0' }}>
        <div className="section">
          <h1 style={{ margin: '0 0 8px', fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', color: '#f5f7fb' }}>
            Portfolio
          </h1>
          <p style={{ margin: '0 0 32px', color: 'rgba(245,247,251,0.48)', fontSize: 16 }}>
            {PROPERTIES.length} active Northeast multifamily acquisitions
          </p>

          {/* Summary stats */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
            {[
              { label: 'Total Value', value: fmtCurrency(portfolioValue), icon: DollarSign, color: '#9fb8ff' },
              { label: 'Properties', value: String(PROPERTIES.length), icon: Building2, color: '#d6b66a' },
              { label: 'Total Units', value: String(totalUnits), icon: Layers, color: '#5ee0a1' },
              { label: 'Target IRR', value: avgIRR, icon: TrendingUp, color: '#ff6b7a' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14, padding: '10px 18px',
              }}>
                <Icon size={14} color={color} />
                <div>
                  <p style={{ margin: 0, color: 'rgba(245,247,251,0.4)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</p>
                  <p style={{ margin: 0, color: '#f5f7fb', fontWeight: 700, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20, alignItems: 'stretch', marginBottom: 28 }}>
            <div className="glass" style={{ borderRadius: 20, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <SlidersHorizontal size={15} color="#9fb8ff" />
                <p style={{ margin: 0, color: '#f5f7fb', fontSize: 13, fontWeight: 800 }}>Portfolio Controls</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <div style={{
                  display: 'inline-flex', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: 4,
                }}>
                  {([['grid', 'Grid', LayoutGrid], ['map', 'Map', Map]] as const).map(([v, label, Icon]) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        border: 'none', borderRadius: 10, padding: '7px 16px',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: '0.2s',
                        background: view === v ? 'rgba(255,255,255,0.12)' : 'transparent',
                        color: view === v ? '#f5f7fb' : 'rgba(245,247,251,0.44)',
                      }}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
                <select
                  value={market}
                  onChange={e => setMarket(e.target.value)}
                  style={{
                    height: 38,
                    minWidth: 160,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#f5f7fb',
                    padding: '0 12px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                >
                  {markets.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
                  {([
                    ['score', 'Score'],
                    ['price', 'Price'],
                    ['units', 'Units'],
                    ['market', 'Market'],
                  ] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSortKey(key)}
                      style={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 999,
                        padding: '8px 13px',
                        background: sortKey === key ? 'rgba(159,184,255,0.17)' : 'rgba(255,255,255,0.045)',
                        color: sortKey === key ? '#c4d4ff' : 'rgba(245,247,251,0.48)',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 20, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 20%, rgba(94,224,161,0.12), transparent 45%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Radar size={16} color="#5ee0a1" />
                  <p style={{ margin: 0, color: '#f5f7fb', fontSize: 13, fontWeight: 800 }}>Portfolio Radar</p>
                </div>
                {[
                  { label: 'Strongest Market', value: `${strongestMarket.name} · ${strongestMarket.avgScore}` },
                  { label: 'Highest Score', value: `${highestScore.name} · ${highestScore.score}` },
                  { label: 'Visible Units', value: `${visibleProperties.reduce((s, p) => s + p.units, 0)} of ${totalUnits}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'rgba(245,247,251,0.38)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
                    <span style={{ color: '#f5f7fb', fontSize: 12, fontWeight: 800, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section" style={{ paddingBottom: 80 }}>
        {view === 'map' ? (
          <MapView properties={visibleProperties} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {visibleProperties.map(p => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
