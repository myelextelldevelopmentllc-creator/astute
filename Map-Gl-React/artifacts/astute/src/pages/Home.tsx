import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ChevronDown, TrendingUp, Building2, Layers, DollarSign } from 'lucide-react';
import { PROPERTIES, portfolioValue, totalUnits, fmtCurrency } from '../lib/portfolioData';
import ParticleField from '../components/home/ParticleField';
import MapBackground from '../components/home/MapBackground';
import type { MapBackgroundHandle } from '../components/home/MapBackground';
import 'maplibre-gl/dist/maplibre-gl.css';

const TOTAL_SECTIONS = 2 + PROPERTIES.length; // hero + 5 properties + outro
const SCORE_COLOR = (s: number) => s >= 90 ? '#5ee0a1' : s >= 85 ? '#9fb8ff' : '#d6b66a';

const FLY_TARGETS = [
  { center: [-74.0, 40.85] as [number, number], zoom: 8.2, pitch: 0, bearing: 0 },
  ...PROPERTIES.map((p, i) => ({
    center: p.coords as [number, number],
    zoom: 15.2, pitch: 42, bearing: -18 + i * 8,
  })),
  { center: [-73.6, 41.1] as [number, number], zoom: 7.6, pitch: 0, bearing: 0 },
];

const LOCATION_INTELLIGENCE: Record<string, string[]> = {
  'elliott-yonkers': ['Transit Access', 'School District', 'Rent Growth', 'Supply Constraint'],
  'union-city-summit': ['Commuter Demand', 'Transit Access', 'Renovation Upside', 'Rent Growth'],
  'arlington-somerville': ['Supply Constraint', 'School District', 'Commuter Demand', 'Rent Growth'],
  'upland-somerville': ['Transit Access', 'Supply Constraint', 'Renovation Upside', 'School District'],
  'elliott-92': ['School District', 'Rent Growth', 'Renovation Upside', 'Commuter Demand'],
};

export default function Home() {
  const mapRef = useRef<MapBackgroundHandle>(null);
  const [activeSection, setActiveSection] = useState(0);
  const lastSection = useRef(-1);

  useEffect(() => {
    const onScroll = () => {
      const idx = Math.min(
        Math.floor(window.scrollY / window.innerHeight),
        TOTAL_SECTIONS - 1,
      );
      if (idx !== lastSection.current) {
        lastSection.current = idx;
        setActiveSection(idx);
        const target = FLY_TARGETS[idx];
        if (target && mapRef.current) {
          mapRef.current.flyTo({ ...target, duration: 2400 });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeProperty =
    activeSection >= 1 && activeSection <= PROPERTIES.length
      ? PROPERTIES[activeSection - 1]
      : null;
  const isHero = activeSection === 0;
  const isOutro = activeSection > PROPERTIES.length;

  return (
    <div style={{ marginTop: -64, position: 'relative' }}>
      <div style={{ height: `${TOTAL_SECTIONS * 100}vh`, position: 'relative' }}>
        {/* ── STICKY VIEWPORT ── */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Map (with WebGL fallback) */}
          <MapBackground
            ref={mapRef}
            properties={PROPERTIES}
            activeSection={activeSection}
          />

          {/* CSS particle field (no WebGL) */}
          <ParticleField />

          {/* Bottom vignette */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(5,6,9,0.9) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 8,
          }} />
          {/* Top vignette */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 160,
            background: 'linear-gradient(to bottom, rgba(5,6,9,0.75) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 8,
          }} />

          {/* ────────── HERO OVERLAY ────────── */}
          <AnimatePresence>
            {isHero && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.35 } }}
                transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'absolute', bottom: 80, left: 0, right: 0, zIndex: 20,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.12, duration: 0.5 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    background: 'rgba(5,6,9,0.55)',
                    border: '1px solid rgba(159,184,255,0.3)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    borderRadius: 999, padding: '8px 22px', marginBottom: 24,
                  }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: '#5ee0a1', boxShadow: '0 0 10px #5ee0a1' }}
                  />
                  <span style={{ fontSize: 11, color: '#9fb8ff', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Tri-State · NY · NJ · MA
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.6 }}
                  style={{
                    margin: '0 0 8px', textAlign: 'center',
                    fontSize: 'clamp(52px, 8vw, 96px)',
                    fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.96,
                    background: 'linear-gradient(175deg, #ffffff 20%, rgba(255,255,255,0.48) 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}
                >
                  Private Equity<br />Real Estate
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.38, duration: 0.5 }}
                  style={{ margin: '0 0 34px', color: 'rgba(245,247,251,0.4)', fontSize: 16, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  Intelligence
                </motion.p>

                {/* Glass stats bar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.48, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    background: 'rgba(5,6,9,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(36px)',
                    WebkitBackdropFilter: 'blur(36px)',
                    borderRadius: 24, overflow: 'hidden', marginBottom: 42,
                    boxShadow: '0 30px 90px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
                  }}
                >
                  {[
                    { icon: DollarSign, label: 'Portfolio Value', value: fmtCurrency(portfolioValue), color: '#9fb8ff' },
                    { icon: Building2, label: 'Properties', value: String(PROPERTIES.length), color: '#d6b66a' },
                    { icon: Layers, label: 'Total Units', value: String(totalUnits), color: '#5ee0a1' },
                    { icon: TrendingUp, label: 'Target IRR', value: '18–26%', color: '#ff6b7a' },
                  ].map(({ icon: Icon, label, value, color }, i, arr) => (
                    <div key={label} style={{
                      padding: '18px 34px', textAlign: 'center',
                      borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 6 }}>
                        <Icon size={10} color={color} />
                        <p style={{ margin: 0, color: 'rgba(245,247,251,0.34)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</p>
                      </div>
                      <p style={{ margin: 0, color: '#f5f7fb', fontWeight: 900, fontSize: 22, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                  animate={{ y: [0, 9, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}
                >
                  <span style={{ color: 'rgba(245,247,251,0.28)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Scroll to Explore
                  </span>
                  <ChevronDown size={16} color="rgba(245,247,251,0.28)" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ────────── PROPERTY GLASS CARD ────────── */}
          <AnimatePresence mode="wait">
            {activeProperty && (
              <motion.div
                key={activeProperty.id}
                initial={{ opacity: 0, x: 60, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 52, filter: 'blur(8px)', transition: { duration: 0.35 } }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'absolute', right: 28, top: '50%',
                  transform: 'translateY(-50%)', width: 344, zIndex: 30,
                }}
              >
                <div style={{
                  background: 'rgba(4,5,9,0.56)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  borderRadius: 28, overflow: 'hidden',
                  boxShadow: '0 56px 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.09)',
                }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: 188, overflow: 'hidden' }}>
                    <motion.img
                      key={activeProperty.image}
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.7 }}
                      src={activeProperty.image}
                      alt={activeProperty.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(4,5,9,0.93) 0%, rgba(4,5,9,0.08) 55%)',
                    }} />

                    {/* Geo tag */}
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      background: 'rgba(79,114,255,0.18)', border: '1px solid rgba(79,114,255,0.36)',
                      backdropFilter: 'blur(14px)', borderRadius: 999,
                      padding: '4px 13px', fontSize: 10, fontWeight: 700,
                      color: '#9fb8ff', letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>{activeProperty.tag}</div>

                    {/* Score */}
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      background: 'rgba(4,5,9,0.72)', backdropFilter: 'blur(14px)',
                      border: `1px solid ${SCORE_COLOR(activeProperty.score)}44`,
                      borderRadius: 14, padding: '7px 14px', textAlign: 'center',
                    }}>
                      <p style={{ margin: 0, color: SCORE_COLOR(activeProperty.score), fontSize: 24, fontWeight: 900, lineHeight: 1 }}>
                        {activeProperty.score}
                      </p>
                      <p style={{ margin: 0, color: 'rgba(245,247,251,0.36)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Score</p>
                    </div>

                    {/* Counter */}
                    <div style={{ position: 'absolute', bottom: 13, left: 15, color: 'rgba(245,247,251,0.4)', fontSize: 11, fontWeight: 600 }}>
                      {activeSection} of {PROPERTIES.length}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '18px 22px 24px' }}>
                    <p style={{ margin: '0 0 3px', color: 'rgba(245,247,251,0.34)', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>
                      {activeProperty.type}
                    </p>
                    <h2 style={{ margin: '0 0 7px', color: '#f5f7fb', fontSize: 21, fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.18 }}>
                      {activeProperty.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 18, color: 'rgba(245,247,251,0.38)', fontSize: 12 }}>
                      <MapPin size={11} />
                      {activeProperty.address}
                    </div>

                    {/* Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 17 }}>
                      {[
                        { label: 'Asking Price', value: fmtCurrency(activeProperty.askingPrice), color: '#f5f7fb' },
                        { label: 'Per Unit', value: fmtCurrency(activeProperty.pricePerUnit), color: '#f5f7fb' },
                        { label: 'Units', value: `${activeProperty.units} units`, color: '#d6b66a' },
                        { label: 'Target IRR', value: activeProperty.irr, color: '#5ee0a1' },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 14, padding: '10px 13px',
                        }}>
                          <p style={{ margin: '0 0 3px', color: 'rgba(245,247,251,0.32)', fontSize: 9, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
                          <p style={{ margin: 0, color, fontWeight: 800, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <p style={{ margin: '0 0 18px', color: 'rgba(245,247,251,0.46)', fontSize: 12, lineHeight: 1.7 }}>
                      {activeProperty.thesis.slice(0, 112)}…
                    </p>

                    <div style={{ marginBottom: 18 }}>
                      <p style={{
                        margin: '0 0 9px',
                        color: 'rgba(245,247,251,0.38)',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                      }}>
                        Location Intelligence
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        {(LOCATION_INTELLIGENCE[activeProperty.id] ?? ['Transit Access', 'Rent Growth', 'Supply Constraint']).map((chip) => (
                          <span
                            key={chip}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              minHeight: 24,
                              padding: '5px 10px',
                              borderRadius: 999,
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))',
                              border: '1px solid rgba(255,255,255,0.09)',
                              color: 'rgba(245,247,251,0.6)',
                              fontSize: 10,
                              fontWeight: 700,
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                            }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/portfolio/${activeProperty.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: 'rgba(159,184,255,0.11)',
                        border: '1px solid rgba(159,184,255,0.22)',
                        borderRadius: 999, padding: '11px 0',
                        color: '#c4d4ff', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                        letterSpacing: '0.02em', transition: '0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(159,184,255,0.2)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(159,184,255,0.11)'; }}
                    >
                      View Full Deal Memo <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Progress pills */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 14 }}>
                  {PROPERTIES.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ width: i === activeSection - 1 ? 24 : 7 }}
                      style={{
                        height: 7, borderRadius: 999,
                        background: i === activeSection - 1
                          ? SCORE_COLOR(PROPERTIES[i].score)
                          : 'rgba(255,255,255,0.18)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ────────── LEFT NAV DOTS ────────── */}
          <AnimatePresence>
            {!isHero && !isOutro && (
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                style={{
                  position: 'absolute', left: 28, top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex', flexDirection: 'column', gap: 14, zIndex: 25,
                }}
              >
                {PROPERTIES.map((p, i) => {
                  const isActive = i === activeSection - 1;
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <motion.div
                        animate={{ width: isActive ? 28 : 8 }}
                        style={{
                          height: 7, borderRadius: 999, flexShrink: 0,
                          background: isActive ? SCORE_COLOR(p.score) : 'rgba(255,255,255,0.2)',
                        }}
                      />
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            style={{ color: 'rgba(245,247,251,0.52)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}
                          >
                            {p.location}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ────────── BOTTOM HINT ────────── */}
          <AnimatePresence>
            {!isHero && !isOutro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', bottom: 26, left: '50%',
                  transform: 'translateX(-50%)', zIndex: 25,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                <span style={{ color: 'rgba(245,247,251,0.25)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {activeSection < PROPERTIES.length ? 'Continue scrolling' : 'Last property'}
                </span>
                {activeSection < PROPERTIES.length && <ChevronDown size={13} color="rgba(245,247,251,0.25)" />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ────────── OUTRO ────────── */}
          <AnimatePresence>
            {isOutro && (
              <motion.div
                key="outro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 25,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 28 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    background: 'rgba(4,5,9,0.62)',
                    border: '1px solid rgba(255,255,255,0.13)',
                    backdropFilter: 'blur(44px)',
                    WebkitBackdropFilter: 'blur(44px)',
                    borderRadius: 34, padding: '52px 64px',
                    textAlign: 'center',
                    boxShadow: '0 64px 180px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 20, margin: '0 auto 28px',
                    background: 'linear-gradient(135deg, #4f72ff 0%, #a78bfa 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 48px rgba(79,114,255,0.5)',
                  }}>
                    <Building2 size={30} color="white" strokeWidth={2} />
                  </div>

                  <p style={{ margin: '0 0 6px', color: 'rgba(245,247,251,0.38)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Active Pipeline
                  </p>
                  <h2 style={{ margin: '0 0 4px', fontSize: 48, fontWeight: 900, color: '#f5f7fb', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {PROPERTIES.length} Properties
                  </h2>
                  <p style={{ margin: '0 0 8px', color: '#9fb8ff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
                    {fmtCurrency(portfolioValue)}
                  </p>
                  <p style={{ margin: '0 0 32px', color: 'rgba(245,247,251,0.4)', fontSize: 15 }}>Across NY · NJ · MA</p>

                  <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 36 }}>
                    {[
                      { label: 'Units', value: String(totalUnits), color: '#5ee0a1' },
                      { label: 'Target IRR', value: '18–26%', color: '#ff6b7a' },
                      { label: 'Avg Score', value: String(Math.round(PROPERTIES.reduce((s, p) => s + p.score, 0) / PROPERTIES.length)), color: '#d6b66a' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 3px', color: 'rgba(245,247,251,0.34)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</p>
                        <p style={{ margin: 0, color, fontWeight: 900, fontSize: 24, letterSpacing: '-0.025em' }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Link to="/portfolio" style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#f5f7fb', color: '#050609',
                      borderRadius: 999, padding: '13px 34px',
                      fontSize: 12, fontWeight: 800, textDecoration: 'none',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      Full Portfolio <ArrowRight size={14} />
                    </Link>
                    <Link to="/strategy" style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.13)',
                      color: '#f5f7fb', borderRadius: 999, padding: '13px 28px',
                      fontSize: 12, fontWeight: 700, textDecoration: 'none',
                    }}>
                      Our Strategy
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
