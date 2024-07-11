import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClientProvider';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const GET_DATA = gql`
  query TournamentsByCountry($cCode: String!, $perPage: Int!, $videogameId: ID!) {
    tournaments(query: {
      perPage: $perPage
      filter: {
        past : false
        countryCode: $cCode
        videogameIds: [
                $videogameId
        ]
      }
    }) {
      nodes {
        id
        name
        countryCode
      }
    }
  }
`;

function NextBattle() {
  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { cCode: "FR", perPage: 64, videogameId: "1386" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error: {error.message}</p>;
  }

  return (
        <ApolloProvider client={client}>
          <Grid container spacing={2}>
            {data.tournaments && data.tournaments.nodes.map((tournament) => (
              <Grid item xs={12} key={tournament.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">{tournament.name}</Typography>
                    <Typography variant="body1">Country: {tournament.countryCode}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </ApolloProvider>
      );
}

export default NextBattle;