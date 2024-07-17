import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button, Box, CircularProgress } from '@mui/material';

function PlayerLookUp() {
    const [userSlug, setUserSlug] = useState("FR");
    const [perPage, setPerPage] = useState(32);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Construct the URL with query parameters
        const url = `http://localhost:4000/api/tournaments/?userSlug=${userSlug}&perPage=${perPage}`;

        // Log the URL to the console
        console.log("Fetching URL:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h3' gutterBottom> Tournaments by User </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={6} lg={4}>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    label="User ID (after /user/ in the url)"
                                    value={userSlug}
                                    onChange={(e) => setUserSlug(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Maximum Displayed"
                                    type="number"
                                    value={perPage}
                                    onChange={(e) => setPerPage(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            {loading && <CircularProgress />}
            {error && <Typography variant="body1" color="error">Error: {error}</Typography>}
            {data && data.user && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4">{data.user.name}</Typography>
                    <Typography variant="h4">{data.user.player.gamerTag}</Typography>
                </Box>
            )}
            {data && data.user && (
                <Grid container spacing={2} justifyContent="center">
                    {data.user.tournaments.nodes.map((tournament) => (
                        <Grid item xs={12} sm={6} md={4} key={tournament.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h5">{tournament.name}</Typography>
                                    <Typography variant="body1">Country: {tournament.countryCode}</Typography>
                                    <Typography variant="body2">City: {tournament.city}</Typography>
                                    <Typography variant="body2">Start Date: {new Date(tournament.startAt * 1000).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">End Date: {new Date(tournament.endAt * 1000).toLocaleDateString()}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default PlayerLookUp;




