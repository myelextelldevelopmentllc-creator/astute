import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="section py-16 border-t hairline mt-20">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-black text-2xl tracking-[-0.04em]">
            ASTUTE<span className="accent">.</span>
          </div>
          <p className="muted mt-3 max-w-md text-sm">
            Real estate private equity intelligence for value-add multifamily
            underwriting, portfolio review, and capital strategy.
          </p>
        </div>
        <div className="flex gap-8 text-xs uppercase tracking-widest muted">
          <Link to="/strategy">Strategy</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/insights">Insights</Link>
        </div>
      </div>
      <p className="muted2 text-xs mt-10">
        Educational use only. Not investment advice or an offer to sell securities.
      </p>
    </footer>
  );
}
