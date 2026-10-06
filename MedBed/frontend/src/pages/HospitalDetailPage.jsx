import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Navigation, Phone, Clock,
  BedDouble, Activity, Star, ChevronDown, ChevronUp,
  Search, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Users
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import HospitalMap from '../components/hospital/HospitalMap';
import DoctorCard from '../components/hospital/DoctorCard';
import BedAvailabilityBar from '../components/common/BedAvailabilityBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useHospitals } from '../hooks/useHospitals';
import { useDoctors } from '../hooks/useDoctors';
import { useUserLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { getAvailabilityPercent } from '../utils/helpers';

const SectionHeader = ({ title, badge, icon }) => (
  <div className="flex items-center gap-2 mb-3">
    {icon}
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
    {badge && (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase">
        {badge}
      </span>
    )}
  </div>
);

const EmergencyBlock = ({ icon, label, badge, available, total, occupied, bgClass, textClass, barColor }) => {
  const percent = getAvailabilityPercent(available, total);
  return (
    <div className={`rounded-2xl p-4 border ${bgClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <span className="text-xl">{icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className={`font-bold text-sm ${textClass}`}>{label}</p>
              {badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {available === 0 ? 'All currently occupied' : `${available} slots available`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`stat-number text-2xl font-extrabold ${textClass}`}>{available}</p>
          <p className="text-xs text-gray-400">of {total} total</p>
        </div>
      </div>
      <div className="availability-bar">
        <motion.div
          className="availability-bar-fill"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
        <span>{percent}% Available</span>
        <span>{occupied} Occupied</span>
      </div>
    </div>
  );
};

const HospitalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchById, selectedHospital: hospital, loading } = useHospitals();
  const { doctors, loading: docLoading, fetchByHospital } = useDoctors();
  const { location } = useUserLocation();
  const { isAmbulance, isHospital, isLoggedIn } = useAuth();

  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all'); // all | available
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  const showEmergency = isAmbulance() || isHospital();

  useEffect(() => {
    fetchById(id, location);
    fetchByHospital(id);
  }, [id, location?.lat, location?.lng]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (doctorFilter === 'available' && !doc.available) return false;
      if (doctorSearch.trim()) {
        const term = doctorSearch.toLowerCase();
        const matchName = doc.name?.toLowerCase().includes(term);
        const matchSpec = doc.specialty?.toLowerCase().includes(term);
        if (!matchName && !matchSpec) return false;
      }
      return true;
    });
  }, [doctors, doctorFilter, doctorSearch]);

  const visibleDoctors = showAllDoctors ? filteredDoctors : filteredDoctors.slice(0, 4);

  if (loading || !hospital) {
    return (
      <div className="min-h-screen bg-sky-50 pt-16 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading hospital data & real-time beds…" />
      </div>
    );
  }

  const totalBeds =
    (hospital.beds?.general?.total || 0) +
    (hospital.beds?.acWard?.total || 0) +
    (hospital.beds?.private?.total || 0);
  const availBeds =
    (hospital.beds?.general?.available || 0) +
    (hospital.beds?.acWard?.available || 0) +
    (hospital.beds?.private?.available || 0);

  const availDoctorsCount = doctors.filter((d) => d.available).length;

  return (
    <PageTransition type="slideRight">
      <div className="min-h-screen bg-sky-50 pt-16 pb-16">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-blue-900 text-white px-4 sm:px-6 pt-6 pb-12 shadow-md">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/hospitals')}
              className="inline-flex items-center gap-1.5 text-sky-200 hover:text-white mb-4 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
            >
              <ArrowLeft size={14} /> Back to Directory
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {hospital.emergencyOpen ? (
                    <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="status-dot online" /> 24/7 Emergency Open
                    </span>
                  ) : (
                    <span className="bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="status-dot offline" /> Emergency Closed
                    </span>
                  )}
                  {hospital.distanceKm && (
                    <span className="bg-sky-800 text-sky-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Navigation size={11} /> {hospital.distanceKm} km from you
                    </span>
                  )}
                </div>

                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {hospital.name}
                </h1>
                <div className="flex items-center gap-1.5 mt-1.5 text-sky-200 text-sm">
                  <MapPin size={14} className="flex-shrink-0 text-sky-400" />
                  <span>{hospital.address}</span>
                </div>

                {/* Specialties tags */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hospital.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="bg-white/10 text-sky-100 text-xs font-medium px-2.5 py-0.5 rounded-lg backdrop-blur-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {hospital.rating && (
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/15 shadow-sm self-start">
                  <div className="flex items-center gap-1 text-amber-300 font-bold text-xl">
                    <Star size={18} className="fill-amber-300" />
                    <span>{hospital.rating}</span>
                  </div>
                  <span className="text-[10px] text-sky-200 uppercase font-semibold mt-0.5">Rating</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlapping Content Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 space-y-5">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hospital.phone && (
              <a
                href={`tel:${hospital.phone}`}
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-md transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Call Hospital Reception</p>
                    <p className="text-xs text-sky-100">{hospital.phone}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg">Call Now</span>
              </a>
            )}

            <button
              onClick={() => {
                if (!hospital.location?.coordinates) return;
                const [lng, lat] = hospital.location.coordinates;
                const url = location
                  ? `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${lat},${lng}&travelmode=driving`
                  : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                window.open(url, '_blank');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Navigation size={18} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Get GPS Driving Route</p>
                  <p className="text-xs text-emerald-100">
                    {hospital.distanceKm ? `${hospital.distanceKm} km away` : 'Open in Google Maps'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg">Navigate ↗</span>
            </button>
          </div>

          {/* Interactive Map */}
          <div className="h-60 sm:h-72 rounded-3xl overflow-hidden shadow-card border border-sky-100">
            <HospitalMap userLocation={location} hospital={hospital} className="w-full h-full" />
          </div>

          {/* Emergency & OT Section (Visible to Ambulance / Hospital Admins or when user is logged in) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-sky-100 space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Emergency & Critical Care Availability"
                icon={<Activity size={16} className="text-red-500" />}
              />
              {!showEmergency && (
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  Public Overview
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <EmergencyBlock
                icon="🏥"
                label="Operation Theatre (OT)"
                badge="Priority 1"
                available={hospital.operationTheatre?.available || 0}
                total={hospital.operationTheatre?.total || 0}
                occupied={hospital.operationTheatre?.occupied || 0}
                bgClass="bg-red-50/70 border-red-200"
                textClass="text-red-700"
                barColor="#ef4444"
              />

              <EmergencyBlock
                icon="⚕️"
                label="Emergency Ward (EW)"
                badge="Priority 2"
                available={hospital.emergencyWard?.available || 0}
                total={hospital.emergencyWard?.total || 0}
                occupied={hospital.emergencyWard?.occupied || 0}
                bgClass="bg-amber-50/70 border-amber-200"
                textClass="text-amber-800"
                barColor="#f59e0b"
              />
            </div>
          </div>

          {/* Bed Inventory Breakdown */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title="Bed Inventory Breakdown"
                icon={<BedDouble size={16} className="text-sky-600" />}
              />
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                {availBeds} of {totalBeds} Total Beds Free
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                { key: 'general', label: 'General Ward', desc: 'Non-AC Ward' },
                { key: 'acWard', label: 'AC Ward', desc: 'Air Conditioned' },
                { key: 'private', label: 'Private Room', desc: 'Individual Suite' },
              ].map(({ key, label, desc }) => {
                const avail = hospital.beds?.[key]?.available ?? 0;
                const tot = hospital.beds?.[key]?.total ?? 0;
                const pct = getAvailabilityPercent(avail, tot);
                return (
                  <div key={key} className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-sky-900">{label}</span>
                      <span className="text-[10px] font-semibold text-gray-500">{desc}</span>
                    </div>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="stat-number text-2xl text-sky-900">{avail}</span>
                      <span className="text-xs text-gray-500 font-medium">/ {tot} available</span>
                    </div>
                    <BedAvailabilityBar available={avail} total={tot} showNumbers={false} />
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">Total Hospital Capacity</p>
                <p className="text-xs text-gray-500">Includes General, AC and Private accommodations</p>
              </div>
              <div className="text-right">
                <p className="stat-number text-xl font-bold text-sky-700">
                  {Math.round((availBeds / (totalBeds || 1)) * 100)}% Available
                </p>
              </div>
            </div>
          </div>

          {/* On-Duty Doctors Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-sky-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <SectionHeader
                  title="Medical Specialists & On-Duty Doctors"
                  icon={<Users size={16} className="text-emerald-600" />}
                />
                <p className="text-xs text-gray-500">
                  {availDoctorsCount} of {doctors.length} doctors currently on active duty
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDoctorFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    doctorFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({doctors.length})
                </button>
                <button
                  onClick={() => setDoctorFilter('available')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                    doctorFilter === 'available'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Available Now ({availDoctorsCount})
                </button>
              </div>
            </div>

            {/* Doctor Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Search doctors by name or specialty (e.g. Cardiology, Dr. Ramesh)..."
                className="w-full pl-9 pr-4 py-2 bg-sky-50/70 border border-sky-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {docLoading ? (
              <LoadingSpinner size="sm" text="Fetching doctor rosters…" />
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {visibleDoctors.map((doc, i) => (
                    <DoctorCard key={doc._id} doctor={doc} index={i} />
                  ))}
                </AnimatePresence>

                {filteredDoctors.length > 4 && (
                  <button
                    onClick={() => setShowAllDoctors(!showAllDoctors)}
                    className="w-full py-3 text-sky-700 text-xs font-bold hover:bg-sky-50 rounded-xl transition flex items-center justify-center gap-1 border border-sky-100 mt-2"
                  >
                    {showAllDoctors ? (
                      <><ChevronUp size={14} /> Show Less</>
                    ) : (
                      <><ChevronDown size={14} /> Show All {filteredDoctors.length} Doctors</>
                    )}
                  </button>
                )}

                {filteredDoctors.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-3xl mb-2">👨‍⚕️</p>
                    <p className="text-sm font-semibold text-gray-600">No doctors match your search</p>
                    <p className="text-xs text-gray-400 mt-0.5">Try clearing the doctor search filter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HospitalDetailPage;
