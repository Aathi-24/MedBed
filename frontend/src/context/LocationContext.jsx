import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LocationContext = createContext(null);

// Default coordinates: Coimbatore Central (Gandhipuram / Clock Tower), Tamil Nadu
export const COIMBATORE_DEFAULT_LOCATION = {
  lat: 11.0168,
  lng: 76.9558,
  city: 'Coimbatore',
  district: 'Coimbatore',
  state: 'Tamil Nadu'
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('medbed_location');
    return saved ? JSON.parse(saved) : COIMBATORE_DEFAULT_LOCATION;
  });
  const [isLiveGps, setIsLiveGps] = useState(() => {
    return localStorage.getItem('medbed_is_live_gps') === 'true';
  });
  const [locationError, setLocationError] = useState(null);
  const [locating, setLocating] = useState(false);

  // Auto-request location on initial mount if supported
  useEffect(() => {
    if (!isLiveGps && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          setIsLiveGps(true);
          localStorage.setItem('medbed_location', JSON.stringify(coords));
          localStorage.setItem('medbed_is_live_gps', 'true');
        },
        () => {
          // Keep Coimbatore default without disruption
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Using Coimbatore center.');
      setLocation(COIMBATORE_DEFAULT_LOCATION);
      setIsLiveGps(false);
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setIsLiveGps(true);
        localStorage.setItem('medbed_location', JSON.stringify(coords));
        localStorage.setItem('medbed_is_live_gps', 'true');
        setLocationError(null);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        setLocationError('Unable to get live GPS. Defaulting to Coimbatore region.');
        setLocation(COIMBATORE_DEFAULT_LOCATION);
        setIsLiveGps(false);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const resetToDefaultLocation = () => {
    setLocation(COIMBATORE_DEFAULT_LOCATION);
    setIsLiveGps(false);
    localStorage.setItem('medbed_location', JSON.stringify(COIMBATORE_DEFAULT_LOCATION));
    localStorage.setItem('medbed_is_live_gps', 'false');
    setLocationError(null);
  };

  const clearLocation = () => {
    setLocation(COIMBATORE_DEFAULT_LOCATION);
    setIsLiveGps(false);
    localStorage.removeItem('medbed_location');
    localStorage.removeItem('medbed_is_live_gps');
    setLocationError(null);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLiveGps,
        locationError,
        locating,
        requestLocation,
        resetToDefaultLocation,
        clearLocation,
        setLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useUserLocation must be inside LocationProvider');
  return ctx;
};

export const useLocation = useUserLocation;
export default LocationContext;
