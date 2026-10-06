import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, BedDouble, Users, Activity, LogOut,
  CheckCircle, AlertCircle, ToggleLeft, ToggleRight,
  RefreshCw, Plus, UserPlus, Phone, MapPin, Mail, Save, X, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHospitals } from '../hooks/useHospitals';
import { useDoctors } from '../hooks/useDoctors';
import BedCounter from '../components/admin/BedCounter';
import AdminDoctorRow from '../components/admin/AdminDoctorRow';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  updateBeds,
  updateOT,
  updateEmergency,
  toggleEmergencyStatus,
  updateHospitalInfo
} from '../services/hospitalService';

const TAB_BEDS = 'Beds Inventory';
const TAB_EMERGENCY = 'OT & Emergency';
const TAB_DOCTORS = 'Doctor Rosters';
const TAB_HOSPITAL = 'Hospital Profile';
const TABS = [TAB_BEDS, TAB_EMERGENCY, TAB_DOCTORS, TAB_HOSPITAL];

const Toast = ({ message, type = 'success' }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold border ${
      type === 'success'
        ? 'bg-emerald-600 text-white border-emerald-500'
        : 'bg-red-600 text-white border-red-500'
    }`}
  >
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {message}
  </motion.div>
);

const AddDoctorModal = ({ isOpen, onClose, onAdd, hospitalId }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState(5);
  const [phone, setPhone] = useState('');
  const [shiftStart, setShiftStart] = useState('08:00 AM');
  const [shiftEnd, setShiftEnd] = useState('04:00 PM');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAdd({
        name,
        specialty,
        qualification,
        experience: parseInt(experience) || 0,
        phone,
        shiftStart,
        shiftEnd,
        hospitalId
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <UserPlus size={18} />
            </div>
            <h3 className="font-display font-bold text-lg text-gray-900">Add New Doctor</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Priya Sundaram"
              className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Specialty *</label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Cardiology"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. MBBS, MD"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Years Experience</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-98765-43210"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Shift Start</label>
              <input
                type="text"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                placeholder="08:00 AM"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Shift End</label>
              <input
                type="text"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                placeholder="04:00 PM"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm"
            >
              {submitting ? 'Adding…' : 'Add Doctor to Roster'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPage = () => {
  const { user, logout, isHospital } = useAuth();
  const navigate = useNavigate();
  const { selectedHospital: hospital, fetchById } = useHospitals();
  const {
    doctors,
    fetchByHospital,
    toggleAvailability,
    addNewDoctor,
    editDoctor,
    removeDoctor
  } = useDoctors();

  const [activeTab, setActiveTab] = useState(TAB_BEDS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');

  // Bed state
  const [beds, setBeds] = useState({
    general: { available: 0, total: 0 },
    acWard: { available: 0, total: 0 },
    private: { available: 0, total: 0 }
  });

  // OT state
  const [ot, setOt] = useState({ available: 0, total: 0, occupied: 0 });

  // EW state
  const [ew, setEw] = useState({ available: 0, total: 0, occupied: 0 });
  const [emergencyOpen, setEmergencyOpen] = useState(true);

  // Hospital info state
  const [hospitalInfo, setHospitalInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    specialties: ''
  });

  const hospitalId = user?.hospitalId?._id || user?.hospitalId;

  useEffect(() => {
    if (!isHospital()) {
      navigate('/login');
      return;
    }
    if (hospitalId) {
      fetchById(hospitalId);
      fetchByHospital(hospitalId);
    }
  }, [hospitalId]);

  useEffect(() => {
    if (hospital) {
      setBeds({
        general: { ...hospital.beds?.general },
        acWard: { ...hospital.beds?.acWard },
        private: { ...hospital.beds?.private },
      });
      setOt({ ...hospital.operationTheatre });
      setEw({ ...hospital.emergencyWard });
      setEmergencyOpen(hospital.emergencyOpen);
      setHospitalInfo({
        name: hospital.name || '',
        address: hospital.address || '',
        phone: hospital.phone || '',
        email: hospital.email || '',
        specialties: (hospital.specialties || []).join(', ')
      });
    }
  }, [hospital]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateBeds = async () => {
    setSaving(true);
    try {
      await updateBeds(hospitalId, beds);
      showToast('Bed counts updated and synchronized successfully!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update beds', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOT = async () => {
    setSaving(true);
    try {
      await updateOT(hospitalId, ot);
      showToast('Operation Theatre slots saved!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update OT data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEW = async () => {
    setSaving(true);
    try {
      await updateEmergency(hospitalId, ew);
      showToast('Emergency Ward data saved!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update emergency ward', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEmergency = async () => {
    const newStatus = !emergencyOpen;
    setEmergencyOpen(newStatus);
    try {
      await toggleEmergencyStatus(hospitalId, newStatus);
      showToast(`Emergency status changed to: ${newStatus ? 'OPEN' : 'CLOSED'}`);
    } catch (e) {
      setEmergencyOpen(!newStatus);
      showToast('Failed to update emergency status', 'error');
    }
  };

  const handleUpdateHospitalInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specialtiesArray = hospitalInfo.specialties
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateHospitalInfo(hospitalId, {
        name: hospitalInfo.name,
        address: hospitalInfo.address,
        phone: hospitalInfo.phone,
        email: hospitalInfo.email,
        specialties: specialtiesArray
      });
      showToast('Hospital profile saved successfully!');
    } catch (e) {
      showToast('Failed to update hospital profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDoctorSave = async (id, available, shiftStart, shiftEnd) => {
    try {
      await toggleAvailability(id, available, shiftStart, shiftEnd);
      showToast('Doctor status updated!');
    } catch (err) {
      showToast('Failed to update doctor availability', 'error');
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      await addNewDoctor(doctorData);
      showToast(`Doctor ${doctorData.name} added successfully!`);
    } catch (err) {
      showToast('Failed to add doctor', 'error');
    }
  };

  const handleEditDoctor = async (id, doctorData) => {
    try {
      await editDoctor(id, doctorData);
      showToast('Doctor details updated!');
    } catch (err) {
      showToast('Failed to update doctor', 'error');
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from doctor roster?`)) {
      try {
        await removeDoctor(id);
        showToast(`${name} removed successfully.`);
      } catch (err) {
        showToast('Failed to remove doctor', 'error');
      }
    }
  };

  if (!hospital) {
    return (
      <div className="min-h-screen bg-sky-50 pt-16 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading hospital management console…" />
      </div>
    );
  }

  const filteredDoctors = doctors.filter((d) => {
    if (!doctorSearch.trim()) return true;
    const term = doctorSearch.toLowerCase();
    return d.name?.toLowerCase().includes(term) || d.specialty?.toLowerCase().includes(term);
  });

  return (
    <PageTransition type="slideRight">
      <div className="min-h-screen bg-sky-50 pt-16 pb-16">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-blue-900 text-white px-4 sm:px-6 pt-6 pb-0 shadow-md">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                  <span className="status-dot online" /> HOSPITAL ADMIN CONSOLE
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-1.5 text-sky-200 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl">{hospital.name}</h1>
                <p className="text-xs sm:text-sm text-sky-200 mt-0.5">{hospital.address}</p>
              </div>

              {/* Emergency Status Switch */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center gap-3 self-start sm:self-center">
                <div>
                  <p className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">Emergency Intake</p>
                  <p className={`text-xs font-extrabold ${emergencyOpen ? 'text-emerald-300' : 'text-red-300'}`}>
                    {emergencyOpen ? 'Accepting Patients' : 'Intake Paused'}
                  </p>
                </div>
                <button
                  onClick={handleToggleEmergency}
                  className="transition transform active:scale-95"
                  title="Toggle 24/7 Emergency Admission"
                >
                  {emergencyOpen ? (
                    <ToggleRight size={36} className="text-emerald-400" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-sky-50 text-sky-900 shadow-sm'
                      : 'text-sky-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          <AnimatePresence mode="wait">
            {/* 1. BEDS TAB */}
            {activeTab === TAB_BEDS && (
              <motion.div
                key="beds"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Summary banner */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'general', label: 'General Ward' },
                    { key: 'acWard', label: 'AC Ward' },
                    { key: 'private', label: 'Private Suite' },
                  ].map(({ key, label }) => (
                    <div key={key} className="bg-white border border-sky-100 rounded-2xl p-3.5 text-center shadow-sm">
                      <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">{label}</p>
                      <p className="stat-number text-2xl text-sky-950 mt-1">
                        {beds[key]?.available ?? 0}
                        <span className="text-xs text-gray-400 font-normal"> / {beds[key]?.total ?? 0}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">available free</p>
                    </div>
                  ))}
                </div>

                {/* Counter controls */}
                <div className="space-y-3">
                  {[
                    { key: 'general', ward: 'General' },
                    { key: 'acWard', ward: 'AC' },
                    { key: 'private', ward: 'Private' },
                  ].map(({ key, ward }) => (
                    <BedCounter
                      key={key}
                      ward={ward}
                      available={beds[key]?.available ?? 0}
                      total={beds[key]?.total ?? 0}
                      onAvailableChange={(v) =>
                        setBeds((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], available: Math.max(0, Math.min(prev[key]?.total || 0, v)) }
                        }))
                      }
                      onTotalChange={(v) =>
                        setBeds((prev) => {
                          const newTotal = Math.max(0, v);
                          return {
                            ...prev,
                            [key]: {
                              ...prev[key],
                              total: newTotal,
                              available: Math.min(prev[key]?.available || 0, newTotal)
                            }
                          };
                        })
                      }
                    />
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateBeds}
                  disabled={saving}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-glow text-sm sm:text-base"
                >
                  {saving ? <RefreshCw size={18} className="animate-spin" /> : <BedDouble size={18} />}
                  {saving ? 'Synchronizing Beds…' : 'Publish Updated Bed Inventory'}
                </motion.button>
              </motion.div>
            )}

            {/* 2. EMERGENCY & OT TAB */}
            {activeTab === TAB_EMERGENCY && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Operation Theatre */}
                <div className="bg-white rounded-3xl border border-red-100 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={20} className="text-red-500" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">Operation Theatre (OT) Slots</h3>
                        <p className="text-xs text-gray-500">Live surgical theatre slots for emergency surgery</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full uppercase">
                      Priority 1
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { label: 'Available Free Slots', key: 'available' },
                      { label: 'Total OT Rooms', key: 'total' },
                      { label: 'Currently Occupied', key: 'occupied' },
                    ].map(({ label, key }) => (
                      <div key={key} className="bg-red-50/50 border border-red-100 rounded-2xl p-3 text-center">
                        <p className="text-[10px] font-bold text-red-900 uppercase mb-2">{label}</p>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              setOt((p) => ({ ...p, [key]: Math.max(0, (parseInt(p[key]) || 0) - 1) }))
                            }
                            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center transition"
                          >
                            −
                          </button>
                          <span className="stat-number text-2xl font-extrabold text-red-950 w-12">{ot[key]}</span>
                          <button
                            onClick={() =>
                              setOt((p) => ({ ...p, [key]: (parseInt(p[key]) || 0) + 1 }))
                            }
                            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleUpdateOT}
                    disabled={saving}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-3.5 rounded-2xl transition text-xs uppercase tracking-wider"
                  >
                    {saving ? 'Updating…' : 'Save OT Status'}
                  </button>
                </div>

                {/* Emergency Ward */}
                <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚕️</span>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">Emergency Ward (EW) Beds</h3>
                        <p className="text-xs text-gray-500">Trauma and immediate triage beds</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full uppercase">
                      Priority 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { label: 'Available EW Beds', key: 'available' },
                      { label: 'Total EW Capacity', key: 'total' },
                      { label: 'Occupied EW Beds', key: 'occupied' },
                    ].map(({ label, key }) => (
                      <div key={key} className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3 text-center">
                        <p className="text-[10px] font-bold text-amber-900 uppercase mb-2">{label}</p>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              setEw((p) => ({ ...p, [key]: Math.max(0, (parseInt(p[key]) || 0) - 1) }))
                            }
                            className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center transition"
                          >
                            −
                          </button>
                          <span className="stat-number text-2xl font-extrabold text-amber-950 w-12">{ew[key]}</span>
                          <button
                            onClick={() =>
                              setEw((p) => ({ ...p, [key]: (parseInt(p[key]) || 0) + 1 }))
                            }
                            className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleUpdateEW}
                    disabled={saving}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold py-3.5 rounded-2xl transition text-xs uppercase tracking-wider"
                  >
                    {saving ? 'Updating…' : 'Save Emergency Ward Status'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. DOCTORS ROSTER TAB */}
            {activeTab === TAB_DOCTORS && (
              <motion.div
                key="doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-800">
                      {doctors.length} Specialist Doctors Listed
                    </p>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {doctors.filter((d) => d.available).length} On Duty Now
                    </span>
                  </div>

                  <button
                    onClick={() => setIsAddDoctorOpen(true)}
                    className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
                  >
                    <Plus size={15} /> Add New Doctor
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    placeholder="Search doctor roster by name or specialty..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-sky-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="space-y-3">
                  {filteredDoctors.map((doc, i) => (
                    <AdminDoctorRow
                      key={doc._id}
                      doctor={doc}
                      index={i}
                      onSave={handleDoctorSave}
                      onEdit={handleEditDoctor}
                      onDelete={handleDeleteDoctor}
                    />
                  ))}

                  {filteredDoctors.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-sky-100 p-6">
                      <p className="text-4xl mb-2">👨‍⚕️</p>
                      <p className="text-sm font-bold text-gray-700">No doctors match your criteria</p>
                      <button
                        onClick={() => setIsAddDoctorOpen(true)}
                        className="mt-3 text-xs text-sky-600 font-bold underline"
                      >
                        Add a doctor now
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 4. HOSPITAL PROFILE TAB */}
            {activeTab === TAB_HOSPITAL && (
              <motion.div
                key="hospital"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Hospital Information</h3>
                  <p className="text-xs text-gray-500">Update public hospital contact info and specialties</p>
                </div>

                <form onSubmit={handleUpdateHospitalInfo} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Hospital Name</label>
                    <input
                      type="text"
                      required
                      value={hospitalInfo.name}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                      className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Address</label>
                    <input
                      type="text"
                      required
                      value={hospitalInfo.address}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                      className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Emergency Hotline Phone</label>
                      <input
                        type="text"
                        value={hospitalInfo.phone}
                        onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                        className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Admin Email</label>
                      <input
                        type="email"
                        value={hospitalInfo.email}
                        onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                        className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Specialties (Comma Separated)</label>
                    <input
                      type="text"
                      value={hospitalInfo.specialties}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, specialties: e.target.value })}
                      placeholder="Cardiology, Neurology, Orthopedics"
                      className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-sm"
                  >
                    {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving…' : 'Save Hospital Profile'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onAdd={handleAddDoctor}
        hospitalId={hospitalId}
      />

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </PageTransition>
  );
};

export default AdminPage;
