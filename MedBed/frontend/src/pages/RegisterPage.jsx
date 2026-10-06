import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Activity, UserPlus, AlertCircle, User, Car, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/hospitalService';
import PageTransition from '../components/common/PageTransition';

const RoleOption = ({ value, selected, onSelect, icon, label, desc }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(value)}
    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
      selected
        ? 'border-sky-500 bg-sky-50 shadow-sm'
        : 'border-gray-200 hover:border-sky-200 bg-white'
    }`}
  >
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {icon}
    </div>
    <div>
      <p className={`text-sm font-bold ${selected ? 'text-sky-900' : 'text-gray-800'}`}>{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  </motion.button>
);

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalsList, setHospitalsList] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fetch hospital list in case hospital role is picked
    const fetchHospitalsList = async () => {
      try {
        const { data } = await getHospitals();
        setHospitalsList(data);
        if (data.length > 0) {
          setHospitalId(data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load hospitals for registration:', err);
      }
    };
    fetchHospitalsList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (role === 'hospital' && !hospitalId) {
      setError('Please select a hospital to manage.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password, role, role === 'hospital' ? hospitalId : null);
      if (user.role === 'hospital') {
        navigate('/admin');
      } else {
        navigate('/hospitals');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition type="flip">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md">
          {/* Logo Header */}
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
            <h1 className="font-display font-extrabold text-2xl text-gray-900">Create your account</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Join the live healthcare and bed tracking network
            </p>
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
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Dr. Priya Sundaram or John Doe"
                  className="w-full border border-sky-200 bg-sky-50/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@hospital.com"
                  className="w-full border border-sky-200 bg-sky-50/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full border border-sky-200 bg-sky-50/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Account Role */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Account Role</label>
                <div className="space-y-2">
                  <RoleOption
                    value="user"
                    selected={role === 'user'}
                    onSelect={setRole}
                    icon={<User size={16} />}
                    label="Patient / Citizen"
                    desc="Search hospital beds and specialist doctors"
                  />
                  <RoleOption
                    value="ambulance"
                    selected={role === 'ambulance'}
                    onSelect={setRole}
                    icon={<Car size={16} />}
                    label="Ambulance Paramedic"
                    desc="Triage view with OT and emergency ward slots"
                  />
                  <RoleOption
                    value="hospital"
                    selected={role === 'hospital'}
                    onSelect={setRole}
                    icon={<Building2 size={16} />}
                    label="Hospital Administrator"
                    desc="Update beds, emergency status, and doctor rosters"
                  />
                </div>
              </div>

              {/* Hospital Affiliation Selector (If Hospital Admin) */}
              {role === 'hospital' && (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 space-y-2">
                  <label className="block text-xs font-bold text-sky-900 uppercase">
                    Select Your Hospital *
                  </label>
                  <select
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    className="w-full border border-sky-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  >
                    {hospitalsList.map((h) => (
                      <option key={h._id} value={h._id}>
                        {h.name} — {h.address}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500">
                    You will manage the live bed inventory and doctors for this hospital.
                  </p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-glow text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><UserPlus size={16} /> Create Account</>
                )}
              </motion.button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-sky-600 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
