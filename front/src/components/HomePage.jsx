import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom'; //Will be used later to navigate to other pages

function HomePage() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom>
                Welcome to LFW !
            </Typography>
            <Typography variant="h5" gutterBottom>
                You can use various tools for the FGC here.
            </Typography>
        </Container>
    );
}

export default HomePage;