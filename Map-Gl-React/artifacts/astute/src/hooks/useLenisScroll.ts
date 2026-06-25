import { useEffect } from 'react';

type LenisInstance = {
  raf: (time: number) => void;
  destroy: () => void;
};

let activeLenis: LenisInstance | null = null;
let activeRaf = 0;
let users = 0;

export default function useLenisScroll() {
  useEffect(() => {
    users += 1;
    let cancelled = false;

    if (!activeLenis) {
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled || activeLenis) return;
        activeLenis = new Lenis({
          duration: 1.28,
          smoothWheel: true,
          wheelMultiplier: 0.82,
          touchMultiplier: 1.05,
        });

        const raf = (time: number) => {
          activeLenis?.raf(time);
          activeRaf = requestAnimationFrame(raf);
        };
        activeRaf = requestAnimationFrame(raf);
      });
    }

    return () => {
      cancelled = true;
      users -= 1;
      if (users <= 0) {
        users = 0;
        if (activeRaf) cancelAnimationFrame(activeRaf);
        activeRaf = 0;
        activeLenis?.destroy();
        activeLenis = null;
      }
    };
  }, []);
}
