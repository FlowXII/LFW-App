import React from 'react';
import { Typography, Button, Box } from '@mui/material';

const Login = () => {
    const handleLogin = () => {
        window.location.href = '/oauth_redirect';
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>
                Welcome !
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login with start.gg
            </Button>
        </Box>
    );
}

export default Login;