import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { PROPERTIES, fmtCurrency } from '../lib/portfolioData';
import AnalyticsCharts from '../components/property/AnalyticsCharts';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const p = PROPERTIES.find(x => x.id === id);

  if (!p) return <Navigate to="/portfolio" />;

  const f = p.financials;

  return (
    <div style={{ padding: '40px 24px 80px' }}>
      <div className="section">
        {/* Back */}
        <Link to="/portfolio" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'rgba(245,247,251,0.48)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          marginBottom: 32,
        }}>
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>

        {/* Hero */}
        <div className="glass" style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ position: 'relative', height: 320 }}>
            <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,6,9,0.95) 0%, rgba(5,6,9,0.3) 60%)' }} />
            <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <span style={{
                  display: 'inline-block', background: 'rgba(79,114,255,0.18)', border: '1px solid rgba(79,114,255,0.35)',
                  borderRadius: 999, padding: '4px 12px', fontSize: 10, fontWeight: 700,
                  color: '#9fb8ff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10,
                }}>
                  {p.tag}
                </span>
                <h1 style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#f5f7fb', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                  {p.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'rgba(245,247,251,0.5)', fontSize: 13 }}>
                  <MapPin size={13} />
                  {p.address}
                </div>
              </div>
              <div style={{
                background: 'rgba(94,224,161,0.15)', border: '1px solid rgba(94,224,161,0.3)',
                borderRadius: 16, padding: '12px 20px', textAlign: 'center',
              }}>
                <p style={{ margin: '0 0 2px', color: 'rgba(245,247,251,0.4)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Score</p>
                <p style={{ margin: 0, color: '#5ee0a1', fontSize: 32, fontWeight: 900 }}>{p.score}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Asking Price', value: fmtCurrency(p.askingPrice), color: '#f5f7fb' },
            { label: 'Price Per Unit', value: fmtCurrency(p.pricePerUnit), color: '#f5f7fb' },
            { label: 'Units', value: String(p.units), color: '#d6b66a' },
            { label: 'Sqft', value: p.sqft.toLocaleString(), color: '#f5f7fb' },
            { label: 'Year Built', value: String(p.yearBuilt), color: '#f5f7fb' },
            { label: 'Target IRR', value: p.irr, color: '#5ee0a1' },
            { label: 'Cap Rate In', value: `${f.capRateIn}%`, color: '#9fb8ff' },
            { label: 'Hold Period', value: f.holdPeriod, color: '#f5f7fb' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass" style={{ borderRadius: 16, padding: '16px 18px' }}>
              <p style={{ margin: '0 0 6px', color: 'rgba(245,247,251,0.38)', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
              <p style={{ margin: 0, color, fontWeight: 800, fontSize: 18, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Thesis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div className="glass" style={{ borderRadius: 20, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Target size={16} color="#9fb8ff" />
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f5f7fb', letterSpacing: '0.01em' }}>Investment Thesis</h3>
            </div>
            <p style={{ margin: '0 0 20px', color: 'rgba(245,247,251,0.6)', fontSize: 14, lineHeight: 1.7 }}>{p.thesis}</p>
            <h4 style={{ margin: '0 0 10px', color: 'rgba(245,247,251,0.4)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Value Creation Plan</h4>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.valuePlan.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, color: 'rgba(245,247,251,0.65)', fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ color: '#9fb8ff', fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass" style={{ borderRadius: 20, padding: '24px 26px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <TrendingUp size={16} color="#5ee0a1" />
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f5f7fb' }}>Return Projections</h3>
              </div>
              {[
                { label: 'Projected IRR', value: f.projectedIRR, color: '#5ee0a1' },
                { label: 'Equity Multiple', value: f.equityMultiple, color: '#9fb8ff' },
                { label: 'Cap Rate Out', value: `${f.capRateOut}%`, color: '#d6b66a' },
                { label: 'Exit Price', value: fmtCurrency(f.projectedSalePrice), color: '#f5f7fb' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(245,247,251,0.48)', fontSize: 13 }}>{label}</span>
                  <span style={{ color, fontWeight: 700, fontSize: 13 }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="glass" style={{ borderRadius: 20, padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <AlertTriangle size={16} color="#d6b66a" />
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f5f7fb' }}>Risk Factors</h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.riskFactors.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, color: 'rgba(245,247,251,0.58)', fontSize: 13 }}>
                    <span style={{ color: '#d6b66a' }}>—</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="glass" style={{ borderRadius: 20, padding: '24px 26px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Building2 size={16} color="#9fb8ff" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f5f7fb' }}>Detailed Financials</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Current Monthly Rent', value: fmtCurrency(f.currentRent) },
              { label: 'Market Monthly Rent', value: fmtCurrency(f.marketRent) },
              { label: 'Monthly Expenses', value: fmtCurrency(f.monthlyExpenses) },
              { label: 'Current Annual NOI', value: fmtCurrency(f.currentNOI) },
              { label: 'Stabilized Annual NOI', value: fmtCurrency(f.stabilizedNOI) },
              { label: 'Renovation Budget', value: fmtCurrency(f.renovationBudget) },
              { label: 'Total Basis', value: fmtCurrency(f.totalBasis) },
            ].map(({ label, value }) => (
              <div key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
                <p style={{ margin: '0 0 4px', color: 'rgba(245,247,251,0.38)', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
                <p style={{ margin: 0, color: '#f5f7fb', fontWeight: 700, fontSize: 17, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 800, color: '#f5f7fb', letterSpacing: '0.01em' }}>Analytics</h3>
          <AnalyticsCharts p={p} />
        </div>

        {/* Exit */}
        <div className="glass" style={{ borderRadius: 20, padding: '24px 26px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: '#f5f7fb' }}>Exit Strategy</h3>
          <p style={{ margin: 0, color: 'rgba(245,247,251,0.6)', fontSize: 14, lineHeight: 1.7 }}>{p.exitStrategy}</p>
        </div>
      </div>
    </div>
  );
}
