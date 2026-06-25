import type { ReactNode } from 'react';

export default function GlassDockNav({ children }: { children: ReactNode }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 14,
        left: 0,
        right: 0,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          maxWidth: 1180,
          height: 58,
          margin: '0 auto',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(8,24,44,0.52), rgba(5,16,31,0.38))',
          border: '1px solid rgba(243,231,208,0.13)',
          boxShadow: '0 30px 110px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(243,231,208,0.07), 0 0 78px rgba(79,140,255,0.15)',
          backdropFilter: 'blur(36px) saturate(160%)',
          WebkitBackdropFilter: 'blur(36px) saturate(160%)',
        }}
      >
        {children}
      </nav>
    </header>
  );
}
