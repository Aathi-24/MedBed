import { useState, useCallback } from 'react';
import { getHospitals, getHospitalById } from '../services/hospitalService';

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHospitals = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getHospitals(params);
      setHospitals(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch hospitals';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNearby = useCallback(async (lat, lng, extraParams = {}) => {
    return fetchHospitals({ lat, lng, ...extraParams });
  }, [fetchHospitals]);

  const fetchById = useCallback(async (id, coords = null) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getHospitalById(id, coords);
      setSelectedHospital(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch hospital details';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hospitals,
    selectedHospital,
    loading,
    error,
    fetchHospitals,
    fetchNearby,
    fetchById,
    setSelectedHospital,
    setHospitals
  };
};

export default useHospitals;
