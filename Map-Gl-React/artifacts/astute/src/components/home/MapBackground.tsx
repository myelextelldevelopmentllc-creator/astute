import {
  Suspense,
  forwardRef,
  lazy,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import type { Property } from '../../lib/portfolioData';
import type { CameraOptions, CinematicMapCanvasHandle, LandmarkName } from './CinematicMapCanvas';

const CinematicMapCanvas = lazy(() => import('./CinematicMapCanvas'));

const SCORE_COLOR = (s: number) => s >= 90 ? '#63CFA6' : s >= 85 ? '#8DB7FF' : '#DCC8A3';

function GradientFallback({
  properties,
  activeSection,
}: {
  properties: Property[];
  activeSection: number;
}) {
  const active = properties[Math.max(0, activeSection - 1) % properties.length];
  const gradients = [
    'radial-gradient(ellipse at 28% 62%, rgba(79,140,255,0.24) 0%, transparent 58%), radial-gradient(ellipse at 72% 22%, rgba(243,231,208,0.08) 0%, transparent 48%)',
    'radial-gradient(ellipse at 50% 42%, rgba(79,140,255,0.18) 0%, transparent 56%), radial-gradient(ellipse at 76% 66%, rgba(243,231,208,0.12) 0%, transparent 48%)',
    'radial-gradient(ellipse at 20% 52%, rgba(79,140,255,0.16) 0%, transparent 52%), radial-gradient(ellipse at 84% 36%, rgba(243,231,208,0.08) 0%, transparent 50%)',
    'radial-gradient(ellipse at 60% 70%, rgba(243,231,208,0.16) 0%, transparent 54%), radial-gradient(ellipse at 32% 20%, rgba(79,140,255,0.14) 0%, transparent 48%)',
    'radial-gradient(ellipse at 45% 40%, rgba(79,140,255,0.2) 0%, transparent 54%), radial-gradient(ellipse at 70% 72%, rgba(243,231,208,0.07) 0%, transparent 48%)',
  ];
  const dots = [
    { x: '42%', y: '49%', r: 3, color: '#8DB7FF' },
    { x: '37%', y: '54%', r: 3, color: '#DCC8A3' },
    { x: '65%', y: '31%', r: 3, color: '#63CFA6' },
    { x: '63%', y: '34%', r: 3, color: '#63CFA6' },
    { x: '43%', y: '47%', r: 3, color: '#8DB7FF' },
    { x: '31%', y: '40%', r: 1, color: 'rgba(200,220,255,0.42)' },
    { x: '35%', y: '58%', r: 1.4, color: 'rgba(200,220,255,0.46)' },
    { x: '48%', y: '46%', r: 1.2, color: 'rgba(200,220,255,0.38)' },
    { x: '58%', y: '28%', r: 1.4, color: 'rgba(200,220,255,0.48)' },
    { x: '70%', y: '38%', r: 1.1, color: 'rgba(200,220,255,0.36)' },
    { x: '76%', y: '28%', r: 0.9, color: 'rgba(200,220,255,0.34)' },
    { x: '25%', y: '64%', r: 0.9, color: 'rgba(200,220,255,0.32)' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#030814', pointerEvents: 'none' }}>
      <motion.div
        key={activeSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: gradients[activeSection % gradients.length],
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(243,231,208,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.018) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.28 }}>
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} />
        ))}
      </svg>
      {active && (
        <motion.div
          key={`${active.id}-${activeSection}`}
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${SCORE_COLOR(active.score)}1f 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

function LoadingPill() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 92,
        width: 'max-content',
        margin: '0 auto',
        zIndex: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 16px',
        borderRadius: 999,
        background: 'rgba(5,16,31,0.44)',
        border: '1px solid rgba(243,231,208,0.14)',
        color: 'rgba(243,231,208,0.72)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 34px rgba(79,140,255,0.16)',
        pointerEvents: 'none',
      }}
    >
      <motion.span
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#8DB7FF',
          boxShadow: '0 0 16px rgba(79,140,255,0.72)',
        }}
      />
      Loading market intelligence
    </motion.div>
  );
}

export interface MapBackgroundHandle {
  flyTo: (opts: CameraOptions) => void;
}

interface Props {
  properties: Property[];
  activeSection: number;
  activePropertyId?: string;
  activeLandmarkName?: LandmarkName;
}

const MapBackground = forwardRef<MapBackgroundHandle, Props>(
  ({ properties, activeSection, activePropertyId, activeLandmarkName }, ref) => {
    const mapRef = useRef<CinematicMapCanvasHandle>(null);
    const pendingCamera = useRef<CameraOptions | null>(null);
    const [webglFailed, setWebglFailed] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [shouldMountMap, setShouldMountMap] = useState(false);

    useImperativeHandle(ref, () => ({
      flyTo: (opts) => {
        pendingCamera.current = opts;
        if (mapRef.current && mapLoaded && !webglFailed) {
          mapRef.current.flyTo(opts);
        }
      },
    }));

    useEffect(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglFailed(true);
        return;
      }

      const idleWindow = window as typeof window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      const timeout = window.setTimeout(() => setShouldMountMap(true), 420);
      const idleId = idleWindow.requestIdleCallback?.(() => setShouldMountMap(true), { timeout: 1200 });
      return () => {
        window.clearTimeout(timeout);
        if (idleId && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleId);
      };
    }, []);

    useEffect(() => {
      if (mapLoaded && pendingCamera.current) {
        mapRef.current?.flyTo(pendingCamera.current);
      }
    }, [mapLoaded]);

    return (
      <>
        {(!mapLoaded || webglFailed) && (
          <>
            <GradientFallback properties={properties} activeSection={activeSection} />
            {!webglFailed && <LoadingPill />}
          </>
        )}

        {!webglFailed && shouldMountMap && (
          <Suspense fallback={null}>
            <CinematicMapCanvas
              ref={mapRef}
              properties={properties}
              activePropertyId={activePropertyId}
              activeLandmarkName={activeLandmarkName}
              onLoad={() => setMapLoaded(true)}
              onError={() => setWebglFailed(true)}
              visible={mapLoaded}
            />
          </Suspense>
        )}
      </>
    );
  },
);

MapBackground.displayName = 'MapBackground';
export default MapBackground;
