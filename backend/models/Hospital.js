const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  phone: String,
  email: String,
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  emergencyOpen: {
    type: Boolean,
    default: true
  },
  beds: {
    general: {
      available: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    acWard: {
      available: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    private: {
      available: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  operationTheatre: {
    available: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    occupied: { type: Number, default: 0 }
  },
  emergencyWard: {
    available: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    occupied: { type: Number, default: 0 }
  },
  image: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  specialties: [String]
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
