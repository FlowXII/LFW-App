import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Example primary color (blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (pink)
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f0f0f',
      secondary: '#555555',
    },
  },
  // You can also customize other theme properties
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Example primary color
    },
    secondary: {
      main: '#f48fb1', // Example secondary color
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  // You can also customize other theme properties
});

