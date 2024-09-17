import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Container, Box, CircularProgress, Chip, Button } from '@mui/material';
import { EventNote, LocationOn, Person, Notifications } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dashboardDataRef = useRef(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    dashboardDataRef.current = dashboardData;
  }, [dashboardData]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
        withCredentials: true // This ensures cookies are sent with the request
      });
      console.log('Fetched dashboard data:', response.data);
      const currentUserData = response.data.data?.currentUser || null;
      console.log('Extracted currentUser data:', currentUserData);
      return currentUserData;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
      return null;
    }
  }, []);

  const sendNotification = useCallback((title, options) => {
    console.log('Attempting to send notification:', { title, options });
    if (Notification.permission === 'granted') {
      console.log('Notification permission is granted');
      try {
        new Notification(title, options);
        console.log('Notification sent successfully');
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      console.warn('Notification permission not granted');
    }
  }, []);

  const checkForUpdates = useCallback((newData) => {
    console.log('Checking for updates');
    const oldData = dashboardDataRef.current;
    console.log('Old data:', oldData);
    console.log('New data:', newData);
    if (!oldData || !newData) {
      console.log('No old or new data available for comparison');
      return;
    }
  
    newData.tournaments.nodes.forEach((newTournament) => {
      newTournament.events.forEach((newEvent) => {
        const oldEvent = oldData.tournaments.nodes.find(t => t.id === newTournament.id)?.events.find(e => e.id === newEvent.id);
        if (!oldEvent) {
          console.log('No matching old event found');
          return;
        }
  
        newEvent.sets.nodes.forEach((newSet, sIndex) => {
          const oldSet = oldEvent.sets.nodes[sIndex];
          if (!oldSet) {
            console.log('No matching old set found');
            return;
          }
  
          console.log('Comparing set states:', { old: oldSet.state, new: newSet.state });
          console.log(newSet.state);
          if (newSet.state !== oldSet.state) {
            console.log('Set state changed');
            const isPlayerInvolved = newSet.slots.some(slot => 
              slot.entrant?.name === newData.player?.gamerTag
            );
  
            console.log('Is player involved:', isPlayerInvolved);
            if (isPlayerInvolved) {
              const notificationTitle = 'Match Update';
              const notificationBody = `Your match at ${newTournament.name} (${newEvent.name}) has been updated. New state: ${newSet.state}`;
  
              console.log('Notification prepared:', { title: notificationTitle, body: notificationBody });
              sendNotification(notificationTitle, {
                body: notificationBody,
                icon: newData.images?.[1]?.url || '/path/to/default-icon.png',
              });
            }
          }
        });
      });
    });
  }, [sendNotification]);

  useEffect(() => {
    console.log('Dashboard component mounted');

    const initialFetch = async () => {
      console.log('Performing initial data fetch');
      const data = await fetchDashboardData();
      console.log('Initial data set to state:', data);
      setDashboardData(data);
      setLoading(false);
    };

    initialFetch();

    const interval = setInterval(async () => {
      console.log('Polling for updates');
      const newData = await fetchDashboardData();
      if (newData) {
        console.log('New data fetched, updating state');
        setDashboardData(newData);
      } else {
        console.log('No new data fetched');
      }
    }, 10000);

    return () => {
      console.log('Dashboard component unmounting, clearing interval');
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      }
    });
  };

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
                      Station : {set.station?.number || 'N/A'}
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
              <Button
                variant="contained"
                startIcon={<Notifications />}
                onClick={requestNotificationPermission}
                disabled={notificationsEnabled}
                sx={{ mt: 2 }}
              >
                {notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
              </Button>
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
              <Typography>No upcoming tournaments found where you are registered.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;