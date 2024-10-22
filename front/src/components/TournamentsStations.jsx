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
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const REFRESH_INTERVAL = 5000;

function TOLoader() {
  const theme = useTheme();
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [previousIds, setPreviousIds] = useState(new Set());

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

  useEffect(() => {
    if (tournamentData && tournamentData.event && tournamentData.event.sets && tournamentData.event.sets.nodes) {
      const currentIds = new Set(tournamentData.event.sets.nodes.map(set => set.id));
      if (lastAddedId === null) {
        setLastAddedId(currentIds.size > 0 ? Array.from(currentIds)[currentIds.size - 1] : null);
      } else {
        const newId = Array.from(currentIds).find(id => !previousIds.has(id));
        if (newId) {
          setLastAddedId(newId);
        }
      }
      setPreviousIds(currentIds);
    }
  }, [tournamentData]);

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

  const MotionGrid = motion(Grid);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <Container sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
              </Grid>
            </Grid>
          </form>
          <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
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
              tournamentData.event.sets.nodes.length > 0 ? (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Grid container spacing={2} sx={{ m: 0, width: '100%' }}>
                    {tournamentData.event.sets.nodes.map(({ id, state, station, slots }) => (
                      <MotionGrid 
                        item 
                        xs={getCardSize(tournamentData.event.sets.nodes.length)} 
                        key={id}
                        variants={cardVariants}
                        initial={id === lastAddedId ? "hidden" : "visible"}
                        animate="visible"
                      >
                        <Card sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          borderColor: state === 2 ? theme.palette.success.main : state === 6 ? theme.palette.warning.main : 'inherit', 
                          borderWidth: 2, 
                          borderStyle: 'solid',
                          backgroundColor: theme.palette.background.paper,
                        }}>
                          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Typography variant="subtitle1" component="div">
                              Station {station?.number || 'N/A'}
                            </Typography>
                            <Typography variant="caption" component="div" sx={{ color: state === 6 ? theme.palette.warning.main : 'inherit' }}>
                              {state === 2 ? 'Ongoing' : 'Called'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <Card sx={{ width: '100%', bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                                <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                                  <Typography variant="caption" noWrap>
                                    {slots[0]?.entrant?.name || 'TBD'}
                                  </Typography>
                                </CardContent>
                              </Card>
                              <Card sx={{ width: '100%', bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
                                <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                                  <Typography variant="caption" noWrap>
                                    {slots[1]?.entrant?.name || 'TBD'}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Box>
                          </CardContent>
                        </Card>
                      </MotionGrid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ margin: 'auto' }}>
                  No stations are currently active for this event.
                </Typography>
              )
            ) : (
              <Typography variant="body1" sx={{ margin: 'auto' }}>
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