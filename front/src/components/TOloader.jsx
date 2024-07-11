import React, { useState, useEffect } from 'react';
import { useQuery, gql, ApolloProvider } from '@apollo/client';
import client from './ApolloClientProvider';
import { Card, CardContent, Typography, Grid, Box, TextField, Button, CircularProgress, Container } from '@mui/material';

const GET_DATA = gql`
  query SetsAtStation($eventId: ID!, $stationNumbers: [Int]) {
    event(id: $eventId) {
      id
      name
      sets(
        page: 1
        perPage: 20
        filters: {
          state: [2, 6] # State 2 is Ongoing, State 6 is Called.
          stationNumbers: $stationNumbers
        }
      ) {
        nodes {
          id
          state
          station {
            id
            number
          }
          slots {
            id
            entrant {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const REFRESH_INTERVAL = 5000;

function TOLoader() {
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const stationNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    variables: { eventId: submittedEventId, stationNumbers },
    skip: !submittedEventId,
  });

  useEffect(() => {
    if (submittedEventId) {
      const interval = setInterval(() => {
        refetch();
        setCountdown(REFRESH_INTERVAL / 1000);
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [submittedEventId, refetch]);

  useEffect(() => {
    if (submittedEventId) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : REFRESH_INTERVAL / 1000));
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [submittedEventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedEventId(eventId);
  };

  return (
    <ApolloProvider client={client}>
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
            {loading && <CircularProgress />}
            {error && (
              <Typography variant="body1" color="error">
                Error fetching data. Please reload the page.
              </Typography>
            )}
            {!data || !data.event ? (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant='h6'>No such event found. Try again?</Typography>
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
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {data.event.sets.nodes.map(({ id, state, station, slots }) => (
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
            )}
          </Box>
        )}
      </Container>
    </ApolloProvider>
  );
}

export default TOLoader;
