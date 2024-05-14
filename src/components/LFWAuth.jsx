import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from '@mui/material';
import LFWLogout from './LFWLogout';

const LFWAuth = ({ user, setUser }) => { // Add setUser as a prop
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
      <Button variant="contained" onClick={handleSignInWithGoogle}>Sign In With Google</Button>
      {/* Conditional rendering based on user authentication state */}
      {user && (
        <p>Welcome, {user.displayName}!</p>
      )}
      <LFWLogout setUser={setUser} />
     <Link to="/">
        <Button variant='contained'>Go to Home</Button>
    </Link>
    </div>
  );
};

export default LFWAuth;




