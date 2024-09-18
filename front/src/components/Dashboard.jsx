import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Container, Box, CircularProgress, Chip, Button } from '@mui/material';
import { EventNote, LocationOn, Person, Notifications } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  console.log('Dashboard component rendering');

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dashboardDataRef = useRef(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastPlayerSetsCount, setLastPlayerSetsCount] = useState(0);

  useEffect(() => {
    console.log('dashboardData updated:', dashboardData);
    dashboardDataRef.current = dashboardData;
  }, [dashboardData]);

  const fetchDashboardData = useCallback(async () => {
    console.log('Fetching dashboard data...');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
        withCredentials: true
      });
      console.log('Dashboard data fetched successfully:', response.data);
      return response.data.data?.currentUser || null;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
      return null;
    }
  }, []);

  const sendNotification = useCallback(async (title, options) => {
    console.log('Attempting to send notification:', title, options);
    
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers are not supported in this browser');
      return;
    }
  
    try {
      console.log('Checking if service worker is ready...');
      const registration = await navigator.serviceWorker.ready;
      console.log('Service worker is ready:', registration);
  
      console.log('Checking notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
  
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }
  
      console.log('Showing notification...');
      await registration.showNotification(title, options);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error in sendNotification:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }, []);

  const notifyNewSets = useCallback(async (newData) => {
    console.log('Checking for new sets...');
    const newPlayerSets = newData.tournaments.nodes.flatMap(tournament =>
      tournament.events.flatMap(event =>
        event.sets.nodes.filter(set =>
          set.slots.some(slot => slot.entrant?.name === newData.player?.gamerTag)
        )
      )
    );

    console.log('New player sets count:', newPlayerSets.length);
    console.log('Last player sets count:', lastPlayerSetsCount);

    if (newPlayerSets.length > lastPlayerSetsCount) {
      const newSetsCount = newPlayerSets.length - lastPlayerSetsCount;
      console.log(`${newSetsCount} new set(s) found. Sending notification.`);
      await sendNotification('New Sets Available', {
        body: `You have ${newSetsCount} new set${newSetsCount > 1 ? 's' : ''} to play.`,
        icon: newData.images?.[1]?.url || '/path/to/default-icon.png',
        tag: 'new-sets',
        renotify: true
      });
    } else {
      console.log('No new sets found.');
    }
    setLastPlayerSetsCount(newPlayerSets.length);
  }, [sendNotification, lastPlayerSetsCount]);

  const checkForUpdates = useCallback(async (newData) => {
    console.log('Checking for updates...');
    const oldData = dashboardDataRef.current;
    if (!oldData || !newData) {
      console.log('No old data or new data available for comparison');
      return;
    }

    newData.tournaments.nodes.forEach((newTournament) => {
      const oldTournament = oldData.tournaments.nodes.find(t => t.id === newTournament.id);
      if (!oldTournament) {
        console.log(`New tournament found: ${newTournament.name}`);
        return;
      }
      newTournament.events.forEach((newEvent) => {
        const oldEvent = oldTournament.events.find(e => e.id === newEvent.id);
        if (!oldEvent) {
          console.log(`New event found in tournament ${newTournament.name}: ${newEvent.name}`);
          return;
        }
        newEvent.sets.nodes.forEach(async (newSet) => {
          const oldSet = oldEvent.sets.nodes.find(s => s.id === newSet.id);
          if (!oldSet || newSet.state === oldSet.state) return;
          const isPlayerInvolved = newSet.slots.some(slot => slot.entrant?.name === newData.player?.gamerTag);
          if (isPlayerInvolved) {
            console.log(`Set state changed for player ${newData.player?.gamerTag}:`, oldSet.state, '->', newSet.state);
            let stateChange = '';
            if (oldSet.state === '1' && newSet.state === '6') stateChange = 'Your match has been called!';
            else if (oldSet.state === '6' && newSet.state === '2') stateChange = 'Your match is now in progress!';
            else if (newSet.state === '3') stateChange = 'Your match has ended!';
            else stateChange = `Your match state changed from ${oldSet.state} to ${newSet.state}`;

            await sendNotification('Match Update', {
              body: `${stateChange} - ${newTournament.name} (${newEvent.name})`,
              icon: newData.images?.[1]?.url || '/path/to/default-icon.png',
              tag: `match-update-${newSet.id}`,
              renotify: true
            });
          }
        });
      });
    });

    await notifyNewSets(newData);
  }, [sendNotification, notifyNewSets]);

  useEffect(() => {
    console.log('Dashboard component mounted');
    let isMounted = true;
    let intervalId = null;

    const fetchData = async () => {
      console.log('Fetching data...');
      try {
        const data = await fetchDashboardData();
        if (isMounted) {
          if (data) {
            console.log('New data received, checking for updates');
            await checkForUpdates(data);
            setDashboardData(data);
          } else {
            console.log('No data received from fetchDashboardData');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        if (isMounted) {
          setError('Failed to fetch dashboard data');
          setLoading(false);
        }
      }
    };

    fetchData(); // Initial fetch

    intervalId = setInterval(() => {
      console.log('Interval triggered, fetching data...');
      fetchData();
    }, 10000); // Refresh every 10 seconds

    return () => {
      console.log('Dashboard component unmounting');
      isMounted = false;
      if (intervalId) {
        console.log('Clearing interval');
        clearInterval(intervalId);
      }
    };
  }, [fetchDashboardData, checkForUpdates]);

  const requestNotificationPermission = async () => {
    console.log('Requesting notification permission...');
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers are not supported in this browser');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('Notifications Enabled', {
          body: 'You will now receive notifications for your matches.',
          icon: dashboardData.images?.[1]?.url || '/path/to/default-icon.png',
        });
        console.log('Notification sent: Notifications Enabled');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  console.log('Rendering Dashboard component');
  console.log('Current state:', { loading, error, dashboardData, notificationsEnabled, lastPlayerSetsCount });

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!dashboardData) return <Typography>No dashboard data available</Typography>;

  const TournamentEventCard = ({ tournament, event, loggedInPlayerName }) => {
    console.log(`Rendering TournamentEventCard for ${tournament.name} - ${event.name}`);
    const playerSets = event.sets.nodes.filter(set => set.slots.some(slot => slot.entrant?.name === loggedInPlayerName));
    console.log(`Player sets for ${loggedInPlayerName}:`, playerSets);

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
                    <Typography variant="h6" fontWeight="bold">Station : {set.station?.number || 'N/A'}</Typography>
                    {getSetStateChip(set.state)}
                  </Box>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    {set.slots.map((slot, index) => (
                      <Box key={slot.id} sx={{ bgcolor: index === 0 ? '#102385' : '#590507', p: 1, borderRadius: '4px', flex: 1, mr: index === 0 ? 1 : 0 }}>
                        <Typography variant="body1">Player {index + 1}: <strong>{slot.entrant?.name || 'TBD'}</strong>{slot.entrant?.name === loggedInPlayerName && ' (You)'}</Typography>
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
              <Typography variant="h4" gutterBottom>{dashboardData.player?.gamerTag || 'User'}</Typography>
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

