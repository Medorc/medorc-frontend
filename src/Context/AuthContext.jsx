import { useState, useContext, createContext, useEffect } from "react";

/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [shc_code, setShc_code] = useState(localStorage.getItem('shc_code') || null);
  
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        return jwtDecode(savedToken);
      } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        return decoded.role || localStorage.getItem('role') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [profileData, setProfileData] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('profileData');
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch {
      return null;
    }
  });

  const API_URL = API_BASE_URL;

  const fetchProfile = async (currentToken = token, currentRole = role) => {
    if (!currentToken || !currentRole) return;
    try {
      let endpoint = "";
      if (currentRole === "patient") endpoint = `${API_URL}/patient/profile`;
      else if (currentRole === "doctor") endpoint = `${API_URL}/doctor/profile`;
      else if (currentRole === "hospital") endpoint = `${API_URL}/hospital/profile`;
      else if (currentRole === "extern") endpoint = `${API_URL}/extern/profile`;

      if (!endpoint) return;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (res.data) {
        setProfileData(res.data);
        localStorage.setItem('profileData', JSON.stringify(res.data));
        if (res.data.shc_code) {
          setShc_code(res.data.shc_code);
          localStorage.setItem('shc_code', res.data.shc_code);
        }
      }
    } catch (err) {
      console.warn("AuthContext fetchProfile error:", err.message);
    }
  };

  useEffect(() => {
    if (token && role) {
      fetchProfile(token, role);
    }
  }, [token, role]);

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setRole(newRole);
    setToken(newToken);
    try {
      const decodedUser = jwtDecode(newToken);
      setUser(decodedUser);
    } catch(error) {
      console.error("Failed to decode token:", error);
      logout();
      return;
    }
    fetchProfile(newToken, newRole);
  };

  const shcstore = (newShc_code) => {
    localStorage.setItem('shc_code', newShc_code);
    setShc_code(newShc_code);
  };

  const register = async (userData, userRole) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        ...userData,
        role: userRole
      });
      
      if (response.data.token) {
        login(response.data.token, userRole);
      }
      
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error; 
    }
  };

  const updateUserProfile = (newProfile) => {
    setProfileData((prev) => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('profileData', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('shc_code');
    localStorage.removeItem('profileData');
    setToken(null);
    setRole(null);
    setUser(null);
    setProfileData(null);
  };

  const authContextValue = {
    shc_code,
    setShc_code,
    token,
    role,
    user,
    profileData,
    updateUserProfile,
    login,
    shcstore,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};