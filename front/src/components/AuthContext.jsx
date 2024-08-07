import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch session data from the server
    axios.get('/api/session')
      .then(response => {
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(error => {
        console.error('Error fetching session data:', error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};