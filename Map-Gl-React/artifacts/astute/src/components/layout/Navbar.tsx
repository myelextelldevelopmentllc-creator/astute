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
      <Link to="/" className="nav-brand">
        <div className="nav-brand-mark">
          <BarChart2 size={18} color="#030814" strokeWidth={2.7} />
        </div>
        <span>Astute</span>
      </Link>

      <div className="nav-link-row">
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className="nav-link"
              data-active={active}
            >
              <Icon size={14} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <LiquidGlassButton
        onClick={openCommand}
        tone="blue"
        className="nav-command"
        style={{ height: 38, padding: '0 13px', whiteSpace: 'nowrap' }}
        aria-label="Open command palette"
      >
        <Command size={13} />
        <span>⌘K</span>
      </LiquidGlassButton>
    </GlassDockNav>
  );
}
