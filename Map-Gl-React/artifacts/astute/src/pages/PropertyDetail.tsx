import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Flame, MapPin, ShieldAlert, Target, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PROPERTIES, fmtCurrency } from '../lib/portfolioData';
import LiquidGlassButton from '../components/glass/LiquidGlassButton';
import LiquidGlassPanel from '../components/glass/LiquidGlassPanel';
import GlassMetric from '../components/glass/GlassMetric';

const tabs = ['Overview', 'Financials', 'Location Intelligence', 'Value-Add Plan', 'Risk Matrix', 'Exit Strategy'] as const;
type DealMemoTab = typeof tabs[number];

const heat = ['Low', 'Medium', 'High'] as const;

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = PROPERTIES.find((item) => item.id === id);
  const [activeTab, setActiveTab] = useState<DealMemoTab>('Overview');
  const [rentUpside, setRentUpside] = useState(62);
  const [exitCap, setExitCap] = useState(property?.financials.capRateOut ?? 6.5);
  const [checked, setChecked] = useState<number[]>([0]);

  if (!property) return <Navigate to="/portfolio" />;

  const f = property.financials;
  const sensitivity = useMemo(() => {
    const rentLift = (f.marketRent - f.currentRent) * 12 * (rentUpside / 100);
    const stabilizedNOI = f.currentNOI + rentLift;
    const exitValue = stabilizedNOI / (exitCap / 100);
    const valueGain = exitValue - f.totalBasis;
    return { rentLift, stabilizedNOI, exitValue, valueGain };
  }, [exitCap, f.currentNOI, f.marketRent, f.currentRent, f.totalBasis, rentUpside]);

  const noiBridge = [
    { name: 'Current NOI', value: f.currentNOI },
    { name: 'Rent Upside', value: sensitivity.rentLift },
    { name: 'Stabilized NOI', value: sensitivity.stabilizedNOI },
  ];
  const locationSignals: Array<{ label: string; value: number; color: string }> = [
    { label: 'Transit Access', value: property.tag === 'Hudson County' ? 94 : property.tag === 'Boston Metro' ? 90 : 86, color: '#8DB7FF' },
    { label: 'Supply Constraint', value: property.tag === 'Boston Metro' ? 93 : 84, color: '#63CFA6' },
    { label: 'Rent Growth', value: property.score, color: '#DCC8A3' },
    { label: 'Liquidity Depth', value: property.units >= 6 ? 88 : 78, color: '#8DB7FF' },
  ];
  const risks = property.riskFactors.map((risk, index) => ({
    risk,
    severity: heat[(index + (property.score > 88 ? 0 : 1)) % heat.length],
  }));

  return (
    <div style={{ padding: '42px 24px 90px' }}>
      <div className="section">
        <Link to="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(246,240,228,0.52)', fontSize: 13, fontWeight: 800, textDecoration: 'none', marginBottom: 26 }}>
          <ArrowLeft size={16} /> Portfolio
        </Link>

        <div className="liquid-glass-card" style={{ position: 'relative', borderRadius: 38, overflow: 'hidden', marginBottom: 24, minHeight: 350, background: 'rgba(6,20,38,0.34)' }}>
          <img src={property.image} alt={property.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,8,20,0.96), rgba(3,8,20,0.22) 62%)' }} />
          <div style={{ position: 'relative', minHeight: 350, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <span style={{ width: 'max-content', background: 'rgba(79,140,255,0.16)', border: '1px solid rgba(79,140,255,0.26)', borderRadius: 999, padding: '5px 13px', color: '#c4d4ff', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Institutional Deal Memo
            </span>
            <h1 style={{ margin: '0 0 9px', color: '#F6F0E4', fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 950, letterSpacing: '-0.045em', lineHeight: 0.98 }}>
              {property.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(246,240,228,0.62)', fontSize: 14, fontWeight: 700 }}>
              <MapPin size={15} />
              {property.address}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 12, marginBottom: 22 }}>
          <GlassMetric label="Asking Price" value={fmtCurrency(property.askingPrice)} color="#F6F0E4" />
          <GlassMetric label="Units" value={String(property.units)} color="#DCC8A3" />
          <GlassMetric label="Cap In" value={`${f.capRateIn}%`} color="#8DB7FF" />
          <GlassMetric label="Target IRR" value={property.irr} color="#63CFA6" />
          <GlassMetric label="Score" value={String(property.score)} color="#63CFA6" />
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 22, paddingBottom: 4 }}>
          {tabs.map((tab) => (
            <LiquidGlassButton
              key={tab}
              onClick={() => setActiveTab(tab)}
              tone={activeTab === tab ? 'blue' : 'neutral'}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab}
            </LiquidGlassButton>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20 }}>
            <LiquidGlassPanel title="Investment Thesis" eyebrow={property.type}>
              <p style={{ margin: 0, color: 'rgba(246,240,228,0.62)', fontSize: 14, lineHeight: 1.75 }}>{property.thesis}</p>
            </LiquidGlassPanel>
            <LiquidGlassPanel title="Live Sensitivity" eyebrow="Rent upside model">
              <label>
                <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: 'rgba(246,240,228,0.42)', fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Rent upside captured</span>
                  <span style={{ color: '#63CFA6', fontWeight: 900 }}>{rentUpside}%</span>
                </span>
                <input type="range" min={0} max={100} value={rentUpside} onChange={(event) => setRentUpside(Number(event.target.value))} style={{ width: '100%', accentColor: '#63CFA6' }} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                <GlassMetric label="Stabilized NOI" value={fmtCurrency(sensitivity.stabilizedNOI)} color="#63CFA6" />
                <GlassMetric label="Implied Exit" value={fmtCurrency(sensitivity.exitValue)} color="#DCC8A3" />
              </div>
            </LiquidGlassPanel>
          </div>
        )}

        {activeTab === 'Financials' && (
          <LiquidGlassPanel title="NOI Bridge" eyebrow="Current to stabilized">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={noiBridge}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'rgba(246,240,228,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} tick={{ fill: 'rgba(246,240,228,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => fmtCurrency(value)} contentStyle={{ background: '#061426', border: '1px solid rgba(243,231,208,0.12)', borderRadius: 12 }} />
                <Bar dataKey="value" fill="#63CFA6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <label style={{ display: 'block', marginTop: 18 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: 'rgba(246,240,228,0.42)', fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Exit cap sensitivity</span>
                <span style={{ color: '#DCC8A3', fontWeight: 900 }}>{exitCap.toFixed(1)}%</span>
              </span>
              <input type="range" min={4.5} max={8.5} step={0.1} value={exitCap} onChange={(event) => setExitCap(Number(event.target.value))} style={{ width: '100%', accentColor: '#DCC8A3' }} />
            </label>
          </LiquidGlassPanel>
        )}

        {activeTab === 'Location Intelligence' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
            {locationSignals.map(({ label, value, color }) => (
              <LiquidGlassPanel key={label} title={label}>
                <p style={{ margin: '0 0 12px', color, fontSize: 42, fontWeight: 950, letterSpacing: '-0.04em' }}>{value}</p>
                <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${value}%`, height: '100%', borderRadius: 999, background: color }} />
                </div>
              </LiquidGlassPanel>
            ))}
          </div>
        )}

        {activeTab === 'Value-Add Plan' && (
          <LiquidGlassPanel title="Renovation Checklist" eyebrow="Execution controls">
            <div style={{ display: 'grid', gap: 10 }}>
              {property.valuePlan.map((item, index) => {
                const done = checked.includes(index);
                return (
                  <button
                    key={item}
                    onClick={() => setChecked((current) => done ? current.filter((i) => i !== index) : [...current, index])}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', border: '1px solid rgba(243,231,208,0.10)', borderRadius: 16, padding: 14, background: done ? 'rgba(94,224,161,0.12)' : 'rgba(255,255,255,0.045)', color: 'rgba(246,240,228,0.68)', cursor: 'pointer' }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: 999, display: 'grid', placeItems: 'center', background: done ? '#63CFA6' : 'rgba(255,255,255,0.08)', color: done ? '#030814' : 'rgba(246,240,228,0.38)' }}>
                      {done && <Check size={14} />}
                    </span>
                    {item}
                  </button>
                );
              })}
            </div>
          </LiquidGlassPanel>
        )}

        {activeTab === 'Risk Matrix' && (
          <LiquidGlassPanel title="Risk Heatmap" eyebrow="Active diligence">
            <div style={{ display: 'grid', gap: 10 }}>
              {risks.map(({ risk, severity }) => {
                const color = severity === 'High' ? '#D66A77' : severity === 'Medium' ? '#DCC8A3' : '#63CFA6';
                return (
                  <div key={risk} style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12, alignItems: 'center', borderRadius: 16, padding: 14, background: `${color}12`, border: `1px solid ${color}28` }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(246,240,228,0.7)' }}><ShieldAlert size={14} color={color} />{risk}</span>
                    <span style={{ color, fontWeight: 950, textAlign: 'right' }}>{severity}</span>
                  </div>
                );
              })}
            </div>
          </LiquidGlassPanel>
        )}

        {activeTab === 'Exit Strategy' && (
          <LiquidGlassPanel title="Exit Strategy" eyebrow="Stabilization path">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
              <p style={{ margin: 0, color: 'rgba(246,240,228,0.62)', fontSize: 14, lineHeight: 1.75 }}>{property.exitStrategy}</p>
              <div style={{ display: 'grid', gap: 10 }}>
                <GlassMetric label="Value Gain" value={fmtCurrency(sensitivity.valueGain)} color={sensitivity.valueGain > 0 ? '#63CFA6' : '#D66A77'} icon={<TrendingUp size={15} color="#63CFA6" />} />
                <GlassMetric label="Primary Catalyst" value={property.tag} color="#8DB7FF" icon={<Target size={15} color="#8DB7FF" />} />
                <GlassMetric label="Risk Heat" value={risks.some((risk) => risk.severity === 'High') ? 'Elevated' : 'Managed'} color="#DCC8A3" icon={<Flame size={15} color="#DCC8A3" />} />
              </div>
            </div>
          </LiquidGlassPanel>
        )}
      </div>
    </div>
  );
}
