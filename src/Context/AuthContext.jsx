import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Ensure axios is imported

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [shc_code, setShc_code] = useState(localStorage.getItem('shc_code'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      try {
        return jwtDecode(savedToken);
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  // Base URL for API - adjust port if needed (defaulting to 3000 based on backend)
  const API_URL = 'http://localhost:3000/api/v1';

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
    }
  };

  const shcstore = (newShc_code) => {
    localStorage.setItem('shc_code', newShc_code);
    setShc_code(newShc_code);
  }

  const register = async (userData, userRole) => {
    try {
      // Calls POST http://localhost:3000/api/v1/auth/signup
      const response = await axios.post(`${API_URL}/auth/signup`, {
        ...userData,
        role: userRole
      });
      
      // If the backend returns a token immediately upon signup, login the user
      if (response.data.token) {
        login(response.data.token, userRole);
      }
      
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const authContextValue = {
    shc_code,
    setShc_code,
    token,
    role,
    user,
    login,
    shcstore,
    register, // Expose register to the app
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