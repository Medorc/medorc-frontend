import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [schcode,setSchcode]=useState(localStorage.getItem('schcode'));
  const [token, setToken] = useState(localStorage.getItem('token'));
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

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
        const decodedUser = jwtDecode(newToken);
        setUser(decodedUser);
    } catch(error) {
        console.error("Failed to decode token:", error);
        logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    schcode,
    setSchcode,
    token,
    user,
    login,
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