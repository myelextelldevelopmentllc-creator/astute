import type { ReactNode } from 'react';

export default function GlassDockNav({ children }: { children: ReactNode }) {
  return (
    <header className="glass-dock-header">
      <nav className="glass-dock-nav">
        {children}
      </nav>
    </header>
  );
}
