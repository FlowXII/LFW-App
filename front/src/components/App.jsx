import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Container, ThemeProvider, CssBaseline} from '@mui/material';
import { Box } from '@mui/system';
import { darkTheme, lightTheme } from './theme';
import HomePage from './HomePage';
import LFWAuth from './LFWAuth';
import Sidebar from "./Sidebar"
import NextBattle from "./NextBattle"
import TOloader from "./TOloader.jsx"
import { ApolloProvider } from '@apollo/client'; // Import ApolloProvider
import PlayerLookUp from './PlayerLookUp';
import client from './ApolloClientProvider'; // Import the Apollo Client instance
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
    <ApolloProvider client={client}> {/* Wrap the root component with ApolloProvider */}
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Router>
            <Sidebar isDark={darkMode} handleThemeChange={handleThemeChange}/>
            <Box sx={{flexGrow: 1}}> {/* Add the Box component here */}
              <Routes>
                <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
                <Route path="/login" element={<LFWAuth setUser={setUser} />} />
                <Route path="/toloader" element={<TOloader/>} />
                <Route path="/nextbattle" element={<NextBattle/>} />
                <Route path='/playerlookup' element={<PlayerLookUp/>} />
              </Routes>
            </Box>
          </Router>
        </Box>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;