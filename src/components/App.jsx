import React, { useState } from 'react';
import { Container, ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import ThemeToggle from './ThemeToggle';

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



