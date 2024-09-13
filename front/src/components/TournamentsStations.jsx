import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  CircularProgress,
  Container,
} from '@mui/material';

const REFRESH_INTERVAL = 5000;

function TOLoader() {
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);

  useEffect(() => {
    if (submittedEventId) {
      const interval = setInterval(() => {
        fetchTournaments();
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [submittedEventId]);

  const url = `${window.location.origin}/api/stations?eventId=${submittedEventId}`;

  const fetchTournaments = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data || !data.data.event || !data.data.event.sets || !data.data.event.sets.nodes) {
        throw new Error('Unexpected data structure from API');
      }

      setTournamentData(data.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
      setTournamentData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedEventId(eventId);
    setEventId('');
  };

  const getCardSize = (totalCards) => {
    if (totalCards <= 4) return 3;
    if (totalCards <= 9) return 4;
    if (totalCards <= 16) return 3;
    if (totalCards <= 25) return 2.4;
    return 2;
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {!submittedEventId ? (
        <Box sx={{ textAlign: 'center', my: 'auto' }}>
          <Typography variant='h3' gutterBottom>Station Viewer</Typography>
          <form onSubmit={handleSubmit} style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <TextField
                  label="Enter Event ID"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
              </Grid>
            </Grid>
          </form>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Warning, this feature is meant for now for TO's and testing purposes only! <br />
            The event ID can be found in the URL of the admin event page on start.gg <br />
            (https://www.start.gg/admin/tournament/tournament-for-testing-1/brackets/1140299/1664029/2480004)<br />
            There, the event ID would be 1140299. (use this number if you wanna test this)
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant='h4' gutterBottom>Station Viewer</Typography>
          <Typography variant="h5" gutterBottom>
            Current Matches:
          </Typography>
          {tournamentData === null ? (
            <CircularProgress sx={{ margin: 'auto' }} />
          ) : (
            tournamentData.event && tournamentData.event.sets && tournamentData.event.sets.nodes ? (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Grid container spacing={2} sx={{ m: 0, width: '100%' }}>
                  {tournamentData.event.sets.nodes.map(({ id, state, station, slots }) => (
                    <Grid item xs={getCardSize(tournamentData.event.sets.nodes.length)} key={id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderColor: state === 2 ? 'white' : state === 6 ? 'orange' : 'inherit', borderWidth: 2, borderStyle: 'solid' }}>
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="subtitle1" component="div">
                            Station {station.number}
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ color: state === 6 ? 'orange' : 'inherit' }}>
                            {state === 2 ? 'Ongoing' : 'Called'}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Card sx={{ width: '100%', bgcolor: '#1976d2', color: 'white' }}>
                              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                                <Typography variant="caption" noWrap>
                                  {slots[0]?.entrant?.name || 'TBD'}
                                </Typography>
                              </CardContent>
                            </Card>
                            <Card sx={{ width: '100%', bgcolor: '#dc004e', color: 'white' }}>
                              <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                                <Typography variant="caption" noWrap>
                                  {slots[1]?.entrant?.name || 'TBD'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body1">
                No data available for this event.
              </Typography>
            )
          )}
        </Box>
      )}
    </Container>
  );
}

export default TOLoader;