import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import { Button } from '@mui/material';

const LFWLogout = ({ setUser }) => {
  const auth = getAuth(); // Initialize auth here

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // After successful sign-out, update user state to indicate that the user is no longer authenticated
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleSignOut}>Sign Out</Button>
    </div>

  );
};

export default LFWLogout;
