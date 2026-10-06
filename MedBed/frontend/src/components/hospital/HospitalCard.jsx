import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Activity, Star, BedDouble, Navigation } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAvailabilityPercent } from '../../utils/helpers';

const PriorityBadge = ({ label }) => (
  <span className="priority-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
    {label}
  </span>
);

const MiniStat = ({ label, available, total, color }) => (
  <div className={`rounded-xl p-2.5 ${color} border`}>
    <p className="text-[10px] font-bold uppercase tracking-wide opacity-80 mb-1">{label}</p>
    <p className="stat-number text-base leading-none font-extrabold">
      {available}<span className="text-xs font-normal opacity-60">/{total}</span>
    </p>
    <p className="text-[9px] opacity-70 mt-1 font-medium">available slots</p>
  </div>
);

const HospitalCard = ({ hospital, index }) => {
  const navigate = useNavigate();
  const { isAmbulance, isHospital } = useAuth();
  const showEmergency = isAmbulance() || isHospital();

  const bedTotal =
    (hospital.beds?.general?.total || 0) +
    (hospital.beds?.acWard?.total || 0) +
    (hospital.beds?.private?.total || 0);
  const bedAvail =
    (hospital.beds?.general?.available || 0) +
    (hospital.beds?.acWard?.available || 0) +
    (hospital.beds?.private?.available || 0);

  const bedPercent = getAvailabilityPercent(bedAvail, bedTotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.35 }}
      className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-sky-100 hover:border-sky-300 cursor-pointer group flex flex-col justify-between"
      onClick={() => navigate(`/hospitals/${hospital._id}`)}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center font-display font-bold text-sm flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              {index + 1}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-gray-900 group-hover:text-sky-600 transition-colors truncate">
                  {hospital.name}
                </h3>
                {hospital.rating && (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex-shrink-0">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {hospital.rating}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                <MapPin size={13} className="text-sky-500 flex-shrink-0" />
                <span className="truncate">{hospital.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {hospital.distanceKm !== null && hospital.distanceKm !== undefined ? (
              <span className="flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-100 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs">
                <Navigation size={11} className="text-sky-600" />
                {hospital.distanceKm} km
              </span>
            ) : null}

            {hospital.emergencyOpen ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="status-dot online" />
                Emergency Open
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                <span className="status-dot offline" />
                Emergency Closed
              </span>
            )}
          </div>
        </div>

        {/* Specialties Tags */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hospital.specialties.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-md"
              >
                {spec}
              </span>
            ))}
            {hospital.specialties.length > 3 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{hospital.specialties.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Emergency Availability (Paramedic / Hospital Admins View) */}
      {showEmergency && (
        <div className="px-4 sm:px-5 pb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Activity size={12} className="text-red-500" /> Emergency Triage Status
          </p>
          <div className="grid grid-cols-2 gap-2">
            <MiniStat
              label={<>OT Slots <PriorityBadge label="P1" /></>}
              available={hospital.operationTheatre?.available || 0}
              total={hospital.operationTheatre?.total || 0}
              color="bg-red-50/70 text-red-900 border-red-200"
            />
            <MiniStat
              label={<>Emergency Ward <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded">P2</span></>}
              available={hospital.emergencyWard?.available || 0}
              total={hospital.emergencyWard?.total || 0}
              color="bg-amber-50/70 text-amber-900 border-amber-200"
            />
          </div>
        </div>
      )}

      {/* Bed Breakdown */}
      <div className="px-4 sm:px-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <BedDouble size={12} className="text-sky-500" /> Ward Bed Availability
          </p>
          <span className="text-[11px] font-bold text-sky-700">
            {bedAvail} / {bedTotal} Total Free
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'general', label: 'General' },
            { key: 'acWard', label: 'AC Ward' },
            { key: 'private', label: 'Private' },
          ].map(({ key, label }) => {
            const avail = hospital.beds?.[key]?.available ?? 0;
            const tot = hospital.beds?.[key]?.total ?? 0;
            return (
              <div key={key} className="bg-sky-50/70 border border-sky-100 rounded-2xl p-2.5 text-center">
                <p className="text-[10px] font-bold text-sky-900 uppercase tracking-wide">{label}</p>
                <p className="stat-number text-lg text-sky-950 font-bold mt-0.5">
                  {avail}
                  <span className="text-[10px] text-gray-400 font-normal">/{tot}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 sm:px-5 pb-4 pt-1">
        <div className="flex items-center justify-between py-2.5 px-4 rounded-2xl bg-sky-50 group-hover:bg-sky-600 group-hover:text-white transition-all text-sky-700 text-xs font-bold border border-sky-200 group-hover:border-sky-600 shadow-2xs">
          <span>View Doctors & Live Navigation</span>
          <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
