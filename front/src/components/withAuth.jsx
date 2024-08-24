import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext'; // Import your AuthContext
import { Navigate } from 'react-router-dom';

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, checkAuthStatus } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          // Optionally call a method to verify authentication status from the backend
          await checkAuthStatus(); // This could be an async call that verifies the authentication status
        } catch (error) {
          console.error('Error verifying authentication status:', error);
        } finally {
          setLoading(false); // Set loading to false once verification is done
        }
      };

      verifyAuth();
    }, [checkAuthStatus]);

    if (loading) {
      return <div>Loading...</div>; // Show a loading indicator while verifying
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;