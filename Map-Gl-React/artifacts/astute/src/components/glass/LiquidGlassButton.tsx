import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'gold' | 'neutral';
}

const toneColor = {
  blue: '#9fb8ff',
  green: '#5ee0a1',
  gold: '#d6b66a',
  neutral: '#f5f7fb',
};

export default function LiquidGlassButton({
  children,
  tone = 'neutral',
  style,
  ...props
}: LiquidGlassButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 999,
        padding: '9px 14px',
        background: `linear-gradient(145deg, ${toneColor[tone]}20, rgba(255,255,255,0.045))`,
        color: tone === 'neutral' ? 'rgba(245,247,251,0.78)' : toneColor[tone],
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 14px 36px ${toneColor[tone]}12`,
        backdropFilter: 'blur(22px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.2)',
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
