import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: 'blue' | 'green' | 'gold' | 'neutral';
  interactive?: boolean;
  style?: CSSProperties;
}

const accentGlow = {
  blue: 'rgba(159,184,255,0.18)',
  green: 'rgba(94,224,161,0.16)',
  gold: 'rgba(214,182,106,0.16)',
  neutral: 'rgba(255,255,255,0.08)',
};

export default function LiquidGlassCard({
  children,
  accent = 'neutral',
  interactive = false,
  style,
  ...props
}: LiquidGlassCardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -3, scale: 1.006 } : undefined}
      transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="liquid-glass-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 22,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.105), rgba(255,255,255,0.035) 48%, rgba(255,255,255,0.065))',
        border: '1px solid rgba(255,255,255,0.11)',
        boxShadow: `0 28px 90px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.13), 0 0 70px ${accentGlow[accent]}`,
        backdropFilter: 'blur(28px) saturate(1.25)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.25)',
        ...style,
      }}
      {...props}
    >
      <div className="liquid-glass-chromatic" />
      {children}
    </motion.div>
  );
}
