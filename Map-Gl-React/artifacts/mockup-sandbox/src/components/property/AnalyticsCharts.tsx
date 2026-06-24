import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar,
} from 'recharts';
import { type Property } from '../../lib/portfolioData';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-[2rem] p-6">
      <p className="text-[11px] uppercase tracking-[.22em] muted mb-5 font-bold">{title}</p>
      {children}
      <p className="muted2 text-xs mt-3">
        Projected figures are underwriting assumptions, not guarantees.
      </p>
    </div>
  );
}

export default function AnalyticsCharts({ property }: { property: Property }) {
  const f = property.financials;
  const data = [
    { year: 'Current', noi: f.currentNOI, rent: f.currentRent * 12, value: property.askingPrice },
    { year: 'Stabilized', noi: f.stabilizedNOI, rent: f.marketRent * 12, value: f.projectedSalePrice },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="NOI expansion">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,.06)" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
            <Tooltip />
            <Line type="monotone" dataKey="noi" stroke="#9fb8ff" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Rent runway">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,.06)" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
            <Tooltip />
            <Bar dataKey="rent" fill="#d6b66a" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
