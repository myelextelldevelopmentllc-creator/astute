import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Map, Lightbulb, Target, Home } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/portfolio', label: 'Portfolio', icon: Map },
  { to: '/strategy', label: 'Strategy', icon: Target },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(5,6,9,0.72)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 40 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #4f72ff 0%, #a78bfa 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(79,114,255,0.4)',
          }}>
            <BarChart2 size={18} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ color: '#f5f7fb', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
            Astute
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', transition: '0.2s',
                  background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: active ? '#f5f7fb' : 'rgba(245,247,251,0.5)',
                }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 999, padding: '5px 14px',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5ee0a1', boxShadow: '0 0 8px #5ee0a1' }} />
          <span style={{ fontSize: 11, color: 'rgba(245,247,251,0.55)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live</span>
        </div>
      </nav>
    </header>
  );
}
