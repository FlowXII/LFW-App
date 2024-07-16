import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle'; // <-- Add theme toggle import here

const Sidebar = ({ isDark, handleThemeChange }) => { // <-- Add the isDark and handleThemeChange props here
    const navigate = useNavigate();

    /*  This used to be an old, note taking app with components that served that purpose, but i'm
    keeping this here for future reference. I might reuse the login component for a different purpose...

    const handleCreateNote = () => {
        navigate('/createnote');
    };

    const handleMyNotes = () => {
        navigate('/mynotes');
    };
    
    const handleLogin = () => {
        navigate('/login');
    } */

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
        <ThemeToggle isDark={isDark} handleThemeChange={handleThemeChange} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            <Typography variant="h2" gutterBottom>
                LFW
            </Typography>
            <Typography gutterBottom>
                Learn, Fight, Win.
            </Typography>
            
            {/* Same here. This used to be the navigation for the note taking app, but i'm keeping it here for future reference.
            <List id='notes'>
                <ListItem sx={{ borderRadius: 8 }} button onClick={handleCreateNote}>
                    <ListItemText primary='Create Note' />
                </ListItem>
                <ListItem sx={{ borderRadius: 8 }} button onClick={handleMyNotes}>
                    <ListItemText primary='My Notes' />
                </ListItem>
                <ListItem sx={{ borderRadius: 8 }} button onClick={handleLogin}>
                    <ListItemText primary='Login' />
                </ListItem>
                <ListItem sx={{ borderRadius: 8 }} button onClick={handleLogin}>
                        <ListItemText primary='Login' />
                </ListItem>
            </List> 
            */}

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
        </Drawer>
    );
};

export default Sidebar;