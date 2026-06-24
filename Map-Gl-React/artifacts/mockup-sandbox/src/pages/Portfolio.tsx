import { useState } from 'react';
import { Map, List } from 'lucide-react';
import { PROPERTIES, portfolioValue, totalUnits, fmtCurrency } from '../lib/portfolioData';
import PropertyCard from '../components/portfolio/PropertyCard';
import MapView from '../components/portfolio/MapView';

function Stat({ l, v }: { l: string; v: string | number }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="metric text-3xl font-black tracking-[-0.04em]">{v}</div>
      <div className="muted2 text-[10px] uppercase tracking-widest mt-2">{l}</div>
    </div>
  );
}

export default function Portfolio() {
  const [view, setView] = useState<'grid' | 'map'>('grid');

  return (
    <section className="section pt-36 pb-20">
      <p className="gold uppercase tracking-[.28em] text-xs font-black">Live portfolio terminal</p>
      <div className="flex items-end justify-between mt-4 gap-4 flex-wrap">
        <h1 className="text-5xl md:text-7xl font-black tracking-[-0.07em]">
          Assets under review.
        </h1>

        {/* View toggle */}
        <div className="glass rounded-2xl p-1 flex gap-1 shrink-0">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition ${
              view === 'grid' ? 'bg-white/10 text-white' : 'muted hover:text-white'
            }`}
          >
            <List size={14} /> Grid
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition ${
              view === 'map' ? 'bg-white/10 text-white' : 'muted hover:text-white'
            }`}
          >
            <Map size={14} /> Map
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 my-10">
        <Stat l="Portfolio Value" v={fmtCurrency(portfolioValue)} />
        <Stat l="Assets" v={PROPERTIES.length} />
        <Stat l="Total Units" v={totalUnits} />
        <Stat l="Target IRR" v="15–30%" />
      </div>

      {view === 'map' ? (
        <MapView />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTIES.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </section>
  );
}
