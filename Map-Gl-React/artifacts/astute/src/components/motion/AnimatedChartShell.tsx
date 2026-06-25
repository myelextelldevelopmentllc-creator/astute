import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedChartShell({
  children,
  triggerKey,
}: {
  children: ReactNode;
  triggerKey?: string | number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={triggerKey}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.62, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}
