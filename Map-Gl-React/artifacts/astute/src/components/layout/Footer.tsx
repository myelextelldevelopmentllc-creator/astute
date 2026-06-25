import { Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section site-footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-mark">
            <BarChart2 size={14} color="#030814" strokeWidth={2.5} />
          </div>
          <span>Astute</span>
        </div>
        <div className="footer-links">
          {[
            { to: '/portfolio', label: 'Portfolio' },
            { to: '/strategy', label: 'Strategy' },
            { to: '/insights', label: 'Insights' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </div>
        <p>
          © 2026 Astute Capital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
