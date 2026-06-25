import { useState, useCallback } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import { Link } from 'react-router-dom';
import type { Property } from '../../lib/portfolioData';
import { fmtCurrency } from '../../lib/portfolioData';
import 'maplibre-gl/dist/maplibre-gl.css';

const SCORE_COLOR = (score: number) =>
  score >= 90 ? '#63CFA6' : score >= 85 ? '#8DB7FF' : '#DCC8A3';

export default function MapView({ properties }: { properties: Property[] }) {
  const [popup, setPopup] = useState<Property | null>(null);

  const handleMarkerClick = useCallback((p: Property) => {
    setPopup(prev => prev?.id === p.id ? null : p);
  }, []);

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', height: 500, border: '1px solid rgba(243,231,208,0.10)' }}>
      <Map
        initialViewState={{ longitude: -72.6, latitude: 41.5, zoom: 7 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        {properties.map(p => (
          <Marker
            key={p.id}
            longitude={p.coords[0]}
            latitude={p.coords[1]}
            anchor="bottom"
            onClick={e => { e.originalEvent.stopPropagation(); handleMarkerClick(p); }}
          >
            <div style={{
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                background: SCORE_COLOR(p.score),
                color: '#030814', fontWeight: 800, fontSize: 11,
                borderRadius: 999, padding: '4px 10px',
                boxShadow: `0 0 16px ${SCORE_COLOR(p.score)}88`,
                whiteSpace: 'nowrap',
              }}>
                {p.score}
              </div>
              <div style={{ width: 2, height: 8, background: SCORE_COLOR(p.score), opacity: 0.6 }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: SCORE_COLOR(p.score), opacity: 0.5 }} />
            </div>
          </Marker>
        ))}

        {popup && (
          <Popup
            longitude={popup.coords[0]}
            latitude={popup.coords[1]}
            anchor="bottom"
            offset={52}
            onClose={() => setPopup(null)}
            closeOnClick={false}
          >
            <div style={{
              background: '#061426', border: '1px solid rgba(243,231,208,0.12)',
              borderRadius: 16, padding: '14px 16px', minWidth: 200,
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}>
              <p style={{ margin: '0 0 2px', color: 'rgba(246,240,228,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                {popup.tag}
              </p>
              <p style={{ margin: '0 0 10px', color: '#F6F0E4', fontWeight: 800, fontSize: 14, lineHeight: 1.25 }}>
                {popup.name}
              </p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', color: 'rgba(246,240,228,0.36)', fontSize: 9, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>Price</p>
                  <p style={{ margin: 0, color: '#F6F0E4', fontWeight: 700, fontSize: 13 }}>{fmtCurrency(popup.askingPrice)}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', color: 'rgba(246,240,228,0.36)', fontSize: 9, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>IRR</p>
                  <p style={{ margin: 0, color: '#63CFA6', fontWeight: 700, fontSize: 13 }}>{popup.irr}</p>
                </div>
              </div>
              <Link
                to={`/portfolio/${popup.id}`}
                style={{
                  display: 'block', textAlign: 'center',
                  background: 'rgba(79,140,255,0.18)', border: '1px solid rgba(79,140,255,0.3)',
                  borderRadius: 999, padding: '6px 0', fontSize: 11, fontWeight: 700,
                  color: '#8DB7FF', textDecoration: 'none',
                }}
              >
                View Deal Memo →
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
