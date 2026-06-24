import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { fmtCurrency, type Property } from '../../lib/portfolioData';

function Metric({ l, v, gold }: { l: string; v: string | number; gold?: boolean }) {
  return (
    <div>
      <div className={`metric font-bold text-sm ${gold ? 'gold' : ''}`}>{v}</div>
      <div className="muted2 text-[10px] mt-1 uppercase tracking-widest">{l}</div>
    </div>
  );
}

export default function PropertyCard({ property: p }: { property: Property }) {
  return (
    <Link
      to={`/portfolio/${p.id}`}
      className="group glass rounded-[2rem] overflow-hidden block hover:-translate-y-1 transition duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-transparent to-transparent" />
        <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest gold">
          {p.tag}
        </div>
        <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">
          Score {p.score}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 muted2 text-xs uppercase tracking-widest">
          <MapPin size={13} />
          {p.location}
        </div>
        <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] group-hover:accent transition">
          {p.name}
        </h3>
        <p className="muted text-sm mt-1">{p.type}</p>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t hairline">
          <Metric l="Basis" v={fmtCurrency(p.askingPrice)} />
          <Metric l="Units" v={p.units} />
          <Metric l="IRR" v={p.irr} gold />
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-bold accent">
          View underwriting <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
}
