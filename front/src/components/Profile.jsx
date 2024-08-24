import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = ({ isDark, handleThemeChange }) => { 
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleGoingHome = () => navigate('/');
    const handleDashboard = () => navigate('/dashboard');
    const handleTOloader = () => navigate('/toloader');
    const handleNextBattle = () => navigate('/nextbattle');
    const handlePlayerLookUp = () => navigate('/playerlookup');
    const handleProfile = () => navigate('/profile');

    return (
        <>
            <IconButton 
                sx={{ 
                    display: isMobile ? 'block' : 'none', 
                    position: 'absolute', 
                    top: 16, 
                    left: 16, 
                    zIndex: 1200,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    boxShadow: 3,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        boxShadow: 6,
                    }
                }} 
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
                    },
                }}
                anchor="left"
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                    <Typography variant="h2" gutterBottom>
                        LFW
                    </Typography>
                    <Typography gutterBottom>
                        Learn, Fight, Win.
                    </Typography>
                </Box>
                <List>
                    <ListItem sx={{ borderRadius: 8 }} button onClick={handleGoingHome}>
                        <ListItemText primary='Home' />
                    </ListItem>
                    <ListItem sx={{ borderRadius: 8 }} button onClick={handleDashboard}>
                        <ListItemText primary='Dashboard' />
                    </ListItem>
                    <ListItem sx={{ borderRadius: 8 }} button onClick={handleTOloader}>
                        <ListItemText primary='Station Viewer' />
                    </ListItem>
                    <ListItem sx={{ borderRadius: 8 }} button onClick={handleNextBattle}>
                        <ListItemText primary='Tournaments by game/country' />
                    </ListItem>
                    <ListItem sx={{ borderRadius: 8 }} button onClick={handlePlayerLookUp}>
                        <ListItemText primary='Tournaments by Player' />
                    </ListItem>
                    <ListItem sx={{ borderRadius: 8 }} button onClick={handleProfile}>
                        <ListItemText primary='Your Profile' />
                    </ListItem>
                </List>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'end', p: 2 }}>
                    <Typography gutterBottom> Change Lighting </Typography>
                    <ThemeToggle isDark={isDark} handleThemeChange={handleThemeChange} />
                </Box>
            </Drawer>
        </>
    );
};

export default Sidebar;
