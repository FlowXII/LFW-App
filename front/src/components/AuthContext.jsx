import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      // Call your backend to verify if the user is authenticated
      const response = await fetch('/api/check-session', {
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