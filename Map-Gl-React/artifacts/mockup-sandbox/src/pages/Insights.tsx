import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { PROPERTIES } from '../lib/portfolioData';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-[2rem] p-8">
      <p className="gold uppercase tracking-[.24em] text-xs font-black mb-5">{title}</p>
      {children}
    </div>
  );
}

export default function Insights() {
  const score = PROPERTIES.map((p) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    score: p.score,
    units: p.units,
  }));

  const radar = [
    { m: 'Return', A: 88 },
    { m: 'Basis', A: 82 },
    { m: 'Market', A: 84 },
    { m: 'Risk', A: 73 },
    { m: 'NOI Growth', A: 91 },
  ];

  return (
    <section className="section pt-36 pb-20">
      <p className="gold uppercase tracking-[.28em] text-xs font-black">Insights</p>
      <h1 className="text-5xl md:text-7xl font-black tracking-[-0.07em] mt-4">
        Portfolio signal room.
      </h1>

      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        <Card title="Astute Score by Asset">
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={score}>
              <CartesianGrid stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#9fb8ff" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Strategy Radar">
          <ResponsiveContainer width="100%" height={330}>
            <RadarChart data={radar}>
              <PolarGrid stroke="rgba(255,255,255,.1)" />
              <PolarAngleAxis dataKey="m" />
              <Radar dataKey="A" stroke="#d6b66a" fill="#d6b66a" fillOpacity={0.28} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="glass rounded-[2rem] p-8 mt-6">
        <p className="gold uppercase tracking-[.24em] text-xs font-black mb-5">
          Portfolio Summary
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['Avg Astute Score', `${Math.round(PROPERTIES.reduce((s, p) => s + p.score, 0) / PROPERTIES.length)}`],
            ['Total Units', `${PROPERTIES.reduce((s, p) => s + p.units, 0)}`],
            ['IRR Range', '15–30%'],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="metric text-4xl font-black">{v}</div>
              <div className="muted2 text-xs uppercase tracking-widest mt-2">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
