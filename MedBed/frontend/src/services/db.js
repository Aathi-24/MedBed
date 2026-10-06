import defaultData from '../data/coimbatoreDatabase.json';

// Initialize local database in browser storage for Firebase Hosting fallback
const STORAGE_KEY = 'medbed_coimbatore_db';

const getInitialDB = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored database, resetting to default', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
};

// Calculate Haversine distance
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
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

export const localDB = {
  getHospitals: (params = {}) => {
    const db = getInitialDB();
    let hospitals = [...(db.hospitals || [])];

    // Filter by emergency
    if (params.emergencyOnly === true || params.emergencyOnly === 'true') {
      hospitals = hospitals.filter((h) => h.emergencyOpen);
    }

    // Filter by specialty
    if (params.specialty && params.specialty !== 'All') {
      hospitals = hospitals.filter((h) =>
        h.specialties?.some((s) => s.toLowerCase().includes(params.specialty.toLowerCase()) || s.toLowerCase().includes('all'))
      );
    }

    // Filter by search
    if (params.search && params.search.trim()) {
      const term = params.search.toLowerCase().trim();
      hospitals = hospitals.filter((h) => {
        const nameMatch = h.name?.toLowerCase().includes(term);
        const addrMatch = h.address?.toLowerCase().includes(term);
        const specMatch = h.specialties?.some((s) => s.toLowerCase().includes(term));
        return nameMatch || addrMatch || specMatch;
      });
    }

    // Compute distance
    const lat = parseFloat(params.lat);
    const lng = parseFloat(params.lng);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng);

    hospitals = hospitals.map((h) => {
      let distanceKm = null;
      if (hasValidCoords && h.location?.coordinates?.length === 2) {
        const [hLng, hLat] = h.location.coordinates;
        distanceKm = calculateDistanceKm(lat, lng, hLat, hLng);
      }
      return { ...h, distanceKm };
    });

    if (hasValidCoords) {
      hospitals.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return hospitals;
  },

  getHospitalById: (id, coords = null) => {
    const db = getInitialDB();
    const hospital = (db.hospitals || []).find((h) => h._id === id || h.name.toLowerCase().includes(id.toLowerCase()));
    if (!hospital) return null;

    let distanceKm = null;
    if (coords?.lat && coords?.lng && hospital.location?.coordinates?.length === 2) {
      const [hLng, hLat] = hospital.location.coordinates;
      distanceKm = calculateDistanceKm(coords.lat, coords.lng, hLat, hLng);
    }
    return { ...hospital, distanceKm };
  },

  updateHospitalBeds: (id, beds) => {
    const db = getInitialDB();
    const idx = db.hospitals.findIndex((h) => h._id === id);
    if (idx !== -1) {
      db.hospitals[idx].beds = { ...db.hospitals[idx].beds, ...beds };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.hospitals[idx];
    }
    return null;
  },

  updateHospitalOT: (id, ot) => {
    const db = getInitialDB();
    const idx = db.hospitals.findIndex((h) => h._id === id);
    if (idx !== -1) {
      db.hospitals[idx].operationTheatre = { ...db.hospitals[idx].operationTheatre, ...ot };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.hospitals[idx];
    }
    return null;
  },

  updateHospitalEmergency: (id, ew) => {
    const db = getInitialDB();
    const idx = db.hospitals.findIndex((h) => h._id === id);
    if (idx !== -1) {
      db.hospitals[idx].emergencyWard = { ...db.hospitals[idx].emergencyWard, ...ew };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.hospitals[idx];
    }
    return null;
  },

  toggleEmergencyStatus: (id, status) => {
    const db = getInitialDB();
    const idx = db.hospitals.findIndex((h) => h._id === id);
    if (idx !== -1) {
      db.hospitals[idx].emergencyOpen = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.hospitals[idx];
    }
    return null;
  },

  updateHospitalInfo: (id, info) => {
    const db = getInitialDB();
    const idx = db.hospitals.findIndex((h) => h._id === id);
    if (idx !== -1) {
      db.hospitals[idx] = { ...db.hospitals[idx], ...info };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.hospitals[idx];
    }
    return null;
  },

  getDoctors: (params = {}) => {
    const db = getInitialDB();
    let doctors = [...(db.doctors || [])];

    if (params.hospitalId) {
      doctors = doctors.filter((d) => d.hospitalId === params.hospitalId || d.hospitalId?._id === params.hospitalId);
    }

    if (params.specialty && params.specialty !== 'All') {
      doctors = doctors.filter((d) =>
        d.specialty?.toLowerCase().includes(params.specialty.toLowerCase())
      );
    }

    if (params.availableOnly) {
      doctors = doctors.filter((d) => d.available);
    }

    doctors.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
    return doctors;
  },

  addDoctor: (doctorData) => {
    const db = getInitialDB();
    const newDoc = {
      _id: 'doc_' + Date.now(),
      available: true,
      experience: 0,
      ...doctorData
    };
    db.doctors = [newDoc, ...(db.doctors || [])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return newDoc;
  },

  updateDoctor: (id, doctorData) => {
    const db = getInitialDB();
    const idx = (db.doctors || []).findIndex((d) => d._id === id);
    if (idx !== -1) {
      db.doctors[idx] = { ...db.doctors[idx], ...doctorData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.doctors[idx];
    }
    return null;
  },

  deleteDoctor: (id) => {
    const db = getInitialDB();
    db.doctors = (db.doctors || []).filter((d) => d._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  },

  loginDemoUser: (email, password) => {
    const db = getInitialDB();
    const user = (db.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Fallback create mock session
      return {
        _id: 'usr_' + Date.now(),
        name: email.split('@')[0],
        email,
        role: email.includes('driver') ? 'ambulance' : email.includes('admin') || email.includes('ganga') || email.includes('kmch') || email.includes('psg') ? 'hospital' : 'user',
        token: 'demo_token_' + Date.now(),
        hospitalId: db.hospitals?.[0] || null
      };
    }

    const hospital = user.hospitalId
      ? db.hospitals.find((h) => h._id === user.hospitalId) || db.hospitals[0]
      : null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hospitalId: hospital,
      token: 'jwt_demo_token_' + user._id
    };
  },

  registerUser: ({ name, email, role = 'user', hospitalId = null }) => {
    const db = getInitialDB();
    const hospital = hospitalId ? db.hospitals.find((h) => h._id === hospitalId) || null : null;
    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email,
      role,
      hospitalId: hospital?._id || hospitalId,
      token: 'jwt_demo_token_' + Date.now()
    };
    db.users = [newUser, ...(db.users || [])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return {
      ...newUser,
      hospitalId: hospital || null
    };
  }
};

export default localDB;
