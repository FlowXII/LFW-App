import React from 'react';
import { Button } from '@mui/material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import LFWLogout from './LFWLogout';

const LFWAuth = ({ user, setUser }) => {
  const auth = getAuth(); // Initialize auth here

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // After successful sign-in, you can navigate the user to another page or perform other actions
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      {user ? (
        <p>Welcome, {user.displayName}!</p>
      ) : (
        <Button variant="contained" onClick={handleSignInWithGoogle}>Sign In With Google</Button>
      )}

      <LFWLogout setUser={setUser} />
    </div>
  );
};

export default LFWAuth;




