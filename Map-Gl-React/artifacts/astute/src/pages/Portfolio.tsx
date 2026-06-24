import { useState } from 'react';
import { PROPERTIES, portfolioValue, totalUnits, fmtCurrency } from '../lib/portfolioData';
import PropertyCard from '../components/portfolio/PropertyCard';
import MapView from '../components/portfolio/MapView';
import { LayoutGrid, Map, TrendingUp, Building2, Layers, DollarSign } from 'lucide-react';

type View = 'grid' | 'map';

export default function Portfolio() {
  const [view, setView] = useState<View>('grid');
  const avgIRR = '18–26%';

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

          {/* View toggle */}
          <div style={{
            display: 'inline-flex', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: 4,
            marginBottom: 28,
          }}>
            {([['grid', 'Grid', LayoutGrid], ['map', 'Map', Map]] as const).map(([v, label, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  border: 'none', borderRadius: 10, padding: '7px 18px',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: '0.2s',
                  background: view === v ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: view === v ? '#f5f7fb' : 'rgba(245,247,251,0.44)',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section" style={{ paddingBottom: 80 }}>
        {view === 'map' ? (
          <MapView properties={PROPERTIES} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {PROPERTIES.map(p => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
