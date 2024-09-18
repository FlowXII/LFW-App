import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import { AuthProvider } from './AuthContext.jsx';
import { darkTheme, lightTheme } from './common/theme.jsx';
import withAuth from './withAuth.jsx';
import ServiceWorkerRegistration from './common/ServiceWorkerRegistration.jsx';

// Components
import Sidebar from "./Sidebar";
import HomePage from './HomePage';
import Dashboard from "./Dashboard";
import NextBattle from "./TournamentsUpcoming.jsx";
import TOloader from "./TournamentsStations.jsx";
import PlayerLookUp from './TournamentsUser.jsx';
import Login from './Login';
import Profile from './Profile';

// Create an authenticated version of the Dashboard component
const AuthenticatedDashboard = withAuth(Dashboard);

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <ServiceWorkerRegistration />
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Sidebar isDark={darkMode} handleThemeChange={handleThemeChange} />
            <Box
              component="main"
              sx={{
                flexGrow: 0,
                pl: -3,
                width: { xs: 'calc(100% - 72px)', sm: '100%' },
                marginLeft: { xs: '0px', sm: '0px' },
                overflowX: 'hidden',
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/toloader" element={<TOloader />} />
                <Route path="/nextbattle" element={<NextBattle />} />
                <Route path='/playerlookup' element={<PlayerLookUp />} />
                <Route path="/dashboard" element={<AuthenticatedDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;