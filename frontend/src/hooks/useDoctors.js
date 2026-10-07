import { useState, useCallback } from 'react';
import {
  getDoctors,
  updateDoctorAvailability,
  addDoctor as apiAddDoctor,
  updateDoctor as apiUpdateDoctor,
  deleteDoctor as apiDeleteDoctor
} from '../services/hospitalService';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getDoctors(params);
      setDoctors(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch doctors';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByHospital = useCallback(async (hospitalId, specialty = null) => {
    return fetchDoctors({ hospitalId, ...(specialty ? { specialty } : {}) });
  }, [fetchDoctors]);

  const toggleAvailability = useCallback(async (doctorId, available, shiftStart, shiftEnd) => {
    const { data } = await updateDoctorAvailability(doctorId, { available, shiftStart, shiftEnd });
    setDoctors((prev) =>
      prev.map((d) => (d._id === doctorId ? { ...d, ...data } : d))
    );
    return data;
  }, []);

  const addNewDoctor = useCallback(async (doctorData) => {
    const { data } = await apiAddDoctor(doctorData);
    setDoctors((prev) => [data, ...prev]);
    return data;
  }, []);

  const editDoctor = useCallback(async (id, doctorData) => {
    const { data } = await apiUpdateDoctor(id, doctorData);
    setDoctors((prev) =>
      prev.map((d) => (d._id === id ? { ...d, ...data } : d))
    );
    return data;
  }, []);

  const removeDoctor = useCallback(async (id) => {
    await apiDeleteDoctor(id);
    setDoctors((prev) => prev.filter((d) => d._id !== id));
  }, []);

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    fetchByHospital,
    toggleAvailability,
    addNewDoctor,
    editDoctor,
    removeDoctor,
    setDoctors
  };
};

export default useDoctors;
