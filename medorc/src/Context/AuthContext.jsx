import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [schcode,setSchcode]=useState(localStorage.getItem('schcode'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

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

  const login = (newToken,newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setRole(newRole);
    setToken(newToken);
    try {
        const decodedUser = jwtDecode(newToken);
        setRole(newRole);
        setUser(decodedUser);

    } catch(error) {
        console.error("Failed to decode token:", error);
        logout();
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
    schcode,
    setSchcode,
    token,
    role,
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