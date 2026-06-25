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
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.045))',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 26px 90px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.16)',
          backdropFilter: 'blur(30px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(30px) saturate(1.3)',
        }}
      >
        {children}
      </nav>
    </header>
  );
}
