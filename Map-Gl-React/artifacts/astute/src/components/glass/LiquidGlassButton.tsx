import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'gold' | 'neutral';
}

const toneColor = {
  blue: '#8DB7FF',
  green: '#63CFA6',
  gold: '#DCC8A3',
  neutral: '#F6F0E4',
};

export default function LiquidGlassButton({
  children,
  tone = 'neutral',
  style,
  ...props
}: LiquidGlassButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.026, filter: 'saturate(1.14)' }}
      whileTap={{ scale: 0.972 }}
      transition={{ type: 'spring', stiffness: 360, damping: 22, mass: 0.6 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        border: '1px solid rgba(243,231,208,0.12)',
        borderRadius: 999,
        padding: '9px 14px',
        background: `linear-gradient(145deg, ${toneColor[tone]}20, rgba(6,20,38,0.46))`,
        color: tone === 'neutral' ? 'rgba(246,240,228,0.78)' : toneColor[tone],
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(243,231,208,0.06), 0 14px 40px ${toneColor[tone]}16`,
        backdropFilter: 'blur(28px) saturate(150%)',
        WebkitBackdropFilter: 'blur(28px) saturate(150%)',
        fontSize: 12,
        fontWeight: 900,
        cursor: 'pointer',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
