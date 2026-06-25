import type { ReactNode } from 'react';
import LiquidGlassCard from './LiquidGlassCard';
import AnimatedNumber from '../motion/AnimatedNumber';

function parseMetric(value: string) {
  const match = value.match(/^(\$)?([\d,]+(?:\.\d+)?)([%xM])?$/);
  if (!match) return null;
  const raw = match[2] ?? '';
  const numeric = Number(raw.replace(/,/g, ''));
  if (!Number.isFinite(numeric)) return null;
  const decimals = raw.includes('.') ? raw.split('.')[1]?.length ?? 0 : 0;
  return {
    value: numeric,
    prefix: match[1] ?? '',
    suffix: match[3] ?? '',
    decimals,
  };
}

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
  const animatedMetric = parseMetric(value);

  return (
    <LiquidGlassCard style={{ padding: '15px 18px', borderRadius: 18 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon}
        <div>
          <p style={{ margin: '0 0 4px', color: 'rgba(246,240,228,0.38)', fontSize: 9, fontWeight: 900, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            {label}
          </p>
          <p style={{ margin: 0, color, fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {animatedMetric ? (
              <AnimatedNumber
                value={animatedMetric.value}
                prefix={animatedMetric.prefix}
                suffix={animatedMetric.suffix}
                decimals={animatedMetric.decimals}
              />
            ) : value}
          </p>
        </div>
      </div>
    </LiquidGlassCard>
  );
}
