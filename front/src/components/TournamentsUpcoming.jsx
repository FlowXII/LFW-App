import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button, Box, CircularProgress, Select, MenuItem } from '@mui/material';

function NextBattle() {
  const [cCode, setCode] = useState("FR");
  const [perPage, setPerPage] = useState("64");
  const [videogameId, setVideogameId] = useState("1386"); // Default to Super Smash Bros Ultimate ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Options for videogame IDs
  const videogameOptions = [
    { id: "1386", name: "Super Smash Bros Ultimate" },
    { id: "43868", name: "Street Fighter 6" },
    { id: "33945", name: "Guilty Gear -STRIVE-" },
    { id: "49783", name: "Tekken 8" },
    { id: "287", name: "Dragon Ball FighterZ" },
    { id: "1", name: "Super Smash Bros Melee" },
    { id: "48548", name: "Granblue Fantasy Versus: Rising" },
    { id: "48559", name: "Mortal Kombat 1" },
    { id: "36963", name: "The King of Fighters XV" },
    { id: "36865", name: "Melty Blood - Type Lumina -" },
    { id: "50203", name: "Under Night In-Birth II Sys:Celes" }, 
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = `${import.meta.env.VITE_API_BASE_URL}/upcoming?cCode=${cCode}&perPage=${perPage}&videogameId=${videogameId}`;
    console.log('Environment variables:', import.meta.env.VITE_API_BASE_URL);
    
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
      <Typography variant='h3' gutterBottom>Upcoming Tournaments</Typography>
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            label="Country Code"
            value={cCode}
            onChange={(e) => setCode(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Maximum Displayed"
            type="number"
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Select
            value={videogameId}
            onChange={(e) => setVideogameId(e.target.value)}
            variant="outlined"
            fullWidth
            label="Videogame"
          >
            {videogameOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </Box>
      </form>
      {loading && <CircularProgress />}
      {error && <Typography variant="body1" color="error">Error: {error}</Typography>}
      {data && (
        <Grid container spacing={3} justifyContent="center">
          {data.tournaments.nodes.map((tournament) => (
            <Grid item key={tournament.id} xs={12} sm={6} md={6} lg={6}>
              <Card style={{ width: '100%', height: '100%', padding: '10px', margin: '10px', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" sx={{ cursor: 'pointer' }} onClick={() => window.open(`http://start.gg/${tournament.slug}`, '_blank')}>
                    {tournament.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}><strong>Start Date:</strong> {new Date(tournament.startAt * 1000).toLocaleDateString()}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>End Date:</strong> {new Date(tournament.endAt * 1000).toLocaleDateString()}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Venue Address:</strong> {tournament.venueAddress}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>City:</strong> {tournament.city}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Country Code:</strong> {tournament.countryCode}</Typography>
                  {tournament.countryCode === 'US' && tournament.state && (
                    <Typography variant="body2" color="textSecondary"><strong>State:</strong> {tournament.state}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default NextBattle;






