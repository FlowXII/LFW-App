import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle'; // <-- Add theme toggle import here

const Sidebar = ({ isDark, handleThemeChange }) => { // <-- Add the isDark and handleThemeChange props here
    const navigate = useNavigate();

    const handleCreateNote = () => {
        navigate('/createnote');
    };

    const handleMyNotes = () => {
        navigate('/mynotes');
    };
    
    const handleTOloader = () => {
        navigate('/toloader');
    };

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
            <Typography variant="h2" gutterBottom>
                LFW
            </Typography>
            <Typography gutterBottom>
                Learn, Fight, Win.
            </Typography>
            <ThemeToggle isDark={isDark} handleThemeChange={handleThemeChange} /> {/* Add the theme toggle here */}
            <List>
                <ListItem button onClick={handleCreateNote}>
                    <ListItemText primary='Create Note' />
                </ListItem>
                <ListItem button onClick={handleMyNotes}>
                    <ListItemText primary='My Notes' />
                </ListItem>
                    <ListItem button onClick={handleTOloader}>
                        <ListItemText primary='TO Loader' />
                </ListItem>
                <ListItem button onClick={handleLogin}>
                        <ListItemText primary='Login' />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;