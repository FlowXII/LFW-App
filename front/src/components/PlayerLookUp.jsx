import React, { useState } from 'react';
import { useQuery, gql, ApolloProvider } from '@apollo/client';
import client from './ApolloClientProvider';
import { Card, CardContent, Typography, Grid, TextField, Button, Box, CircularProgress } from '@mui/material';

const GET_DATA = gql`
query TournamentsByUser($userSlug: String!, $perPage: Int!) {
  user(slug: $userSlug) {
    name
    player {
      id
      gamerTag
      prefix
    }
    tournaments(query: {perPage: $perPage, filter: {upcoming: true}}) {
      nodes {
        id
        name
        startAt
        endAt
        venueAddress
        city
        state
        countryCode
        slug
      }
    }
  }
}
`;

function PlayerLookUp() {
  const [userSlug, setUserSlug] = useState("FR");
  const [perPage, setPerPage] = useState(32);
  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    variables: { userSlug, perPage }
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    refetch({ userSlug, perPage });
  };

  return (
    <ApolloProvider client={client}>
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              label="ID du joueur"
              value={userSlug}
              onChange={(e) => setUserSlug(e.target.value)}
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Box>
        </form>
        {loading && <CircularProgress />}
        {error && <Typography variant="body1" color="error">Error: {error.message}</Typography>}
        {data && data.user && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4">{data.user.name}</Typography>
            <Typography variant="h4">{data.user.player.gamerTag}</Typography>
          </Box>
        )}
        {data && data.user && (
          <Grid container spacing={2}>
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
    </ApolloProvider>
  );
}

export default PlayerLookUp;


