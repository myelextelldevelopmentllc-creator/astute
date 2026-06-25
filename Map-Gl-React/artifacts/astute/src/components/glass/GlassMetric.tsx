import type { ReactNode } from 'react';
import LiquidGlassCard from './LiquidGlassCard';

export default function GlassMetric({
  label,
  value,
  icon,
  color = '#F6F0E4',
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  color?: string;
}) {
  return (
    <LiquidGlassCard style={{ padding: '15px 18px', borderRadius: 18 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon}
        <div>
          <p style={{ margin: '0 0 4px', color: 'rgba(246,240,228,0.38)', fontSize: 9, fontWeight: 900, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            {label}
          </p>
          <p style={{ margin: 0, color, fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </p>
        </div>
      </div>
    </LiquidGlassCard>
  );
}
