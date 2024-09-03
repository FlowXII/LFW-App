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
          await checkAuthStatus();
        } catch (error) {
          console.error('Error verifying authentication status:', error);
        } finally {
          setLoading(false);
        }
      };

      verifyAuth();
    }, [checkAuthStatus]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;