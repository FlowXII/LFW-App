import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from '@mui/system';
import { darkTheme, lightTheme } from './common/theme.jsx';
import HomePage from './HomePage';
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import NextBattle from "./TournamentsUpcoming.jsx";
import TOloader from "./TournamentsStations.jsx";
import PlayerLookUp from './TournamentsUser.jsx';
import Login from './Login';
import { AuthProvider } from './AuthContext.jsx';
import withAuth from './withAuth.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  console.log('Testing changes')
  return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <AuthProvider>
            <Router>
              <Sidebar isDark={darkMode} handleThemeChange={handleThemeChange}/>
              <Box sx={{flexGrow: 1}}> 
                <Routes>
                  <Route path="/" element={<HomePage/>} />
                  <Route path="/toloader" element={<TOloader/>} />
                  <Route path="/nextbattle" element={<NextBattle/>} />
                  <Route path='/playerlookup' element={<PlayerLookUp/>} />
                  <Route path="/dashboard" element={<Dashboard/>} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Box>
            </Router>
          </AuthProvider>
        </Box>
      </ThemeProvider>
  );
}

export default App;