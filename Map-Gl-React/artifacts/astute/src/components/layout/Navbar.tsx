import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Command, Home, Lightbulb, Map, Target } from 'lucide-react';
import GlassDockNav from '../glass/GlassDockNav';
import LiquidGlassButton from '../glass/LiquidGlassButton';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/portfolio', label: 'Portfolio', icon: Map },
  { to: '/strategy', label: 'Strategy', icon: Target },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const openCommand = () => {
    window.dispatchEvent(new Event('astute-command-open'));
  };

  return (
    <GlassDockNav>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '0 8px 0 4px' }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 13,
          background: 'linear-gradient(135deg, rgba(79,140,255,0.95), rgba(243,231,208,0.72))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(79,140,255,0.38), inset 0 1px 0 rgba(255,255,255,0.36)',
        }}>
          <BarChart2 size={18} color="#030814" strokeWidth={2.7} />
        </div>
        <span style={{ color: '#F6F0E4', fontWeight: 900, fontSize: 17, letterSpacing: '-0.025em' }}>
          Astute
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 13px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                textDecoration: 'none',
                transition: '0.22s',
                background: active ? 'linear-gradient(135deg, rgba(79,140,255,0.18), rgba(243,231,208,0.10))' : 'transparent',
                color: active ? '#F3E7D0' : 'rgba(246,240,228,0.52)',
                boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.10)' : undefined,
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </div>

      <LiquidGlassButton
        onClick={openCommand}
        tone="blue"
        style={{ height: 38, padding: '0 13px', whiteSpace: 'nowrap' }}
        aria-label="Open command palette"
      >
        <Command size={13} />
        <span>⌘K</span>
      </LiquidGlassButton>
    </GlassDockNav>
  );
}
