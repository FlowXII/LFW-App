import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle';

const Sidebar = ({ isDark, handleThemeChange }) => { 
    const navigate = useNavigate();

    const handleGoingHome = () => {
            navigate('/');
        }
    
    const handleDashboard = () => {
        navigate('/dashboard');
    };
    const handleTOloader = () => {
        navigate('/toloader');
    };

    const handleNextBattle = () => {
        navigate('/nextbattle');
    };

    const handlePlayerLookUp = () => {
        navigate('/playerlookup');
    }
    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <Drawer
            variant="permanent"
            open={true}
            sx={{ 
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                }
            }}
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
                        <ListItemText primary='TO Loader' />
                </ListItem>
                <ListItem sx={{ borderRadius: 8 }} button onClick={handleNextBattle}>
                        <ListItemText primary='Next Battle' />
                </ListItem>
                <ListItem sx={{ borderRadius: 8 }} button onClick={handlePlayerLookUp}>
                        <ListItemText primary='Player Look Up' />
                </ListItem>
            </List>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'end', p: 2 }}>
                <Typography gutterBottom> Change Lighting </Typography>
                <ThemeToggle isDark={isDark} handleThemeChange={handleThemeChange} />
            </Box>
        </Drawer>
     
    );
};

export default Sidebar;