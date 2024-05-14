import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Container, ThemeProvider, CssBaseline} from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import NoteForm from './NoteForm';
import HomePage from './HomePage';
import LFWAuth from './LFWAuth';
import MyNotes from "./MyNotes";
import ThemeToggle from './ThemeToggle';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

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
            <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
            <Route path="/createnote" element={<NoteForm user={user} addNote={addNote} />} />
            <Route path="/login" element={<LFWAuth setUser={setUser} />} />
            <Route path="/mynotes" element={<MyNotes/>} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;