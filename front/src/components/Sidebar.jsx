import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Sidebar = ({ isDark, handleThemeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
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

  return (
    <>
      <IconButton
        sx={{ display: isMobile ? 'block' : 'none', position: 'absolute', top: 16, left: 16, zIndex: 1200 }}
        onClick={handleToggle}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => isMobile && setOpen(false)}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        anchor="left"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography variant="h4" gutterBottom>
            LFW
          </Typography>
          <Typography>Learn, Fight, Win.</Typography>
        </Box>
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={handleNavigation(item.path)}
                sx={{
                  bgcolor: isActive(item.path) ? theme.palette.secondary.main : 'transparent',
                  '&:hover': {
                    bgcolor: isActive(item.path)
                      ? theme.palette.secondary.dark
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.secondary.contrastText : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: isActive(item.path) ? theme.palette.secondary.contrastText : 'inherit' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleNavigation('/profile')}
            sx={{
              bgcolor: isActive('/profile') ? theme.palette.secondary.main : 'transparent',
              '&:hover': {
                bgcolor: isActive('/profile')
                  ? theme.palette.secondary.dark
                  : theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive('/profile') ? theme.palette.secondary.contrastText : 'inherit' }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Your Profile"
              sx={{ color: isActive('/profile') ? theme.palette.secondary.contrastText : 'inherit' }}
            />
          </ListItemButton>
        </ListItem>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: theme.palette.primary,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="body2">Change Lighting</Typography>
          <ThemeToggle isDark={isDark} handleThemeChange={handleThemeChange} />
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;