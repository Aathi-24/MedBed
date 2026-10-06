import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Activity } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const NotFoundPage = () => (
  <PageTransition type="scale">
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center px-4 pt-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6"
      >
        🏥
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display font-bold text-5xl text-sky-900 mb-2"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 text-lg mb-8"
      >
        Oops! This page doesn't exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow-glow"
        >
          <Home size={18} /> Back to Home
        </Link>
      </motion.div>
    </div>
  </PageTransition>
);

export default NotFoundPage;
