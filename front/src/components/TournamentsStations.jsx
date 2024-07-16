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
  Container
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

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/stations?eventId=${submittedEventId}`);
      console.log('Submitted event ID:', submittedEventId); // Check the submitted eventId
      console.log('Response status:', response.status); // Check the response status

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // Log the entire response data

      // Ensure data structure matches expectations
      if (!data.data || !data.data.event || !data.data.event.sets || !data.data.event.sets.nodes) {
        throw new Error('Unexpected data structure from API');
      }

      // Set the tournamentData state
      setTournamentData(data.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
      setTournamentData(null); // Reset tournamentData on error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedEventId(eventId); // Set submittedEventId to eventId
    setEventId(''); // Clear eventId input after submission
    console.log('Submitted event ID:', eventId); // Log the submitted eventId
  };

  return (
    <Container sx={{ mt: 4 }}>
      {!submittedEventId ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h3' gutterBottom>Station Viewer</Typography>
          <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
            <TextField
              label="Enter Event ID"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </form>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h3' gutterBottom>Station Viewer</Typography>
          <Typography variant="h5" gutterBottom>
            Current Matches :
          </Typography>
          {tournamentData === null ? (
            <CircularProgress />
          ) : (
            tournamentData.event && tournamentData.event.sets && tournamentData.event.sets.nodes ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {tournamentData.event.sets.nodes.map(({ id, state, station, slots }) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                    <Card sx={{ borderColor: state === 2 ? 'white' : state === 6 ? 'orange' : 'inherit', borderWidth: 2, borderStyle: 'solid' }}>
                      <CardContent>
                        <Typography variant="h4" component="div">
                          Station {station.number}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: state === 6 ? 'orange' : 'inherit' }}>
                          {state === 2 ? 'Ongoing' : 'Called'}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                          <Card sx={{ width: '100%', bgcolor: '#102385', color: 'white' }}>
                            <CardContent>
                              <Typography variant="h6">
                                {slots[0]?.entrant?.name || 'TBD'}
                              </Typography>
                            </CardContent>
                          </Card>
                          <Card sx={{ width: '100%', bgcolor: '#590507', color: 'white' }}>
                            <CardContent>
                              <Typography variant="h6">
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


