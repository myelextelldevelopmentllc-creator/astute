import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import LiquidGlassCard from './LiquidGlassCard';

interface LiquidGlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export default function LiquidGlassPanel({
  children,
  title,
  eyebrow,
  action,
  style,
  ...props
}: LiquidGlassPanelProps) {
  return (
    <LiquidGlassCard style={{ padding: 22, ...style }} {...props}>
      {(title || eyebrow || action) && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 18 }}>
          <div>
            {eyebrow && (
              <p style={{ margin: '0 0 6px', color: 'rgba(245,247,251,0.38)', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 style={{ margin: 0, color: '#f5f7fb', fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>
                {title}
              </h2>
            )}
          </div>
          {action}
        </div>
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </LiquidGlassCard>
  );
}
