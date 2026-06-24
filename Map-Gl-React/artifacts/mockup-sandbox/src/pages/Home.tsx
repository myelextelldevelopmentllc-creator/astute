import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, LineChart, ShieldCheck } from 'lucide-react';
import { PROPERTIES, portfolioValue, totalUnits, fmtCurrency } from '../lib/portfolioData';
import PropertyCard from '../components/portfolio/PropertyCard';

function KPI({ l, v }: { l: string; v: string | number }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="metric font-black text-2xl">{v}</div>
      <div className="muted2 uppercase tracking-widest text-[10px] mt-1">{l}</div>
    </div>
  );
}

function Feature({ icon, t, d }: { icon: React.ReactNode; t: string; d: string }) {
  return (
    <div className="glass rounded-[2rem] p-7">
      <div className="accent mb-5">{icon}</div>
      <h3 className="text-xl font-extrabold">{t}</h3>
      <p className="muted text-sm mt-2 leading-relaxed">{d}</p>
    </div>
  );
}

export default function Home() {
  const featured = PROPERTIES.slice(0, 3);

  return (
    <>
      <section className="min-h-screen grid-bg flex items-center pt-24">
        <div className="section grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] uppercase tracking-[.35em] gold font-black mb-6">
              Apple-grade real estate intelligence
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-[-0.075em] leading-[.88]">
              Private equity, redesigned.
            </h1>
            <p className="muted text-lg md:text-xl max-w-2xl mt-7 leading-relaxed">
              Astute turns multifamily underwriting into a cinematic command center: portfolio
              metrics, risk signals, asset pages, charts, and investment thesis in one dark-mode
              interface.
            </p>
            <div className="flex gap-3 mt-9">
              <Link className="btn btn-primary" to="/portfolio">
                Open Portfolio <ArrowUpRight size={15} />
              </Link>
              <Link className="btn btn-ghost" to="/strategy">
                View Strategy
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 glass rounded-[2.5rem] p-6 animate-float">
            <div className="flex justify-between items-start">
              <div>
                <p className="muted2 text-xs uppercase tracking-widest">Portfolio Value</p>
                <div className="metric text-5xl font-black tracking-[-0.05em] mt-2">
                  {fmtCurrency(portfolioValue)}
                </div>
              </div>
              <LineChart className="accent" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-8">
              <KPI l="Assets" v={PROPERTIES.length} />
              <KPI l="Units" v={totalUnits} />
              <KPI l="Avg Score" v="87" />
            </div>
            <div className="mt-6 rounded-[2rem] p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="muted text-sm">Top signal</p>
              <div className="text-2xl font-extrabold mt-1">
                Union City rent gap creates the strongest upside spread.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-20">
        <div className="grid md:grid-cols-3 gap-5">
          <Feature
            icon={<Building2 />}
            t="Asset intelligence"
            d="Each property has thesis, financials, risk, and value-add plan."
          />
          <Feature
            icon={<ShieldCheck />}
            t="Risk-first design"
            d="Risks are surfaced beside returns instead of buried below."
          />
          <Feature
            icon={<LineChart />}
            t="Institutional visuals"
            d="Charts, metrics, and underwriting data in one cinematic interface."
          />
        </div>
      </section>

      <section className="section pb-24">
        <p className="gold uppercase tracking-[.28em] text-xs font-black mb-4">Featured assets</p>
        <h2 className="text-4xl font-black tracking-[-0.06em] mb-10">Top opportunities.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>
    </>
  );
}
