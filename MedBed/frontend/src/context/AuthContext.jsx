import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import localDB from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medbed_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medbed_token');
    const savedUser = localStorage.getItem('medbed_user');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        localStorage.removeItem('medbed_user');
        localStorage.removeItem('medbed_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('medbed_token', data.token);
      localStorage.setItem('medbed_user', JSON.stringify(data));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      return data;
    } catch (err) {
      // Fallback to localDB for Firebase Hosting / offline support
      const fallbackData = localDB.loginDemoUser(email, password);
      localStorage.setItem('medbed_token', fallbackData.token);
      localStorage.setItem('medbed_user', JSON.stringify(fallbackData));
      setUser(fallbackData);
      return fallbackData;
    }
  };

  const register = async (name, email, password, role = 'user', hospitalId = null) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        hospitalId
      });
      localStorage.setItem('medbed_token', data.token);
      localStorage.setItem('medbed_user', JSON.stringify(data));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      return data;
    } catch (err) {
      // Fallback to localDB for Firebase Hosting / offline support
      const fallbackData = localDB.registerUser({ name, email, role, hospitalId });
      localStorage.setItem('medbed_token', fallbackData.token);
      localStorage.setItem('medbed_user', JSON.stringify(fallbackData));
      setUser(fallbackData);
      return fallbackData;
    }
  };

  const logout = () => {
    localStorage.removeItem('medbed_token');
    localStorage.removeItem('medbed_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    localStorage.setItem('medbed_user', JSON.stringify(updated));
    setUser(updated);
  };

  const isHospital = () => user?.role === 'hospital';
  const isAmbulance = () => user?.role === 'ambulance';
  const isUser = () => user?.role === 'user';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUser,
        isHospital,
        isAmbulance,
        isUser,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
