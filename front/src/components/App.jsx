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
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClientProvider';

function App() {
  const [darkMode, setDarkMode] = useState(true);

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
                <Route path="/" element={<HomePage/>} />
                {/* <Route path="/login" element={<LFWAuth setUser={setUser} />} /> */}
                <Route path="/toloader" element={<TOloader/>} />
                <Route path="/nextbattle" element={<NextBattle/>} />
                <Route path='/playerlookup' element={<PlayerLookUp/>} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Box>
          </Router>
        </Box>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;