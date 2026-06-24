import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Map from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { Marker } from 'react-map-gl/maplibre';
import { motion } from 'framer-motion';
import type { Property } from '../../lib/portfolioData';

const SCORE_COLOR = (s: number) => s >= 90 ? '#5ee0a1' : s >= 85 ? '#9fb8ff' : '#d6b66a';

// CSS gradient fallback when WebGL is unavailable (Replit preview / no GPU)
function GradientFallback({ properties, activeSection }: {
  properties: Property[];
  activeSection: number;
}) {
  const active = properties[activeSection - 1];
  const gradients = [
    'radial-gradient(ellipse at 30% 60%, rgba(79,114,255,0.22) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(94,224,161,0.1) 0%, transparent 50%)',
    'radial-gradient(ellipse at 20% 50%, rgba(94,224,161,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(159,184,255,0.12) 0%, transparent 50%)',
    'radial-gradient(ellipse at 60% 70%, rgba(214,182,106,0.18) 0%, transparent 55%), radial-gradient(ellipse at 30% 20%, rgba(79,114,255,0.15) 0%, transparent 50%)',
    'radial-gradient(ellipse at 40% 40%, rgba(167,139,250,0.2) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(94,224,161,0.12) 0%, transparent 50%)',
    'radial-gradient(ellipse at 70% 50%, rgba(159,184,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 30%, rgba(214,182,106,0.12) 0%, transparent 50%)',
    'radial-gradient(ellipse at 50% 60%, rgba(79,114,255,0.2) 0%, transparent 55%), radial-gradient(ellipse at 40% 20%, rgba(94,224,161,0.1) 0%, transparent 50%)',
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#050609' }}>
      {/* Animated background gradient changes with section */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'absolute', inset: 0,
          background: gradients[Math.min(activeSection, gradients.length - 1)],
        }}
      />

      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Fake "city lights" dots to suggest a map */}
      {activeSection === 0 && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}>
          {/* Rough dot positions for Tri-State properties */}
          {[
            { x: '42%', y: '48%', r: 3, color: '#9fb8ff' },   // Yonkers
            { x: '38%', y: '52%', r: 3, color: '#d6b66a' },   // Union City
            { x: '62%', y: '32%', r: 3, color: '#5ee0a1' },   // Somerville 1
            { x: '60%', y: '35%', r: 3, color: '#5ee0a1' },   // Somerville 2
            { x: '43%', y: '46%', r: 3, color: '#9fb8ff' },   // Yonkers 2
            // city scatter
            ...Array.from({ length: 60 }, (_, i) => ({
              x: `${20 + Math.random() * 60}%`,
              y: `${20 + Math.random() * 60}%`,
              r: 0.5 + Math.random() * 1.5,
              color: 'rgba(200,220,255,0.6)',
            })),
          ].map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} />
          ))}
        </svg>
      )}

      {/* Property focus glow when active */}
      {active && (
        <motion.div
          key={active.id}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: `radial-gradient(circle, ${SCORE_COLOR(active.score)}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

export interface MapBackgroundHandle {
  flyTo: (opts: { center: [number, number]; zoom: number; pitch?: number; bearing?: number; duration?: number }) => void;
}

interface Props {
  properties: Property[];
  activeSection: number;
}

const MapBackground = forwardRef<MapBackgroundHandle, Props>(
  ({ properties, activeSection }, ref) => {
    const mapRef = useRef<MapRef>(null);
    const [webglFailed, setWebglFailed] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      flyTo: (opts) => {
        if (mapRef.current && mapLoaded && !webglFailed) {
          mapRef.current.flyTo({
            center: opts.center,
            zoom: opts.zoom,
            pitch: opts.pitch ?? 0,
            bearing: opts.bearing ?? 0,
            duration: opts.duration ?? 2000,
            essential: true,
          });
        }
      },
    }));

    useEffect(() => {
      // Detect WebGL support before even mounting the Map
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglFailed(true);
      }
    }, []);

    if (webglFailed) {
      return <GradientFallback properties={properties} activeSection={activeSection} />;
    }

    return (
      <>
        {/* Fallback gradient shows behind the map while it loads */}
        {!mapLoaded && <GradientFallback properties={properties} activeSection={activeSection} />}

        <div style={{ position: 'absolute', inset: 0, opacity: mapLoaded ? 1 : 0, transition: 'opacity 0.8s' }}>
          <Map
            ref={mapRef}
            initialViewState={{ longitude: -74.0, latitude: 40.85, zoom: 8.2 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            onLoad={() => setMapLoaded(true)}
            onError={() => setWebglFailed(true)}
            attributionControl={false}
          >
            {properties.map((p, i) => {
              const isActive = activeSection === i + 1;
              const color = SCORE_COLOR(p.score);
              return (
                <Marker key={p.id} longitude={p.coords[0]} latitude={p.coords[1]} anchor="center">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.6 : activeSection === 0 || activeSection > properties.length ? 1 : 0.7,
                      opacity: activeSection === 0 || activeSection > properties.length ? 1 : isActive ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'relative', cursor: 'pointer' }}
                  >
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        style={{
                          position: 'absolute', inset: -6, borderRadius: '50%',
                          border: `2px solid ${color}`,
                        }}
                      />
                    )}
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: color,
                      boxShadow: isActive
                        ? `0 0 0 3px ${color}44, 0 0 24px ${color}88`
                        : `0 0 0 2px ${color}33`,
                    }} />
                  </motion.div>
                </Marker>
              );
            })}
          </Map>
        </div>
      </>
    );
  }
);

MapBackground.displayName = 'MapBackground';
export default MapBackground;
