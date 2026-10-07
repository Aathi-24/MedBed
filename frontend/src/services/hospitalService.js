import api from './api';
import localDB from './db';

// Hospitals
export const getHospitals = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.lat !== undefined && params.lat !== null) query.append('lat', params.lat);
    if (params.lng !== undefined && params.lng !== null) query.append('lng', params.lng);
    if (params.search) query.append('search', params.search);
    if (params.specialty) query.append('specialty', params.specialty);
    if (params.emergencyOnly) query.append('emergencyOnly', 'true');
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const res = await api.get(`/hospitals${queryString ? `?${queryString}` : ''}`);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    // Graceful fallback to persistent Firebase/local database
  }
  return { data: localDB.getHospitals(params) };
};

export const getNearbyHospitals = (lat, lng, limit = 50) =>
  getHospitals({ lat, lng, limit });

export const getHospitalById = async (id, coords = null) => {
  try {
    const query = new URLSearchParams();
    if (coords?.lat && coords?.lng) {
      query.append('lat', coords.lat);
      query.append('lng', coords.lng);
    }
    const queryString = query.toString();
    const res = await api.get(`/hospitals/${id}${queryString ? `?${queryString}` : ''}`);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.getHospitalById(id, coords) };
};

export const updateBeds = async (id, bedData) => {
  try {
    const res = await api.put(`/hospitals/${id}/beds`, bedData);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.updateHospitalBeds(id, bedData) };
};

export const updateOT = async (id, otData) => {
  try {
    const res = await api.put(`/hospitals/${id}/ot`, otData);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.updateHospitalOT(id, otData) };
};

export const updateEmergency = async (id, ewData) => {
  try {
    const res = await api.put(`/hospitals/${id}/emergency`, ewData);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.updateHospitalEmergency(id, ewData) };
};

export const toggleEmergencyStatus = async (id, status) => {
  try {
    const res = await api.put(`/hospitals/${id}/emergency-status`, { emergencyOpen: status });
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.toggleEmergencyStatus(id, status) };
};

export const updateHospitalInfo = async (id, infoData) => {
  try {
    const res = await api.put(`/hospitals/${id}/info`, infoData);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.updateHospitalInfo(id, infoData) };
};

// Doctors
export const getDoctors = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.hospitalId) query.append('hospitalId', params.hospitalId);
    if (params.specialty) query.append('specialty', params.specialty);
    if (params.availableOnly) query.append('availableOnly', 'true');

    const queryString = query.toString();
    const res = await api.get(`/doctors${queryString ? `?${queryString}` : ''}`);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    // Fallback
  }
  return { data: localDB.getDoctors(params) };
};

export const getDoctorsByHospital = (hospitalId) =>
  getDoctors({ hospitalId });

export const updateDoctorAvailability = async (id, data) => {
  try {
    const res = await api.put(`/doctors/${id}/availability`, data);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.updateDoctor(id, data) };
};

export const addDoctor = async (doctorData) => {
  try {
    const res = await api.post('/doctors', doctorData);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.addDoctor(doctorData) };
};

export const updateDoctor = async (id, doctorData) => {
  try {
    const res = await api.put(`/doctors/${id}`, doctorData);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.updateDoctor(id, doctorData) };
};

export const deleteDoctor = async (id) => {
  try {
    const res = await api.delete(`/doctors/${id}`);
    if (res.data) return res;
  } catch (err) {
    // Fallback
  }
  return { data: localDB.deleteDoctor(id) };
};
