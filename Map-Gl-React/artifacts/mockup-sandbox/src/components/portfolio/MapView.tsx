import { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PROPERTIES, fmtCurrency, type Property } from '../../lib/portfolioData';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const SCORE_COLOR = (score: number) => {
  if (score >= 90) return '#5ee0a1';
  if (score >= 85) return '#9fb8ff';
  return '#d6b66a';
};

function PinMarker({
  property,
  selected,
  onClick,
}: {
  property: Property;
  selected: boolean;
  onClick: () => void;
}) {
  const color = SCORE_COLOR(property.score);
  return (
    <Marker longitude={property.coords[0]} latitude={property.coords[1]} anchor="bottom">
      <button
        onClick={onClick}
        className="group flex flex-col items-center focus:outline-none"
        style={{ transform: selected ? 'scale(1.25)' : 'scale(1)', transition: 'transform 0.2s' }}
      >
        <div
          className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition"
          style={{ background: 'rgba(5,6,9,0.85)', border: `1px solid ${color}`, color }}
        >
          {property.name.split(' ').slice(0, 2).join(' ')}
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
          style={{
            background: selected ? color : 'rgba(5,6,9,0.88)',
            border: `2px solid ${color}`,
            boxShadow: selected ? `0 0 18px ${color}80` : '0 4px 16px rgba(0,0,0,0.6)',
          }}
        >
          <MapPin size={14} style={{ color: selected ? '#050609' : color }} strokeWidth={2.5} />
        </div>
      </button>
    </Marker>
  );
}

function PropertyPopup({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const color = SCORE_COLOR(property.score);

  return (
    <Popup
      longitude={property.coords[0]}
      latitude={property.coords[1]}
      anchor="bottom"
      offset={44}
      onClose={onClose}
      closeButton={false}
      className="astute-popup"
      maxWidth="280px"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035))',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(22px)',
          minWidth: 240,
        }}
      >
        <div className="relative h-28 overflow-hidden">
          <img src={property.image} className="w-full h-full object-cover opacity-70" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050609] to-transparent" />
          <div
            className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(5,6,9,0.75)', border: `1px solid ${color}`, color }}
          >
            Score {property.score}
          </div>
        </div>

        <div className="p-3">
          <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#d6b66a' }}>
            {property.tag}
          </p>
          <h3 className="font-extrabold text-sm leading-tight" style={{ color: '#f5f7fb' }}>
            {property.name}
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(245,247,251,0.5)' }}>
            {property.type} · {property.units} units
          </p>

          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}>
            <div>
              <div className="font-black text-xs" style={{ color: '#f5f7fb' }}>
                {fmtCurrency(property.askingPrice)}
              </div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(245,247,251,0.4)' }}>
                Asking
              </div>
            </div>
            <div>
              <div className="font-black text-xs" style={{ color }}>
                {property.irr}
              </div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(245,247,251,0.4)' }}>
                Target IRR
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/portfolio/${property.id}`)}
            className="w-full mt-3 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition"
            style={{ background: '#f5f7fb', color: '#050609' }}
          >
            View underwriting <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default function MapView() {
  const [selected, setSelected] = useState<Property | null>(null);

  const handleMarkerClick = useCallback((p: Property) => {
    setSelected((prev) => (prev?.id === p.id ? null : p));
  }, []);

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden"
      style={{ height: 480, border: '1px solid rgba(255,255,255,0.09)' }}
    >
      <Map
        initialViewState={{
          longitude: -72.8,
          latitude: 41.8,
          zoom: 6.5,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {PROPERTIES.map((p) => (
          <PinMarker
            key={p.id}
            property={p}
            selected={selected?.id === p.id}
            onClick={() => handleMarkerClick(p)}
          />
        ))}

        {selected && (
          <PropertyPopup property={selected} onClose={() => setSelected(null)} />
        )}
      </Map>

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 rounded-2xl px-4 py-3 flex items-center gap-4 text-[10px] uppercase tracking-widest"
        style={{ background: 'rgba(5,6,9,0.82)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(16px)' }}
      >
        {[['#5ee0a1', '90+'], ['#9fb8ff', '85–89'], ['#d6b66a', '<85']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span style={{ color: 'rgba(245,247,251,0.5)' }}>Score {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
