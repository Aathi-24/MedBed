import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, User, Car, Building2, Menu, X, MapPin, Shield } from 'lucide-react';
import { useState } from 'react';

const RoleBadge = ({ role }) => {
  const styles = {
    user: 'bg-sky-100 text-sky-800 border-sky-200',
    ambulance: 'bg-amber-100 text-amber-800 border-amber-200',
    hospital: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
  const labels = {
    user: 'Citizen',
    ambulance: 'Ambulance',
    hospital: 'Hospital Admin'
  };
  const icons = {
    user: <User size={11} />,
    ambulance: <Car size={11} />,
    hospital: <Building2 size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[role] || styles.user}`}>
      {icons[role] || icons.user}
      {labels[role] || role}
    </span>
  );
};

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isHome = location.pathname === '/';
  const isHospitals = location.pathname.startsWith('/hospitals');
  const isAdmin = location.pathname === '/admin';

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isHome
          ? 'bg-white/85 backdrop-blur-xl border-b border-sky-100/80 shadow-2xs'
          : 'bg-white/95 backdrop-blur-xl shadow-xs border-b border-sky-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-sky-300/50 transition-all duration-300">
            <Activity size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl text-sky-950 leading-none">
              Med<span className="text-sky-500">Bed</span>
            </span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              Live Health Radar
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/hospitals"
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              isHospitals
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-gray-600 hover:text-sky-700 hover:bg-sky-50/60'
            }`}
          >
            <MapPin size={14} className={isHospitals ? 'text-sky-600' : 'text-gray-400'} />
            Find Hospitals & Beds
          </Link>

          {isLoggedIn() ? (
            <>
              {user.role === 'hospital' && (
                <Link
                  to="/admin"
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-sky-900 text-white shadow-sm'
                      : 'text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  <Shield size={14} />
                  Admin Console
                </Link>
              )}

              <div className="h-5 w-px bg-gray-200 mx-1" />

              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-xs shadow-2xs">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <RoleBadge role={user.role} />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition ml-1"
                title="Sign out"
              >
                <LogOut size={14} />
                <span className="hidden lg:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-gray-700 hover:text-sky-700 px-3 py-2 rounded-xl hover:bg-sky-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:shadow-glow"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-sky-50 text-sky-900 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-sky-100 px-4 py-4 space-y-3 shadow-lg"
        >
          {isLoggedIn() ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-800 font-bold text-sm">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <div className="mt-1"><RoleBadge role={user.role} /></div>
                </div>
              </div>

              <Link
                to="/hospitals"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-sm text-sky-800 hover:bg-sky-50"
              >
                🏥 Find Nearby Hospitals
              </Link>

              {user.role === 'hospital' && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-sm text-sky-800 bg-sky-50"
                >
                  🛡️ Hospital Admin Console
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/hospitals"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-sm text-sky-800 hover:bg-sky-50"
              >
                Find Hospitals & Beds
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-sm bg-sky-600 text-white text-center shadow-sm"
              >
                Create Account
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
