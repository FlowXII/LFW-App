import { createTheme } from '@mui/material/styles';

const montserrat = {
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Montserrat Regular'),
    local('Montserrat-Regular'),
    url(https://fonts.gstatic.com/s/montserrat/v15/zhcz-_WihjSQC0oHJ9TCYBsxEYwM7FgeyaSgU71cLG0.woff) format('woff')
  `,
  unicodeRange:
    'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB',
};

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
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [montserrat],
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9e66d4', // Example primary color
    },
    secondary: {
      main: '#e8c564', // Example secondary color
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
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [montserrat],
        },
      },
    },
  },
});

