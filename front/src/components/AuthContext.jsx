import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const url = `${import.meta.env.VITE_API_BASE_URL}/check_session`;
  
  const checkAuthStatus = async () => {
    try {
      console.log(url);
      const response = await fetch(url, {
        credentials: 'include' 
      });
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      console.log(data);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};