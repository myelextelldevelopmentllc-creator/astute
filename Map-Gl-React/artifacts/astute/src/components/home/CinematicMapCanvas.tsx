import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import type { Property } from '../../lib/portfolioData';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface CameraOptions {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
  duration?: number;
}

export interface CinematicMapCanvasHandle {
  flyTo: (opts: CameraOptions) => void;
}

export type LandmarkName =
  | 'Manhattan'
  | 'George Washington Bridge'
  | 'Lincoln Tunnel'
  | 'Jersey City Waterfront'
  | 'Newark Penn Station'
  | 'Yonkers Station'
  | 'Harvard / MIT area'
  | 'Kendall Square'
  | 'Boston Common'
  | 'Somerville Davis Square';

const LANDMARKS: Array<{ name: LandmarkName; coords: [number, number] }> = [
  { name: 'Manhattan', coords: [-73.9855, 40.7580] },
  { name: 'George Washington Bridge', coords: [-73.9527, 40.8517] },
  { name: 'Lincoln Tunnel', coords: [-74.0126, 40.7614] },
  { name: 'Jersey City Waterfront', coords: [-74.0324, 40.7178] },
  { name: 'Newark Penn Station', coords: [-74.1646, 40.7347] },
  { name: 'Yonkers Station', coords: [-73.8847, 40.9357] },
  { name: 'Harvard / MIT area', coords: [-71.1020, 42.3736] },
  { name: 'Kendall Square', coords: [-71.0870, 42.3628] },
  { name: 'Boston Common', coords: [-71.0656, 42.3555] },
  { name: 'Somerville Davis Square', coords: [-71.1223, 42.3967] },
];

const SCORE_COLOR = (s: number) => s >= 90 ? '#63CFA6' : s >= 85 ? '#8DB7FF' : '#DCC8A3';

interface Props {
  properties: Property[];
  activePropertyId?: string;
  activeLandmarkName?: LandmarkName;
  visible: boolean;
  onLoad: () => void;
  onError: () => void;
}

const CinematicMapCanvas = forwardRef<CinematicMapCanvasHandle, Props>(
  ({ properties, activePropertyId, activeLandmarkName, visible, onLoad, onError }, ref) => {
    const mapRef = useRef<MapRef>(null);

    useImperativeHandle(ref, () => ({
      flyTo: (opts) => {
        mapRef.current?.flyTo({
          center: opts.center,
          zoom: opts.zoom,
          pitch: opts.pitch ?? 0,
          bearing: opts.bearing ?? 0,
          duration: opts.duration ?? 2200,
          essential: true,
        });
      },
    }));

    return (
      <div
        className="home-map-stage"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.2s ease',
          pointerEvents: 'none',
          filter: visible ? 'saturate(0.88) contrast(0.9) brightness(0.92)' : 'saturate(0.8) contrast(0.82) brightness(0.82)',
        }}
      >
        <Map
          ref={mapRef}
          initialViewState={{ longitude: -73.62, latitude: 41.28, zoom: 6.65, pitch: 18, bearing: -9 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          onLoad={onLoad}
          onError={onError}
          attributionControl={false}
          interactive={false}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          keyboard={false}
          boxZoom={false}
        >
          {LANDMARKS.map((landmark) => {
            const isActive = landmark.name === activeLandmarkName;
            return (
              <Marker key={landmark.name} longitude={landmark.coords[0]} latitude={landmark.coords[1]} anchor="bottom">
                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0.42,
                    scale: isActive ? 1.18 : 0.9,
                    y: isActive ? -3 : 4,
                  }}
                  transition={{ duration: 0.45 }}
                  style={{
                    position: 'relative',
                    width: 58,
                    height: 68,
                    pointerEvents: 'none',
                    filter: isActive ? 'drop-shadow(0 0 22px rgba(79,140,255,0.35))' : undefined,
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 12,
                    width: isActive ? 15 : 11,
                    height: isActive ? 44 : 32,
                    transform: 'translateX(-50%) perspective(56px) rotateX(14deg)',
                    borderRadius: '9px 9px 4px 4px',
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(243,231,208,0.70), rgba(79,140,255,0.34) 52%, rgba(5,16,31,0.52))'
                      : 'linear-gradient(180deg, rgba(141,183,255,0.30), rgba(5,16,31,0.48))',
                    border: `1px solid ${isActive ? 'rgba(243,231,208,0.46)' : 'rgba(243,231,208,0.16)'}`,
                    boxShadow: isActive
                      ? '0 0 28px rgba(79,140,255,0.36), inset 0 1px 0 rgba(255,255,255,0.42)'
                      : '0 0 18px rgba(79,140,255,0.14), inset 0 1px 0 rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 4,
                    width: isActive ? 36 : 26,
                    height: isActive ? 11 : 8,
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    background: isActive
                      ? 'radial-gradient(ellipse, rgba(79,140,255,0.35), transparent 72%)'
                      : 'radial-gradient(ellipse, rgba(79,140,255,0.15), transparent 70%)',
                  }} />
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: -18,
                        transform: 'translateX(-50%)',
                        padding: '4px 9px',
                        borderRadius: 999,
                        background: 'rgba(5,16,31,0.48)',
                        border: '1px solid rgba(243,231,208,0.14)',
                        color: 'rgba(243,231,208,0.86)',
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                      }}
                    >
                      {landmark.name}
                    </motion.div>
                  )}
                </motion.div>
              </Marker>
            );
          })}

          {properties.map((p) => {
            const isActive = activePropertyId === p.id;
            const isMuted = Boolean(activePropertyId) && !isActive;
            const color = SCORE_COLOR(p.score);
            return (
              <Marker key={p.id} longitude={p.coords[0]} latitude={p.coords[1]} anchor="center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.68 : isMuted ? 0.78 : 1,
                    opacity: isMuted ? 0.34 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ position: 'relative', pointerEvents: 'none' }}
                >
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 2.5], opacity: [0.62, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        inset: -6,
                        borderRadius: '50%',
                        border: `2px solid ${color}`,
                      }}
                    />
                  )}
                  <div style={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: color,
                    boxShadow: isActive
                      ? `0 0 0 4px ${color}3d, 0 0 30px ${color}80, 0 16px 38px rgba(0,0,0,0.42)`
                      : `0 0 0 2px ${color}2e, 0 0 18px ${color}28`,
                  }} />
                </motion.div>
              </Marker>
            );
          })}
        </Map>
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 62% 36%, rgba(243,231,208,0.055), transparent 32%), radial-gradient(circle at 28% 54%, rgba(79,140,255,0.12), transparent 38%), linear-gradient(180deg, rgba(3,8,20,0.12), rgba(5,16,31,0.32))',
          mixBlendMode: 'screen',
        }} />
      </div>
    );
  },
);

CinematicMapCanvas.displayName = 'CinematicMapCanvas';
export default CinematicMapCanvas;
