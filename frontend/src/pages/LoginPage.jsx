import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Activity, LogIn, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/common/PageTransition';

const DEMO_ACCOUNTS = [
  { role: 'user', label: '👤 Citizen / Patient', email: 'karthik@medbed.com', password: 'user123', desc: 'Coimbatore citizen access' },
  { role: 'ambulance', label: '🚑 108 Ambulance Dispatch', email: 'driver@medbed.com', password: 'driver123', desc: 'Coimbatore emergency triage' },
  { role: 'hospital', label: '🏥 Ganga Hospital Admin', email: 'ganga@medbed.com', password: 'hospital123', desc: 'Manage Ganga Hospital inventory' },
  { role: 'hospital', label: '🏥 KMCH Hospital Admin', email: 'kmch@medbed.com', password: 'hospital123', desc: 'Manage KMCH live beds & OT' },
  { role: 'hospital', label: '🏥 PSG Hospitals Admin', email: 'psg@medbed.com', password: 'hospital123', desc: 'Manage PSG doctors & beds' },
  { role: 'hospital', label: '🏥 Sri Ramakrishna Admin', email: 'ramakrishna@medbed.com', password: 'hospital123', desc: 'Manage Ramakrishna data' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'hospital') {
        navigate('/admin');
      } else {
        navigate('/hospitals');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Try a demo account below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setLoading(true);
    try {
      const user = await login(acc.email, acc.password);
      if (user.role === 'hospital') {
        navigate('/admin');
      } else {
        navigate('/hospitals');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition type="scale">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-glow">
                <Activity size={22} className="text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-sky-950">
                Med<span className="text-sky-500">Bed</span>
              </span>
            </Link>
            <h1 className="font-display font-extrabold text-2xl text-gray-900">Welcome back</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Sign in to your Coimbatore dashboard</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-card border border-sky-100 p-6 sm:p-7"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4"
              >
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-600">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@hospital.com"
                  className="w-full border border-sky-200 bg-sky-50/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full border border-sky-200 bg-sky-50/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-glow text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><LogIn size={16} /> Sign In</>
                )}
              </motion.button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-sky-600 font-bold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>

          {/* 1-Click Fast Demo Logins */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-5 bg-white/80 backdrop-blur-md border border-sky-200 rounded-3xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <p className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                1-Click Coimbatore Demo Logins
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  disabled={loading}
                  onClick={() => handleQuickLogin(acc)}
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-sky-100 hover:border-sky-300 bg-sky-50/50 hover:bg-sky-100/70 transition text-left group"
                >
                  <div className="truncate pr-1">
                    <p className="text-xs font-bold text-gray-800 group-hover:text-sky-700 truncate">{acc.label}</p>
                    <p className="text-[10px] text-gray-500 font-mono truncate">{acc.email}</p>
                  </div>
                  <span className="text-[10px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-lg shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition flex-shrink-0">
                    Login →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
