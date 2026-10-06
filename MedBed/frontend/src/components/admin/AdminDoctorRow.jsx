import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, Trash2, Clock, Phone, Award, Edit3, X } from 'lucide-react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const AdminDoctorRow = ({ doctor, index, onSave, onEdit, onDelete }) => {
  const [available, setAvailable] = useState(doctor.available);
  const [shiftStart, setShiftStart] = useState(doctor.shiftStart || '08:00 AM');
  const [shiftEnd, setShiftEnd] = useState(doctor.shiftEnd || '04:00 PM');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Quick edit mode
  const [isEditingFull, setIsEditingFull] = useState(false);
  const [name, setName] = useState(doctor.name);
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [phone, setPhone] = useState(doctor.phone || '');
  const [qualification, setQualification] = useState(doctor.qualification || '');
  const [experience, setExperience] = useState(doctor.experience || 0);

  const handleQuickSave = async () => {
    setSaving(true);
    try {
      await onSave(doctor._id, available, shiftStart, shiftEnd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleFullUpdate = async (e) => {
    e.preventDefault();
    if (onEdit) {
      setSaving(true);
      try {
        await onEdit(doctor._id, {
          name,
          specialty,
          phone,
          qualification,
          experience: parseInt(experience) || 0,
          shiftStart,
          shiftEnd,
          available
        });
        setIsEditingFull(false);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const initials = getInitials(doctor.name);
  const avatarColor = getAvatarColor(doctor.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-sky-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 hover:border-sky-200 transition"
    >
      {/* View Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}>
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-base">{doctor.name}</h4>
              {doctor.qualification && (
                <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded">
                  {doctor.qualification}
                </span>
              )}
            </div>
            <p className="text-xs text-sky-600 font-semibold">{doctor.specialty} · {doctor.experience || 0} yrs exp</p>
          </div>
        </div>

        {/* Status Toggle & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-xl">
            <span className="text-[11px] font-semibold text-gray-600">On Duty:</span>
            <button
              onClick={() => {
                const nextAvail = !available;
                setAvailable(nextAvail);
                onSave(doctor._id, nextAvail, shiftStart, shiftEnd);
              }}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${available ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
                animate={{ x: available ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
              />
            </button>
          </div>

          <button
            onClick={() => setIsEditingFull(!isEditingFull)}
            className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition"
            title="Edit Doctor Details"
          >
            <Edit3 size={15} />
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(doctor._id, doctor.name)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="Remove Doctor"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Full Edit Form Modal or Accordion */}
      {isEditingFull ? (
        <form onSubmit={handleFullUpdate} className="pt-3 border-t border-sky-100 space-y-3 bg-sky-50/50 p-3 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Doctor Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-sky-200 rounded-lg px-2.5 py-1.5 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                className="w-full border border-sky-200 rounded-lg px-2.5 py-1.5 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="MBBS, MD"
                className="w-full border border-sky-200 rounded-lg px-2.5 py-1.5 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Years of Experience</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                min="0"
                className="w-full border border-sky-200 rounded-lg px-2.5 py-1.5 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingFull(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm"
            >
              {saving ? 'Saving…' : 'Save Details'}
            </button>
          </div>
        </form>
      ) : (
        /* Quick Shift Hours row */
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 flex-1">
            <Clock size={13} className="text-sky-500 flex-shrink-0" />
            <span className="font-semibold text-gray-500">Duty Shift:</span>
            <input
              type="text"
              value={shiftStart}
              onChange={(e) => setShiftStart(e.target.value)}
              placeholder="08:00 AM"
              className="w-24 border border-sky-200 rounded-lg px-2 py-1 text-xs bg-sky-50 focus:bg-white"
            />
            <span className="text-gray-400">to</span>
            <input
              type="text"
              value={shiftEnd}
              onChange={(e) => setShiftEnd(e.target.value)}
              placeholder="04:00 PM"
              className="w-24 border border-sky-200 rounded-lg px-2 py-1 text-xs bg-sky-50 focus:bg-white"
            />
          </div>

          <button
            onClick={handleQuickSave}
            disabled={saving}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              saved
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-sky-800 hover:bg-sky-900 text-white'
            }`}
          >
            {saved ? <CheckCircle size={13} /> : <Save size={13} />}
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save Shift'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDoctorRow;
