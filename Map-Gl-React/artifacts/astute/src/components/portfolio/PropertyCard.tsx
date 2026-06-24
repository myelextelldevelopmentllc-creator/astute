import { Link } from 'react-router-dom';
import { TrendingUp, Building2, ArrowRight } from 'lucide-react';
import type { Property } from '../../lib/portfolioData';
import { fmtCurrency } from '../../lib/portfolioData';

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <Link
      to={`/portfolio/${p.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        className="glass"
        style={{
          borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 40px 100px rgba(79,114,255,0.14)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = '';
        }}
      >
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(5,6,9,0.9) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(79,114,255,0.18)', border: '1px solid rgba(79,114,255,0.35)',
            borderRadius: 999, padding: '3px 11px', fontSize: 10, fontWeight: 700,
            color: '#9fb8ff', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {p.tag}
          </div>
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(5,6,9,0.72)', borderRadius: 999, padding: '4px 12px',
            fontSize: 13, fontWeight: 800, color: '#f5f7fb',
          }}>
            {p.score}
          </div>
        </div>

        <div style={{ padding: '18px 20px 20px' }}>
          <p style={{ margin: '0 0 4px', color: 'rgba(245,247,251,0.46)', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>
            {p.type}
          </p>
          <h3 style={{ margin: '0 0 14px', color: '#f5f7fb', fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>
            {p.name}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
            {[
              { label: 'Price', value: fmtCurrency(p.askingPrice), icon: null },
              { label: 'Per Unit', value: fmtCurrency(p.pricePerUnit), icon: null },
              { label: 'Units', value: String(p.units), icon: Building2 },
              { label: 'IRR', value: p.irr, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px',
              }}>
                <p style={{ margin: '0 0 4px', color: 'rgba(245,247,251,0.42)', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {Icon && <Icon size={12} color="#9fb8ff" />}
                  <span style={{ color: '#f5f7fb', fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: '#9fb8ff', fontSize: 12, fontWeight: 700,
          }}>
            <span>View deal memo</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
