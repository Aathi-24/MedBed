import { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Minus, Plus } from 'lucide-react';

const CounterButton = ({ onClick, icon, disabled }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    disabled={disabled}
    className="w-10 h-10 rounded-full bg-sky-900 text-white flex items-center justify-center hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-sm"
  >
    {icon}
  </motion.button>
);

const BedCounter = ({ ward, available, total, onAvailableChange, onTotalChange }) => (
  <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-4">
    <div className="flex items-center gap-2">
      <BedDouble size={18} className="text-sky-500" />
      <h3 className="font-semibold text-gray-900">{ward} Ward</h3>
    </div>

    <div className="space-y-3">
      <div>
        <p className="text-xs text-gray-500 mb-2 font-medium">Available</p>
        <div className="flex items-center justify-between">
          <CounterButton
            onClick={() => onAvailableChange(Math.max(0, available - 1))}
            icon={<Minus size={16} />}
            disabled={available <= 0}
          />
          <motion.span
            key={available}
            initial={{ scale: 1.3, color: '#0ea5e9' }}
            animate={{ scale: 1, color: '#1e293b' }}
            className="stat-number text-3xl w-16 text-center"
          >
            {available}
          </motion.span>
          <CounterButton
            onClick={() => onAvailableChange(Math.min(total, available + 1))}
            icon={<Plus size={16} />}
            disabled={available >= total}
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2 font-medium">Total Beds</p>
        <div className="flex items-center justify-between">
          <CounterButton
            onClick={() => onTotalChange(Math.max(available, total - 1))}
            icon={<Minus size={16} />}
            disabled={total <= 0}
          />
          <motion.span
            key={total}
            initial={{ scale: 1.3, color: '#0ea5e9' }}
            animate={{ scale: 1, color: '#1e293b' }}
            className="stat-number text-3xl w-16 text-center"
          >
            {total}
          </motion.span>
          <CounterButton
            onClick={() => onTotalChange(total + 1)}
            icon={<Plus size={16} />}
          />
        </div>
      </div>
    </div>
  </div>
);

export default BedCounter;
