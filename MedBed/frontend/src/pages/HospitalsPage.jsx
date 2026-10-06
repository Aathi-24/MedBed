import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, RefreshCw, Navigation, AlertCircle, Search,
  Filter, SlidersHorizontal, LayoutList, Map as MapIcon,
  ShieldCheck, Activity, Star, BedDouble, Check
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import HospitalCard from '../components/hospital/HospitalCard';
import LoadingSpinner, { SkeletonCard } from '../components/common/LoadingSpinner';
import { useHospitals } from '../hooks/useHospitals';
import { useUserLocation } from '../context/LocationContext';

const SPECIALTIES = [
  'All',
  'Orthopedics',
  'Cardiology',
  'Neurology',
  'Trauma & Spine Surgery',
  'Emergency Medicine',
  'Gastroenterology',
  'Oncology',
  'Pediatrics',
  'Ophthalmology',
  'Plastic Surgery',
  'General Surgery',
  'Nephrology',
  'Pulmonology'
];

const HospitalsPage = () => {
  const { location, isLiveGps, locating, requestLocation, resetToDefaultLocation } = useUserLocation();
  const { hospitals, loading, error, fetchNearby } = useHospitals();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [filterOTOnly, setFilterOTOnly] = useState(false);
  const [filterBedsOnly, setFilterBedsOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // distance | beds | rating | name
  const [viewMode, setViewMode] = useState('list'); // list | map
  const [refreshing, setRefreshing] = useState(false);

  // Load hospitals from database
  useEffect(() => {
    const lat = location?.lat;
    const lng = location?.lng;
    fetchNearby(lat, lng);
  }, [location?.lat, location?.lng, fetchNearby]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNearby(location?.lat, location?.lng);
    setRefreshing(false);
  };

  // Client-side filtering & sorting for real-time responsiveness
  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter((h) => {
        // Search filter (Name, Address, Locality like Peelamedu, Saibaba Colony, etc., or Specialty)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = h.name?.toLowerCase().includes(term);
          const matchAddr = h.address?.toLowerCase().includes(term);
          const matchSpec = h.specialties?.some((s) => s.toLowerCase().includes(term));
          if (!matchName && !matchAddr && !matchSpec) return false;
        }

        // Specialty filter
        if (selectedSpecialty !== 'All') {
          const hasSpec = h.specialties?.some(
            (s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()) || s.toLowerCase().includes('all')
          );
          if (!hasSpec) return false;
        }

        // Emergency open filter
        if (filterEmergencyOnly && !h.emergencyOpen) return false;

        // OT slots filter
        if (filterOTOnly && (!h.operationTheatre?.available || h.operationTheatre.available <= 0)) {
          return false;
        }

        // Total available beds filter
        if (filterBedsOnly) {
          const totalAvail =
            (h.beds?.general?.available || 0) +
            (h.beds?.acWard?.available || 0) +
            (h.beds?.private?.available || 0);
          if (totalAvail <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          const distA = a.distanceKm !== null ? a.distanceKm : 9999;
          const distB = b.distanceKm !== null ? b.distanceKm : 9999;
          return distA - distB;
        }
        if (sortBy === 'beds') {
          const bedsA = (a.beds?.general?.available || 0) + (a.beds?.acWard?.available || 0) + (a.beds?.private?.available || 0);
          const bedsB = (b.beds?.general?.available || 0) + (b.beds?.acWard?.available || 0) + (b.beds?.private?.available || 0);
          return bedsB - bedsA;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [hospitals, searchTerm, selectedSpecialty, filterEmergencyOnly, filterOTOnly, filterBedsOnly, sortBy]);

  return (
    <PageTransition type="slideUp">
      <div className="min-h-screen bg-sky-50 pt-16 pb-16">
        {/* Top Header */}
        <div className="bg-white border-b border-sky-100 shadow-sm sticky top-16 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                    Coimbatore Live Directory
                  </span>
                  <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {filteredHospitals.length} of {hospitals.length} Database Records
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 mt-1">
                  Coimbatore Hospitals & Beds
                </h1>
              </div>

              {/* Location Badge & Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-medium text-sky-800">
                  <MapPin size={13} className={isLiveGps ? 'text-emerald-500' : 'text-sky-500'} />
                  <span>{isLiveGps ? 'GPS Location Active' : 'Coimbatore Central (Default)'}</span>
                </div>

                <button
                  onClick={requestLocation}
                  disabled={locating}
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition"
                  title="Update with GPS location"
                >
                  <Navigation size={12} className={locating ? 'animate-spin' : ''} />
                  {locating ? 'Locating…' : isLiveGps ? 'Re-scan GPS' : 'Use My GPS'}
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-sky-700 hover:bg-sky-50 rounded-xl border border-sky-200 transition"
                  title="Refresh hospital data"
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="mt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by hospital name, locality (Peelamedu, Saibaba Colony), or specialty..."
                    className="w-full pl-10 pr-4 py-2.5 bg-sky-50/70 border border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Specialty Dropdown */}
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="bg-sky-50/70 border border-sky-200 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>
                      Specialty: {spec}
                    </option>
                  ))}
                </select>

                {/* Sort By Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-sky-50/70 border border-sky-200 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="distance">Sort: Nearest First</option>
                  <option value="beds">Sort: Most Available Beds</option>
                  <option value="rating">Sort: Highest Rating</option>
                  <option value="name">Sort: Name (A-Z)</option>
                </select>

                {/* View Switcher */}
                <div className="flex items-center bg-sky-50 border border-sky-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                      viewMode === 'list'
                        ? 'bg-white text-sky-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LayoutList size={15} />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                      viewMode === 'map'
                        ? 'bg-white text-sky-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MapIcon size={15} />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>
              </div>

              {/* Quick Filter Toggle Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-gray-400 font-semibold flex items-center gap-1 flex-shrink-0">
                  <SlidersHorizontal size={12} /> Filters:
                </span>

                <button
                  onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
                  className={`px-3 py-1.5 rounded-full font-semibold border flex items-center gap-1 flex-shrink-0 transition ${
                    filterEmergencyOnly
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-sky-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
                  Emergency Open
                </button>

                <button
                  onClick={() => setFilterOTOnly(!filterOTOnly)}
                  className={`px-3 py-1.5 rounded-full font-semibold border flex items-center gap-1 flex-shrink-0 transition ${
                    filterOTOnly
                      ? 'bg-red-500 text-white border-red-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-sky-300'
                  }`}
                >
                  <Activity size={12} />
                  OT Available
                </button>

                <button
                  onClick={() => setFilterBedsOnly(!filterBedsOnly)}
                  className={`px-3 py-1.5 rounded-full font-semibold border flex items-center gap-1 flex-shrink-0 transition ${
                    filterBedsOnly
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-sky-300'
                  }`}
                >
                  <BedDouble size={12} />
                  Has Free Beds
                </button>

                {(filterEmergencyOnly || filterOTOnly || filterBedsOnly || selectedSpecialty !== 'All' || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterEmergencyOnly(false);
                      setFilterOTOnly(false);
                      setFilterBedsOnly(false);
                      setSelectedSpecialty('All');
                      setSearchTerm('');
                    }}
                    className="text-red-500 hover:text-red-700 font-semibold px-2 py-1 ml-auto flex-shrink-0"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800">Database Connection Notice</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
                <button onClick={handleRefresh} className="text-xs font-bold text-red-700 underline mt-2">
                  Retry Loading
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !refreshing && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* MAP VIEW - COIMBATORE OVERVIEW */}
          {!loading && viewMode === 'map' && (
            <div className="bg-white rounded-3xl p-4 shadow-card border border-sky-100">
              <div className="h-[500px] w-full rounded-2xl overflow-hidden mb-4 relative">
                <iframe
                  title="Coimbatore Hospitals Overview Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=76.88%2C10.95%2C77.10%2C11.10&layer=mapnik&marker=${location?.lat || 11.0168}%2C${location?.lng || 76.9558}`}
                  className="w-full h-full"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow border border-sky-100">
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin size={13} className="text-sky-600" />
                    Coimbatore Healthcare Radar
                  </p>
                  <p className="text-[10px] text-gray-500">{filteredHospitals.length} hospitals plotted live</p>
                </div>
              </div>

              {/* Quick scroll cards below map */}
              <div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {filteredHospitals.map((h, i) => (
                  <HospitalCard key={h._id} hospital={h} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {!loading && viewMode === 'list' && (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredHospitals.map((h, i) => (
                  <HospitalCard key={h._id} hospital={h} index={i} />
                ))}
              </AnimatePresence>

              {/* Empty state */}
              {filteredHospitals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-3xl border border-sky-100 p-8 shadow-sm"
                >
                  <p className="text-5xl mb-3">🔍</p>
                  <h3 className="text-lg font-bold text-gray-800">No Coimbatore Hospitals Match Your Query</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                    Try searching for areas like Peelamedu, Saibaba Colony, Sidhapudur, or reset the specialty filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSpecialty('All');
                      setFilterEmergencyOnly(false);
                      setFilterOTOnly(false);
                      setFilterBedsOnly(false);
                    }}
                    className="mt-4 bg-sky-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default HospitalsPage;
