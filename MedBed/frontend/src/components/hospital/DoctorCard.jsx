import { motion } from 'framer-motion';
import { Clock, Phone } from 'lucide-react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const DoctorCard = ({ doctor, index, compact = false }) => {
  const initials = getInitials(doctor.name);
  const avatarColor = getAvatarColor(doctor.name);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${doctor.available
        ? 'bg-white border-sky-100 shadow-sm'
        : 'bg-gray-50 border-gray-100'
        } ${compact ? 'p-3' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`font-semibold text-sm truncate ${doctor.available ? 'text-gray-900' : 'text-gray-500'}`}>
            {doctor.name}
          </h4>
          <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${doctor.available
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-gray-200 text-gray-500'
            }`}>
            <span className={`status-dot ${doctor.available ? 'online' : 'offline'}`} />
            {doctor.available ? 'Available' : 'Off duty'}
          </span>
        </div>

        <p className={`text-xs mt-0.5 ${doctor.available ? 'text-sky-600 font-medium' : 'text-gray-400'}`}>
          {doctor.specialty}
        </p>

        {doctor.qualification && !compact && (
          <p className="text-[10px] text-gray-400 mt-0.5">{doctor.qualification}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
            <Clock size={10} className="text-sky-400" />
            {doctor.shiftStart} – {doctor.shiftEnd}
          </span>
          {doctor.experience > 0 && !compact && (
            <span className="text-[10px] text-gray-400">{doctor.experience} yrs exp</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
