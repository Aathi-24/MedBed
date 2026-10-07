import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <motion.div
        className={`${sizes[size]} border-3 border-sky-200 border-t-sky-500 rounded-full`}
        style={{ borderWidth: 3 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-sm text-sky-600 font-medium">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-50 space-y-4">
    <div className="skeleton h-5 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/2 rounded" />
    <div className="grid grid-cols-2 gap-3">
      <div className="skeleton h-16 rounded-xl" />
      <div className="skeleton h-16 rounded-xl" />
    </div>
    <div className="skeleton h-3 w-full rounded" />
  </div>
);

export default LoadingSpinner;
