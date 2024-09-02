import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = ({ isDark, handleThemeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isFullWidth, setIsFullWidth] = useState(!isMobile);

  const handleToggle = () => {
    setIsFullWidth(!isFullWidth);
  };

  const handleNavigation = (path) => () => navigate(path);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Station Viewer', icon: <ViewModuleIcon />, path: '/toloader' },
    { text: 'Tournaments by game/country', icon: <SportsEsportsIcon />, path: '/nextbattle' },
    { text: 'Tournaments by Player', icon: <PersonSearchIcon />, path: '/playerlookup' },
  ];

  const drawerWidth = isFullWidth ? 250 : 72;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 1,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <IconButton onClick={handleToggle} sx={{ color: theme.palette.primary.contrastText, mb: 1 }}>
          {isFullWidth ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        {isFullWidth && (
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            LFW
          </Typography>
        )}
      </Box>
      <List sx={{ flexGrow: 1, py: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={isFullWidth ? '' : item.text} placement="right">
              <ListItemButton
                onClick={handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: isFullWidth ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: isActive(item.path) ? theme.palette.secondary.main : 'transparent',
                  '&:hover': {
                    bgcolor: isActive(item.path)
                      ? theme.palette.secondary.dark
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isFullWidth ? 2 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? theme.palette.secondary.contrastText : 'inherit',
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 32 } })}
                </ListItemIcon>
                {isFullWidth && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: isFullWidth ? 1 : 0,
                      color: isActive(item.path) ? theme.palette.secondary.contrastText : 'inherit',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isFullWidth ? 'space-between' : 'center',
          p: 2,
          bgcolor: theme.palette.primary,
        }}
      >
        {isFullWidth && <Typography variant="body2">Change Lighting</Typography>}
        <Tooltip title={isFullWidth ? '' : 'Change Lighting'} placement="right">
          <IconButton onClick={handleThemeChange} sx={{ p: 1 }}>
            {isDark ? <LightModeIcon sx={{ fontSize: 32 }} /> : <DarkModeIcon sx={{ fontSize: 32 }} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;