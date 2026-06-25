import { Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(243,231,208,0.10)',
      background: 'linear-gradient(180deg, rgba(5,16,31,0.28), #030814)',
      marginTop: 80,
    }}>
      <div className="section" style={{ paddingTop: 40, paddingBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #4F8CFF 0%, #DCC8A3 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={14} color="#030814" strokeWidth={2.5} />
          </div>
          <span style={{ color: '#F6F0E4', fontWeight: 700, fontSize: 14 }}>Astute</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { to: '/portfolio', label: 'Portfolio' },
            { to: '/strategy', label: 'Strategy' },
            { to: '/insights', label: 'Insights' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ color: 'rgba(246,240,228,0.4)', fontSize: 12, textDecoration: 'none', transition: '0.2s' }}>
              {label}
            </Link>
          ))}
        </div>
        <p style={{ color: 'rgba(246,240,228,0.3)', fontSize: 11, margin: 0 }}>
          © 2026 Astute Capital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
