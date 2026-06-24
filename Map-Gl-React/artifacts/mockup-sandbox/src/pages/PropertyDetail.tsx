import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PROPERTIES, fmtCurrency } from '../lib/portfolioData';
import AnalyticsCharts from '../components/property/AnalyticsCharts';

function Metric({ l, v }: { l: string; v: string | number }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="metric text-2xl font-black">{v}</div>
      <div className="muted2 text-[10px] uppercase tracking-widest mt-2">{l}</div>
    </div>
  );
}

function Panel({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="glass rounded-[2rem] p-8">
      <div className="accent">{icon}</div>
      <h3 className="text-2xl font-black mt-3">{title}</h3>
      <div className="space-y-3 mt-5">
        {items.map((item) => (
          <div key={item} className="flex gap-3 muted">
            <span className="gold">•</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const p = PROPERTIES.find((x) => x.id === id) || PROPERTIES[0];
  const f = p.financials;

  return (
    <section className="pt-28">
      <div className="section">
        <Link to="/portfolio" className="muted inline-flex items-center gap-2 text-sm mb-6">
          <ArrowLeft size={16} /> Back to portfolio
        </Link>

        <div className="relative rounded-[3rem] overflow-hidden min-h-[560px] glass">
          <img
            src={p.image}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
            alt={p.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-[#050609]/55 to-transparent" />
          <div className="relative p-8 md:p-12 min-h-[560px] flex flex-col justify-end">
            <p className="gold uppercase tracking-[.32em] text-xs font-black">{p.tag}</p>
            <h1 className="text-5xl md:text-8xl font-black tracking-[-0.08em] leading-none mt-3">
              {p.name}
            </h1>
            <p className="muted mt-4 text-lg">{p.address}</p>
            <div className="grid md:grid-cols-5 gap-3 mt-8">
              <Metric l="Asking" v={fmtCurrency(p.askingPrice)} />
              <Metric l="Units" v={p.units} />
              <Metric l="Cap Rate" v={p.cap} />
              <Metric l="Target IRR" v={p.irr} />
              <Metric l="Astute Score" v={p.score} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 mt-8">
          <div className="lg:col-span-7 glass rounded-[2rem] p-8">
            <p className="gold uppercase tracking-[.24em] text-xs font-black">Investment Thesis</p>
            <h2 className="text-3xl font-black tracking-[-0.04em] mt-3">Why this asset works.</h2>
            <p className="muted leading-relaxed mt-4">{p.thesis}</p>
          </div>

          <div className="lg:col-span-5 glass rounded-[2rem] p-8">
            <p className="gold uppercase tracking-[.24em] text-xs font-black">Financial Overview</p>
            {(
              [
                ['Current NOI', fmtCurrency(f.currentNOI)],
                ['Stabilized NOI', fmtCurrency(f.stabilizedNOI)],
                ['Total Basis', fmtCurrency(f.totalBasis)],
                ['Projected Sale', fmtCurrency(f.projectedSalePrice)],
                ['Equity Multiple', f.equityMultiple],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="flex justify-between border-b hairline py-3">
                <span className="muted">{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <AnalyticsCharts property={p} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6 pb-20">
          <Panel
            title="Value-Add Plan"
            icon={<CheckCircle2 />}
            items={p.valuePlan}
          />
          <Panel
            title="Risk Factors"
            icon={<AlertTriangle />}
            items={p.riskFactors}
          />
        </div>
      </div>
    </section>
  );
}
