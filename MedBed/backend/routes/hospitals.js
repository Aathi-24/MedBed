const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const { protect } = require('../middleware/authMiddleware');

// Haversine distance calculator in km
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

// Helper to check hospital admin ownership
const checkHospitalAdmin = (req, hospitalId) => {
  if (!req.user || req.user.role !== 'hospital') {
    return false;
  }
  const userHospitalId = req.user.hospitalId?._id
    ? req.user.hospitalId._id.toString()
    : req.user.hospitalId?.toString();
  return userHospitalId === hospitalId.toString();
};

// @route   GET /api/hospitals
// @desc    Get all hospitals, optionally filtered by distance, search query, emergency status
router.get('/', async (req, res) => {
  try {
    const { lat, lng, search, specialty, emergencyOnly, limit = 50 } = req.query;

    const query = {};

    // Filter by emergency status
    if (emergencyOnly === 'true' || emergencyOnly === true) {
      query.emergencyOpen = true;
    }

    // Filter by specialty
    if (specialty && specialty !== 'All') {
      query.specialties = { $regex: new RegExp(specialty, 'i') };
    }

    // Search by name, address, or specialty
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { specialties: searchRegex }
      ];
    }

    let hospitals = await Hospital.find(query).limit(parseInt(limit) || 50);

    // Calculate distance if valid lat and lng are provided
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const hasValidCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

    const formattedHospitals = hospitals.map((h) => {
      const hospitalObj = h.toObject ? h.toObject() : h;
      let distanceKm = null;

      if (
        hasValidCoords &&
        hospitalObj.location?.coordinates &&
        hospitalObj.location.coordinates.length === 2
      ) {
        const [hLng, hLat] = hospitalObj.location.coordinates;
        distanceKm = calculateDistanceKm(parsedLat, parsedLng, hLat, hLng);
      }

      return {
        ...hospitalObj,
        distanceKm
      };
    });

    // If coordinates are valid, sort primarily by distance
    if (hasValidCoords) {
      formattedHospitals.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    res.json(formattedHospitals);
  } catch (error) {
    console.error('Fetch hospitals error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching hospitals' });
  }
});

// @route   GET /api/hospitals/:id
// @desc    Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const { lat, lng } = req.query;
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    const hospitalObj = hospital.toObject();
    if (
      !isNaN(parsedLat) &&
      !isNaN(parsedLng) &&
      hospitalObj.location?.coordinates?.length === 2
    ) {
      const [hLng, hLat] = hospitalObj.location.coordinates;
      hospitalObj.distanceKm = calculateDistanceKm(parsedLat, parsedLng, hLat, hLng);
    }

    res.json(hospitalObj);
  } catch (error) {
    console.error('Fetch hospital detail error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching hospital' });
  }
});

// @route   PUT /api/hospitals/:id/beds
// @desc    Update bed availability (hospital admin only)
router.put('/:id/beds', protect, async (req, res) => {
  try {
    if (!checkHospitalAdmin(req, req.params.id)) {
      return res.status(403).json({ message: 'Forbidden: You can only manage your own hospital.' });
    }

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const { general, acWard, private: privateWard } = req.body;

    if (general) {
      hospital.beds.general = {
        available: Math.max(0, parseInt(general.available) || 0),
        total: Math.max(0, parseInt(general.total) || 0)
      };
    }
    if (acWard) {
      hospital.beds.acWard = {
        available: Math.max(0, parseInt(acWard.available) || 0),
        total: Math.max(0, parseInt(acWard.total) || 0)
      };
    }
    if (privateWard) {
      hospital.beds.private = {
        available: Math.max(0, parseInt(privateWard.available) || 0),
        total: Math.max(0, parseInt(privateWard.total) || 0)
      };
    }

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error('Update beds error:', error);
    res.status(500).json({ message: error.message || 'Server error updating beds' });
  }
});

// @route   PUT /api/hospitals/:id/ot
// @desc    Update OT availability (hospital admin only)
router.put('/:id/ot', protect, async (req, res) => {
  try {
    if (!checkHospitalAdmin(req, req.params.id)) {
      return res.status(403).json({ message: 'Forbidden: You can only manage your own hospital.' });
    }

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const { available, total, occupied } = req.body;
    if (available !== undefined) hospital.operationTheatre.available = Math.max(0, parseInt(available) || 0);
    if (total !== undefined) hospital.operationTheatre.total = Math.max(0, parseInt(total) || 0);
    if (occupied !== undefined) hospital.operationTheatre.occupied = Math.max(0, parseInt(occupied) || 0);

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error('Update OT error:', error);
    res.status(500).json({ message: error.message || 'Server error updating OT' });
  }
});

// @route   PUT /api/hospitals/:id/emergency
// @desc    Update Emergency Ward availability (hospital admin only)
router.put('/:id/emergency', protect, async (req, res) => {
  try {
    if (!checkHospitalAdmin(req, req.params.id)) {
      return res.status(403).json({ message: 'Forbidden: You can only manage your own hospital.' });
    }

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const { available, total, occupied } = req.body;
    if (available !== undefined) hospital.emergencyWard.available = Math.max(0, parseInt(available) || 0);
    if (total !== undefined) hospital.emergencyWard.total = Math.max(0, parseInt(total) || 0);
    if (occupied !== undefined) hospital.emergencyWard.occupied = Math.max(0, parseInt(occupied) || 0);

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error('Update emergency ward error:', error);
    res.status(500).json({ message: error.message || 'Server error updating emergency ward' });
  }
});

// @route   PUT /api/hospitals/:id/emergency-status
// @desc    Toggle emergency open status (hospital admin only)
router.put('/:id/emergency-status', protect, async (req, res) => {
  try {
    if (!checkHospitalAdmin(req, req.params.id)) {
      return res.status(403).json({ message: 'Forbidden: You can only manage your own hospital.' });
    }

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    hospital.emergencyOpen = Boolean(req.body.emergencyOpen);
    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error('Toggle emergency status error:', error);
    res.status(500).json({ message: error.message || 'Server error updating emergency status' });
  }
});

// @route   PUT /api/hospitals/:id/info
// @desc    Update general hospital information (hospital admin only)
router.put('/:id/info', protect, async (req, res) => {
  try {
    if (!checkHospitalAdmin(req, req.params.id)) {
      return res.status(403).json({ message: 'Forbidden: You can only manage your own hospital.' });
    }

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const { name, address, phone, email, specialties } = req.body;
    if (name) hospital.name = name.trim();
    if (address) hospital.address = address.trim();
    if (phone) hospital.phone = phone.trim();
    if (email) hospital.email = email.trim();
    if (Array.isArray(specialties)) hospital.specialties = specialties;

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error('Update hospital info error:', error);
    res.status(500).json({ message: error.message || 'Server error updating hospital info' });
  }
});

module.exports = router;
