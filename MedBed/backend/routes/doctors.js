const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

// Helper to check doctor's hospital admin rights
const checkDoctorAdmin = (req, hospitalId) => {
  if (!req.user || req.user.role !== 'hospital') {
    return false;
  }
  const userHospitalId = req.user.hospitalId?._id
    ? req.user.hospitalId._id.toString()
    : req.user.hospitalId?.toString();
  return userHospitalId === hospitalId.toString();
};

// @route   GET /api/doctors
// @desc    Get doctors optionally filtered by hospitalId, specialty, availability
router.get('/', async (req, res) => {
  try {
    const { hospitalId, specialty, availableOnly } = req.query;
    const query = {};

    if (hospitalId) query.hospitalId = hospitalId;
    if (specialty && specialty !== 'All') {
      query.specialty = { $regex: new RegExp(specialty, 'i') };
    }
    if (availableOnly === 'true' || availableOnly === true) {
      query.available = true;
    }

    const doctors = await Doctor.find(query)
      .populate('hospitalId', 'name address phone emergencyOpen')
      .sort({ available: -1, name: 1 });

    res.json(doctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching doctors' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospitalId', 'name address phone emergencyOpen');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    console.error('Fetch doctor error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching doctor' });
  }
});

// @route   POST /api/doctors
// @desc    Add doctor (hospital admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { name, specialty, hospitalId, shiftStart, shiftEnd, phone, qualification, experience } = req.body;

    if (!name || !specialty || !hospitalId) {
      return res.status(400).json({ message: 'Name, specialty, and hospitalId are required' });
    }

    if (!checkDoctorAdmin(req, hospitalId)) {
      return res.status(403).json({ message: 'Forbidden: You can only add doctors to your assigned hospital' });
    }

    const doctor = await Doctor.create({
      name: name.trim(),
      specialty: specialty.trim(),
      hospitalId,
      shiftStart: shiftStart || '08:00 AM',
      shiftEnd: shiftEnd || '04:00 PM',
      phone: phone || '',
      qualification: qualification || '',
      experience: parseInt(experience) || 0,
      available: true
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate('hospitalId', 'name');
    res.status(201).json(populatedDoctor);
  } catch (error) {
    console.error('Add doctor error:', error);
    res.status(500).json({ message: error.message || 'Server error adding doctor' });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor info (hospital admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (!checkDoctorAdmin(req, doctor.hospitalId)) {
      return res.status(403).json({ message: 'Forbidden: You can only update doctors in your assigned hospital' });
    }

    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        name: req.body.name ? req.body.name.trim() : doctor.name,
        specialty: req.body.specialty ? req.body.specialty.trim() : doctor.specialty
      },
      { new: true }
    ).populate('hospitalId', 'name');

    res.json(updated);
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: error.message || 'Server error updating doctor' });
  }
});

// @route   PUT /api/doctors/:id/availability
// @desc    Toggle doctor availability & shift times (hospital admin only)
router.put('/:id/availability', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (!checkDoctorAdmin(req, doctor.hospitalId)) {
      return res.status(403).json({ message: 'Forbidden: You can only update doctor availability in your assigned hospital' });
    }

    if (req.body.available !== undefined) {
      doctor.available = Boolean(req.body.available);
    }
    if (req.body.shiftStart) doctor.shiftStart = req.body.shiftStart;
    if (req.body.shiftEnd) doctor.shiftEnd = req.body.shiftEnd;

    await doctor.save();
    const populated = await Doctor.findById(doctor._id).populate('hospitalId', 'name');
    res.json(populated);
  } catch (error) {
    console.error('Toggle doctor availability error:', error);
    res.status(500).json({ message: error.message || 'Server error updating availability' });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (hospital admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (!checkDoctorAdmin(req, doctor.hospitalId)) {
      return res.status(403).json({ message: 'Forbidden: You can only delete doctors from your assigned hospital' });
    }

    await doctor.deleteOne();
    res.json({ message: 'Doctor removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: error.message || 'Server error removing doctor' });
  }
});

module.exports = router;
