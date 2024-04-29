import React, { useState } from 'react';
import { Container, ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import ThemeToggle from './ThemeToggle';
// Required for side-effects
import "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

function App() {
  const [notes, setNotes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  console.log("Current theme: ", darkMode ? darkTheme : lightTheme);
  const addNote = (noteData) => {
    setNotes([...notes, noteData]);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Ensures background color and other basics are applied */}
      <Container>
        <ThemeToggle isDark={darkMode} handleThemeChange={handleThemeChange} />
        <NoteForm addNote={addNote} />
        <NoteList notes={notes} />
      </Container>
    </ThemeProvider>
  );
}

export default App;



