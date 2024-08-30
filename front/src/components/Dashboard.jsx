import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Container, Box, CircularProgress, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { EventNote, LocationOn, Person } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`);
        setDashboardData(response.data.data?.currentUser || null);
        setLoading(false);
        console.log(response);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!dashboardData) return <Typography>No dashboard data available</Typography>;

  const TournamentEventCard = ({ tournament, event }) => (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>{tournament.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>{event.name}</Typography>
        <Box display="flex" alignItems="center" flexDirection={'column'} mb={1}>
          <EventNote sx={{ mr: 1 }} />
          <Typography variant="body2">
            {new Date(tournament.startAt * 1000).toLocaleDateString()} - {new Date(tournament.endAt * 1000).toLocaleDateString()}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography variant="body2">{tournament.city}, {tournament.countryCode}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Person sx={{ mr: 1 }} />
          <Typography variant="body2">Entrants: {event.numEntrants}</Typography>
        </Box>
        {event.sets.nodes.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>You have to play !</Typography>
            <List dense>
              {event.sets.nodes.slice(0, 3).map((set) => (
                <ListItem key={set.id}>
                  <ListItemText
                    primary={
                      <>
                        {set.slots.slice(0, 2).map((slot, index) => (
                          <Typography key={slot.id} variant="body2">
                            {`Player ${index + 1}: ${slot.entrant?.name || 'TBD'}`}
                          </Typography>
                        ))}
                      </>
                    }
        secondary={`Station: ${set.station?.number || 'N/A'}`}
      />
      <Chip label={set.state} size="small" color="primary" />
    </ListItem>
  ))}
</List>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar 
                src={dashboardData.images?.[1]?.url} 
                alt={dashboardData.player?.gamerTag || 'User'}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
            <Typography variant="h4" gutterBottom>
            {dashboardData.player?.gamerTag ||'User'}
            </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Your Tournaments</Typography>
            {dashboardData.tournaments.nodes.length > 0 ? (
              dashboardData.tournaments.nodes.flatMap((tournament, index) => 
                tournament.events.map((event, eventIndex) => (
                  <TournamentEventCard key={`${tournament.id}-${event.id}`} tournament={tournament} event={event} />
                ))
              )
            ) : (
              <Typography>No upcoming tournaments found.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

