import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Container, Box, CircularProgress, Chip } from '@mui/material';
import { EventNote, LocationOn, Person } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`);
      return response.data.data?.currentUser || null;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
      return null;
    }
  }, []);

  const sendNotification = useCallback((title, options) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }, []);

  const checkForUpdates = useCallback((newData, oldData) => {
    if (!oldData || !newData) return;

    newData.tournaments.nodes.forEach((newTournament, tIndex) => {
      newTournament.events.forEach((newEvent, eIndex) => {
        const oldEvent = oldData.tournaments.nodes[tIndex]?.events[eIndex];
        if (!oldEvent) return;

        newEvent.sets.nodes.forEach((newSet, sIndex) => {
          const oldSet = oldEvent.sets.nodes[sIndex];
          if (!oldSet) return;

          if (newSet.state !== oldSet.state) {
            const isPlayerInvolved = newSet.slots.some(slot => 
              slot.entrant?.name === newData.player?.gamerTag
            );

            if (isPlayerInvolved) {
              let notificationTitle, notificationBody;
              if (newSet.state === '6') {
                notificationTitle = 'Match Called!';
                notificationBody = `Your match at ${newTournament.name} (${newEvent.name}) has been called. Station: ${newSet.station?.number || 'N/A'}`;
              } else if (newSet.state === '2') {
                notificationTitle = 'Match Started!';
                notificationBody = `Your match at ${newTournament.name} (${newEvent.name}) has begun. Station: ${newSet.station?.number || 'N/A'}`;
              }

              if (notificationTitle) {
                sendNotification(notificationTitle, {
                  body: notificationBody,
                  icon: newData.images?.[1]?.url || '/path/to/default-icon.png',
                });
              }
            }
          }
        });
      });
    });
  }, [sendNotification]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const initialFetch = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLoading(false);
    };

    initialFetch();

    const interval = setInterval(async () => {
      const newData = await fetchDashboardData();
      if (newData) {
        checkForUpdates(newData, dashboardData);
        setDashboardData(newData);
      }
    }, 30000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardData, checkForUpdates, dashboardData]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!dashboardData) return <Typography>No dashboard data available</Typography>;

  const TournamentEventCard = ({ tournament, event, loggedInPlayerName }) => {
    const playerSets = event.sets.nodes.filter(set => 
      set.slots.some(slot => slot.entrant?.name === loggedInPlayerName)
    );

    const getSetStateChip = (state) => {
      if (state === '6') return <Chip label="Called" size="small" sx={{ bgcolor: 'orange', color: 'white' }} />;
      if (state === '2') return <Chip label="Ongoing" size="small" sx={{ bgcolor: '#1976d2', color: 'white' }} />;
      return <Chip label={state} size="small" color="default" />;
    };

    return (
      <Card sx={{ mb: 2, boxShadow: 3, width: '100%', bgcolor: '#1e1e1e', color: 'white' }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Typography variant="h5" gutterBottom>{tournament.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>{event.name}</Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <EventNote sx={{ mr: 1 }} />
              <Typography variant="body2">
                {new Date(tournament.startAt * 1000).toLocaleDateString()} - {new Date(tournament.endAt * 1000).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body2">{tournament.city}, {tournament.countryCode}</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Person sx={{ mr: 1 }} />
              <Typography variant="body2">Entrants: {event.numEntrants}</Typography>
            </Box>
          </Box>
          {playerSets.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom align="center">You have to play!</Typography>
              {playerSets.map((set) => (
                <Box key={set.id} sx={{ border: '1px solid #444', borderRadius: '4px', mb: 2, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      Your match is at Station: {set.station?.number || 'N/A'}
                    </Typography>
                    {getSetStateChip(set.state)}
                  </Box>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    {set.slots.map((slot, index) => (
                      <Box 
                        key={slot.id} 
                        sx={{ 
                          bgcolor: index === 0 ? '#102385' : '#590507', 
                          p: 1, 
                          borderRadius: '4px',
                          flex: 1,
                          mr: index === 0 ? 1 : 0
                        }}
                      >
                        <Typography variant="body1">
                          Player {index + 1}: <strong>{slot.entrant?.name || 'TBD'}</strong>
                          {slot.entrant?.name === loggedInPlayerName && ' (You)'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar 
                src={dashboardData.images?.[1]?.url} 
                alt={dashboardData.player?.gamerTag || 'User'}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              <Typography variant="h4" gutterBottom>
                {dashboardData.player?.gamerTag || 'User'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>Your Tournaments</Typography>
            {dashboardData.tournaments.nodes.length > 0 ? (
              dashboardData.tournaments.nodes.flatMap((tournament) => 
                tournament.events.map((event) => (
                  <TournamentEventCard 
                    key={`${tournament.id}-${event.id}`} 
                    tournament={tournament} 
                    event={event} 
                    loggedInPlayerName={dashboardData.player?.gamerTag}
                  />
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