import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface RevealWordsProps {
  text: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export default function RevealWords({
  text,
  as = 'span',
  className,
  style,
  delay = 0,
}: RevealWordsProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <Component className={className} style={style}>{text}</Component>;
  }

  return (
    <Component className={className} style={style} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.62,
            delay: delay + index * 0.055,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}
