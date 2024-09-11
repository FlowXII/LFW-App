import React from 'react';
import { Typography, Button, Box } from '@mui/material';

const Login = () => {
    const url =`${import.meta.env.VITE_OAUTH_URL}`;
    const handleLogin = () => {
        window.location.href = url;
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