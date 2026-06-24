import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

const links: [string, string][] = [
  ['Strategy', '/strategy'],
  ['Portfolio', '/portfolio'],
  ['Insights', '/insights'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const f = () => setScrolled(scrollY > 30);
    addEventListener('scroll', f);
    f();
    return () => removeEventListener('scroll', f);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition ${
        scrolled ? 'backdrop-blur-2xl border-b hairline' : 'bg-transparent'
      }`}
      style={scrolled ? { background: 'rgba(5,6,9,0.78)' } : undefined}
    >
      <div className="section h-20 flex items-center justify-between">
        <Link to="/" className="font-black tracking-[-0.04em] text-2xl">
          ASTUTE<span className="accent">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className={`text-[11px] tracking-[.2em] uppercase font-bold transition ${
                loc.pathname === path ? 'accent' : 'muted hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="glass rounded-full h-10 px-4 flex items-center gap-2 muted2 text-xs">
            <Search size={14} /> Search assets
          </div>
          <Link to="/portfolio" className="btn btn-primary">
            Terminal
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass mx-4 mb-4 rounded-3xl p-6 space-y-5">
          {([['Home', '/'], ...links] as [string, string][]).map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="block text-sm uppercase tracking-widest muted"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
