import { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

const HospitalMap = ({ userLocation, hospital, className = '' }) => {
  const [mapType, setMapType] = useState('osm'); // osm or fallback

  if (!hospital || !hospital.location?.coordinates) {
    return (
      <div className={`w-full h-full bg-sky-50 flex flex-col items-center justify-center rounded-2xl border border-sky-100 p-6 text-center ${className}`}>
        <MapPin size={32} className="text-sky-400 mb-2" />
        <p className="text-sm font-semibold text-sky-800">{hospital?.name || 'Hospital Location'}</p>
        <p className="text-xs text-gray-500 mt-1">{hospital?.address || 'Location coordinates not provided'}</p>
      </div>
    );
  }

  const [lng, lat] = hospital.location.coordinates;
  const userLat = userLocation?.lat;
  const userLng = userLocation?.lng;

  // OpenStreetMap embed URL with marker
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015}%2C${lat - 0.015}%2C${lng + 0.015}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Google Maps navigation direction URL
  const googleDirectionsUrl = userLat && userLng
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-sky-200 bg-sky-50 shadow-sm ${className}`}>
      {/* Interactive Map Iframe */}
      <iframe
        title={`Map of ${hospital.name}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={osmUrl}
        className="w-full h-full"
      />

      {/* Floating Info Overlay */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-sky-100 flex items-center gap-2 max-w-[80%]">
        <MapPin size={14} className="text-red-500 flex-shrink-0" />
        <div className="truncate">
          <p className="text-xs font-bold text-gray-900 truncate">{hospital.name}</p>
          <p className="text-[10px] text-gray-500 truncate">{hospital.address}</p>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <a
          href={googleDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg transition"
        >
          <Navigation size={13} />
          Directions <ExternalLink size={11} className="opacity-70" />
        </a>
      </div>
    </div>
  );
};

export default HospitalMap;
