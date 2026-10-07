import { motion } from 'framer-motion';
import { getAvailabilityPercent, getAvailabilityColor } from '../../utils/helpers';

const BedAvailabilityBar = ({ available, total, label, showNumbers = true }) => {
  const percent = getAvailabilityPercent(available, total);
  const color = getAvailabilityColor(percent);

  return (
    <div className="space-y-1">
      {(label || showNumbers) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
          {showNumbers && (
            <span className="text-xs font-semibold text-gray-700">
              {available}/{total}
            </span>
          )}
        </div>
      )}
      <div className="availability-bar">
        <motion.div
          className="availability-bar-fill"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      <p className="text-xs text-gray-400">{percent}% available</p>
    </div>
  );
};

export default BedAvailabilityBar;
