const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/beds/:hospitalId
// @desc    Get bed data for a hospital
router.get('/:hospitalId', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).select('beds operationTheatre emergencyWard name');
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
