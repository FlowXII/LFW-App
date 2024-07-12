import React from 'react';
import { Switch } from '@mui/material';

const ThemeToggle = ({ isDark, handleThemeChange }) => {
  return (
    <Switch checked={isDark} onChange={handleThemeChange} />
  );
};

export default ThemeToggle;