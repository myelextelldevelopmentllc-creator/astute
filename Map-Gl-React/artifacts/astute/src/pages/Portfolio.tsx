import { useMemo, useState } from 'react';
import {
  BarChart3,
  Building2,
  ChevronRight,
  DollarSign,
  LayoutGrid,
  Layers,
  Map as MapIcon,
  Scale,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { PROPERTIES, fmtCurrency, portfolioValue, totalUnits } from '../lib/portfolioData';
import type { Property } from '../lib/portfolioData';
import PropertyCard from '../components/portfolio/PropertyCard';
import MapView from '../components/portfolio/MapView';

type View = 'grid' | 'map' | 'analytics';
type SortKey = 'score' | 'price' | 'units' | 'ppu';
type OpportunityLens = 'Manual' | 'Best upside' | 'Safest yield' | 'Lowest basis' | 'Highest score';

const marketLabels = ['All', 'Westchester', 'Hudson County', 'Boston Metro'];
const opportunityLenses: OpportunityLens[] = ['Best upside', 'Safest yield', 'Lowest basis', 'Highest score'];

function parsePercentRange(value: string) {
  const nums = value.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0];
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

function MetricTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass" style={{ borderRadius: 18, padding: '18px 20px' }}>
      <p style={{ margin: '0 0 7px', color: 'rgba(245,247,251,0.38)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>{label}</p>
      <p style={{ margin: 0, color, fontSize: 24, fontWeight: 900, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
    </div>
  );
}

function AnalyticsMode({ properties }: { properties: Property[] }) {
  const allocation = useMemo(() => {
    const total = properties.reduce((sum, property) => sum + property.askingPrice, 0) || 1;
    return marketLabels.slice(1).map((market) => {
      const marketProperties = properties.filter((property) => property.tag === market);
      const value = marketProperties.reduce((sum, property) => sum + property.askingPrice, 0);
      return {
        market,
        count: marketProperties.length,
        value,
        pct: Math.round((value / total) * 100),
      };
    });
  }, [properties]);
  const topScore = [...properties].sort((a, b) => b.score - a.score)[0];
  const lowestPpu = [...properties].sort((a, b) => a.pricePerUnit - b.pricePerUnit)[0];
  const largestUnits = [...properties].sort((a, b) => b.units - a.units)[0];
  const ranking = [...properties].sort((a, b) => b.score - a.score);
  const allocationChart = allocation.map((item) => ({ name: item.market, value: item.value }));
  const chartColors = ['#9fb8ff', '#d6b66a', '#5ee0a1'];

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 14 }}>
        <MetricTile label="Top Score" value={`${topScore?.score ?? 0} · ${topScore?.name ?? 'N/A'}`} color="#5ee0a1" />
        <MetricTile label="Lowest Price / Unit" value={lowestPpu ? fmtCurrency(lowestPpu.pricePerUnit) : 'N/A'} color="#d6b66a" />
        <MetricTile label="Largest Unit Count" value={largestUnits ? `${largestUnits.units} units` : 'N/A'} color="#9fb8ff" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 20 }}>
        <div className="glass" style={{ borderRadius: 22, padding: 22 }}>
          <h2 style={{ margin: '0 0 18px', color: '#f5f7fb', fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em' }}>Allocation by Market</h2>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={allocationChart} dataKey="value" nameKey="name" innerRadius={46} outerRadius={70} paddingAngle={4}>
                {allocationChart.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => fmtCurrency(value)} contentStyle={{ background: '#0c0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gap: 16 }}>
            {allocation.map(({ market, count, value, pct }) => (
              <div key={market}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 7 }}>
                  <span style={{ color: '#f5f7fb', fontSize: 13, fontWeight: 800 }}>{market}</span>
                  <span style={{ color: 'rgba(245,247,251,0.54)', fontSize: 12, fontWeight: 700 }}>{count} assets · {fmtCurrency(value)}</span>
                </div>
                <div style={{ height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: 999,
                    background: market === 'Boston Metro' ? '#5ee0a1' : market === 'Westchester' ? '#9fb8ff' : '#d6b66a',
                    boxShadow: '0 0 22px rgba(159,184,255,0.18)',
                    transition: 'width 0.45s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 22, padding: 22, overflowX: 'auto' }}>
          <h2 style={{ margin: '0 0 18px', color: '#f5f7fb', fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em' }}>Mini Ranking</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={ranking.map((property) => ({ name: property.name.split(' ')[0], score: property.score }))}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(245,247,251,0.42)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0c0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
              <Bar dataKey="score" fill="#5ee0a1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead>
              <tr>
                {['Rank', 'Property', 'Market', 'Score', 'Cap', 'IRR', 'P/unit'].map((head) => (
                  <th key={head} style={{ padding: '0 12px 12px 0', color: 'rgba(245,247,251,0.34)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((property, index) => (
                <tr key={property.id}>
                  <td style={{ padding: '13px 12px 13px 0', color: '#9fb8ff', fontWeight: 900 }}>{index + 1}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: '#f5f7fb', fontWeight: 800 }}>{property.name}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: 'rgba(245,247,251,0.52)' }}>{property.tag}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: '#5ee0a1', fontWeight: 900 }}>{property.score}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: '#d6b66a', fontWeight: 800 }}>{property.cap}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: '#5ee0a1', fontWeight: 800 }}>{property.irr}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: '#f5f7fb', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(property.pricePerUnit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [view, setView] = useState<View>('grid');
  const [market, setMarket] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [query, setQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [lens, setLens] = useState<OpportunityLens>('Highest score');
  const [drawerProperty, setDrawerProperty] = useState<Property | null>(null);

  const visibleProperties = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROPERTIES
      .filter((property) => market === 'All' || property.tag === market)
      .filter((property) => {
        if (!q) return true;
        return [property.name, property.location, property.address, property.type, property.tag]
          .some((field) => field.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (lens === 'Best upside') return parsePercentRange(b.irr) - parsePercentRange(a.irr);
        if (lens === 'Safest yield') return b.financials.capRateIn - a.financials.capRateIn;
        if (lens === 'Lowest basis') return a.pricePerUnit - b.pricePerUnit;
        if (lens === 'Highest score') return b.score - a.score;
        if (sortKey === 'score') return b.score - a.score;
        if (sortKey === 'price') return b.askingPrice - a.askingPrice;
        if (sortKey === 'units') return b.units - a.units;
        return a.pricePerUnit - b.pricePerUnit;
      });
  }, [lens, market, query, sortKey]);

  const comparedProperties = useMemo(
    () => compareIds.map((id) => PROPERTIES.find((property) => property.id === id)).filter(Boolean) as Property[],
    [compareIds],
  );

  const toggleCompare = (property: Property) => {
    setCompareIds((current) => {
      if (current.includes(property.id)) return current.filter((id) => id !== property.id);
      if (current.length >= 2) return [current[1], property.id];
      return [...current, property.id];
    });
  };

  const visibleValue = visibleProperties.reduce((sum, property) => sum + property.askingPrice, 0);
  const visibleUnits = visibleProperties.reduce((sum, property) => sum + property.units, 0);
  const avgScore = visibleProperties.length
    ? Math.round(visibleProperties.reduce((sum, property) => sum + property.score, 0) / visibleProperties.length)
    : 0;
  const avgIrr = visibleProperties.length
    ? Math.round(visibleProperties.reduce((sum, property) => sum + parsePercentRange(property.irr), 0) / visibleProperties.length)
    : 0;

  return (
    <div>
      <div style={{ padding: '48px 24px 0' }}>
        <div className="section">
          <h1 style={{ margin: '0 0 8px', fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', color: '#f5f7fb' }}>
            Portfolio
          </h1>
          <p style={{ margin: '0 0 32px', color: 'rgba(245,247,251,0.48)', fontSize: 16 }}>
            {PROPERTIES.length} active Northeast multifamily acquisitions
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
            {[
              { label: 'Visible Value', value: fmtCurrency(visibleValue || portfolioValue), icon: DollarSign, color: '#9fb8ff' },
              { label: 'Visible Assets', value: String(visibleProperties.length), icon: Building2, color: '#d6b66a' },
              { label: 'Visible Units', value: `${visibleUnits || totalUnits}`, icon: Layers, color: '#5ee0a1' },
              { label: 'Avg IRR Signal', value: `${avgIrr || 0}%`, icon: TrendingUp, color: '#5ee0a1' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14,
                padding: '10px 18px',
              }}>
                <Icon size={14} color={color} />
                <div>
                  <p style={{ margin: 0, color: 'rgba(245,247,251,0.4)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</p>
                  <p style={{ margin: 0, color: '#f5f7fb', fontWeight: 800, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ borderRadius: 22, padding: 18, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <SlidersHorizontal size={15} color="#9fb8ff" />
              <p style={{ margin: 0, color: '#f5f7fb', fontSize: 13, fontWeight: 900 }}>Portfolio Console</p>
              <span style={{ marginLeft: 'auto', color: avgScore >= 88 ? '#5ee0a1' : '#d6b66a', fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Signal {avgScore}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto', gap: 14, alignItems: 'center' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                height: 42,
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                padding: '0 13px',
              }}>
                <Search size={15} color="rgba(245,247,251,0.42)" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search property, location, or type"
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: '#f5f7fb',
                    fontWeight: 700,
                  }}
                />
              </label>

              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: 4 }}>
                {([
                  ['grid', 'Grid', LayoutGrid],
                  ['map', 'Map', MapIcon],
                  ['analytics', 'Analytics', BarChart3],
                ] as const).map(([mode, label, Icon]) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      border: 'none',
                      borderRadius: 10,
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: '0.2s',
                      background: view === mode ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: view === mode ? '#f5f7fb' : 'rgba(245,247,251,0.44)',
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
              {opportunityLenses.map((label) => (
                <button
                  key={label}
                  onClick={() => setLens(label)}
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    padding: '8px 13px',
                    background: lens === label ? 'rgba(214,182,106,0.16)' : 'rgba(255,255,255,0.045)',
                    color: lens === label ? '#ead08f' : 'rgba(245,247,251,0.48)',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
              {marketLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => setMarket(label)}
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    padding: '8px 13px',
                    background: market === label ? 'rgba(159,184,255,0.17)' : 'rgba(255,255,255,0.045)',
                    color: market === label ? '#c4d4ff' : 'rgba(245,247,251,0.48)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
              <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
              {([
                ['score', 'Score'],
                ['price', 'Asking Price'],
                ['units', 'Units'],
                ['ppu', 'Price / Unit'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setLens('Manual');
                    setSortKey(key);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    padding: '8px 13px',
                    background: sortKey === key ? 'rgba(94,224,161,0.14)' : 'rgba(255,255,255,0.045)',
                    color: sortKey === key ? '#9ff0c4' : 'rgba(245,247,251,0.48)',
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
      </div>

      <div className="section" style={{ paddingBottom: 120 }}>
        {view === 'map' && <MapView properties={visibleProperties} />}
        {view === 'analytics' && <AnalyticsMode properties={visibleProperties} />}
        {view === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {visibleProperties.map((property) => {
              const selected = compareIds.includes(property.id);
              return (
                <div key={property.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => toggleCompare(property)}
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      zIndex: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      border: selected ? '1px solid rgba(94,224,161,0.55)' : '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 999,
                      padding: '6px 10px',
                      background: selected ? 'rgba(94,224,161,0.18)' : 'rgba(5,6,9,0.62)',
                      color: selected ? '#9ff0c4' : 'rgba(245,247,251,0.74)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      fontSize: 10,
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    <Scale size={11} />
                    {selected ? 'Selected' : 'Compare'}
                  </button>
                  <button
                    onClick={() => setDrawerProperty(property)}
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      zIndex: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 999,
                      padding: '6px 10px',
                      background: 'rgba(5,6,9,0.62)',
                      color: 'rgba(245,247,251,0.78)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      fontSize: 10,
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    Inspect <ChevronRight size={11} />
                  </button>
                  <PropertyCard p={property} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {comparedProperties.length > 0 && (
        <div style={{
          position: 'fixed',
          left: '50%',
          bottom: 18,
          transform: 'translateX(-50%)',
          zIndex: 60,
          width: 'min(920px, calc(100vw - 32px))',
          borderRadius: 22,
          background: 'rgba(5,6,9,0.76)',
          border: '1px solid rgba(255,255,255,0.13)',
          backdropFilter: 'blur(34px)',
          WebkitBackdropFilter: 'blur(34px)',
          boxShadow: '0 30px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Scale size={16} color="#9fb8ff" />
            <p style={{ margin: 0, color: '#f5f7fb', fontSize: 13, fontWeight: 900 }}>Deal Comparison Tray</p>
            <span style={{ color: 'rgba(245,247,251,0.42)', fontSize: 11, fontWeight: 700 }}>Select up to 2 assets</span>
            <button
              onClick={() => setCompareIds([])}
              style={{ marginLeft: 'auto', border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(245,247,251,0.66)', borderRadius: 999, width: 28, height: 28, cursor: 'pointer' }}
              aria-label="Clear comparison"
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, comparedProperties.length)}, minmax(0, 1fr))`, gap: 12 }}>
            {comparedProperties.map((property) => (
              <div key={property.id} style={{ borderRadius: 16, padding: 14, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ margin: '0 0 10px', color: '#f5f7fb', fontSize: 13, fontWeight: 900 }}>{property.name}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }}>
                  {[
                    ['Price', fmtCurrency(property.askingPrice), '#f5f7fb'],
                    ['Units', String(property.units), '#d6b66a'],
                    ['Cap', property.cap, '#9fb8ff'],
                    ['IRR', property.irr, '#5ee0a1'],
                    ['Score', String(property.score), '#5ee0a1'],
                  ].map(([label, value, color]) => (
                    <div key={label}>
                      <p style={{ margin: '0 0 3px', color: 'rgba(245,247,251,0.35)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>{label}</p>
                      <p style={{ margin: 0, color, fontSize: 13, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {drawerProperty && (
        <div
          onMouseDown={() => setDrawerProperty(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
          <aside
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              bottom: 18,
              width: 'min(440px, calc(100vw - 36px))',
              borderRadius: 28,
              background: 'linear-gradient(145deg, rgba(10,13,20,0.88), rgba(255,255,255,0.055))',
              border: '1px solid rgba(255,255,255,0.13)',
              boxShadow: '0 50px 160px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.12)',
              backdropFilter: 'blur(34px)',
              WebkitBackdropFilter: 'blur(34px)',
              padding: 22,
              overflowY: 'auto',
            }}
          >
            <button onClick={() => setDrawerProperty(null)} style={{ float: 'right', border: 0, background: 'rgba(255,255,255,0.08)', color: '#f5f7fb', borderRadius: 999, width: 32, height: 32, cursor: 'pointer' }}>
              <X size={15} />
            </button>
            <p style={{ margin: '0 0 8px', color: '#9fb8ff', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{drawerProperty.tag}</p>
            <h2 style={{ margin: '0 0 10px', color: '#f5f7fb', fontSize: 26, fontWeight: 900, letterSpacing: '-0.035em' }}>{drawerProperty.name}</h2>
            <p style={{ margin: '0 0 20px', color: 'rgba(245,247,251,0.52)', fontSize: 13, lineHeight: 1.65 }}>{drawerProperty.thesis}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[
                ['Price', fmtCurrency(drawerProperty.askingPrice), '#f5f7fb'],
                ['Units', String(drawerProperty.units), '#d6b66a'],
                ['Cap Rate', drawerProperty.cap, '#9fb8ff'],
                ['Target IRR', drawerProperty.irr, '#5ee0a1'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ borderRadius: 16, padding: 13, background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ margin: '0 0 4px', color: 'rgba(245,247,251,0.36)', fontSize: 9, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ margin: 0, color, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <h3 style={{ margin: '0 0 10px', color: '#f5f7fb', fontSize: 14, fontWeight: 900 }}>Value-Add Plan</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {drawerProperty.valuePlan.map((item, index) => (
                <div key={item} style={{ display: 'flex', gap: 10, color: 'rgba(245,247,251,0.62)', fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ color: '#5ee0a1', fontWeight: 900 }}>{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
