import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom'; //Will be used later to navigate to other pages

function HomePage() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Welcome to LFW !
            </Typography>
            <Typography variant="h6" gutterBottom>
                This site is made by Flow, and is still in active development. Feel free to look around.
            </Typography>
        </Container>
    );
}

export default HomePage;