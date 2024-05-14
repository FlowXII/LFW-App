import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, ThemeProvider, CssBaseline, Button } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import LFWAuth from './LFWAuth';
import ThemeToggle from './ThemeToggle';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import LFWLogout from './LFWLogout';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcBjTVVSeTX0ayCDHch-y_S8pa8eUqf3E",
  authDomain: "smash-helper.firebaseapp.com",
  projectId: "smash-helper",
  storageBucket: "smash-helper.appspot.com",
  messagingSenderId: "35753814329",
  appId: "1:35753814329:web:5e49225fa36fe102c920e8",
  measurementId: "G-HDXM3PBWC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [notes, setNotes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Check user authentication state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const addNote = (noteData) => {
    setNotes([...notes, noteData]);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container>
        <Router>
          <ThemeToggle isDark={darkMode} handleThemeChange={handleThemeChange} />
          <Routes>
            <Route exact path="/" element={
              <div>
                <h1>Main Page</h1>
                <NoteForm addNote={addNote} />
                <NoteList notes={notes} />
                {/* Conditional rendering based on user authentication state */}
                {user ? (
                  // If user is logged in, display a personalized welcome message and a logout button
                  <div>
                    <p>Welcome, {user.displayName ? user.displayName : "Guest"}!</p>
                    <LFWLogout setUser={setUser} />
                  </div>
                ) : (
                  // If user is not logged in, display a generic welcome message and a link to the login page
                  <div>
                    <p>Welcome, Guest!</p>
                    <Link to="/login">Go to Login Page</Link>
                  </div>
                )}
              </div>
            } />
            {/* Route for the login page */}
            <Route path="/login" element={<LFWAuth setUser={setUser} />} />
            {/* Add other protected routes */}
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;