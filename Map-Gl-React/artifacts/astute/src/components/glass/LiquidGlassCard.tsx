import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: 'blue' | 'green' | 'gold' | 'neutral';
  interactive?: boolean;
  style?: CSSProperties;
}

const accentGlow = {
  blue: 'rgba(79,140,255,0.22)',
  green: 'rgba(99,207,166,0.10)',
  gold: 'rgba(243,231,208,0.14)',
  neutral: 'rgba(79,140,255,0.10)',
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
      whileHover={interactive ? { y: -4, scale: 1.012, filter: 'saturate(1.12)' } : undefined}
      whileTap={interactive ? { scale: 0.992 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.8 }}
      className="liquid-glass-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 30,
        background: 'linear-gradient(145deg, rgba(8,24,44,0.56), rgba(5,16,31,0.38) 48%, rgba(10,29,51,0.46))',
        border: '1px solid rgba(243,231,208,0.12)',
        boxShadow: `0 34px 110px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(243,231,208,0.065), 0 0 82px ${accentGlow[accent]}`,
        backdropFilter: 'blur(34px) saturate(155%)',
        WebkitBackdropFilter: 'blur(34px) saturate(155%)',
        ...style,
      }}
      {...props}
    >
      <div className="liquid-glass-chromatic" />
      {children}
    </motion.div>
  );
}
