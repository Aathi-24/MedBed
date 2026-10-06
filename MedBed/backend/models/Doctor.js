const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  shiftStart: {
    type: String,
    default: '08:00 AM'
  },
  shiftEnd: {
    type: String,
    default: '04:00 PM'
  },
  phone: String,
  qualification: String,
  experience: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
