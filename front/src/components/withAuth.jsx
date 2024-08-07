import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;