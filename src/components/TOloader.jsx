import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: 'https://api.start.gg/gql/alpha', // replace with your GraphQL API endpoint
});

// Create the authorization header
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = "cd984c5069a9935bfb3d13d6a4f859c5"; //or replace with your auth token
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
});

// Initialising Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

// Your provided GraphQL query
const GET_DATA = gql`
    query SetsAtStation($eventId: ID!, $stationNumbers: [Int]){
        event(id: $eventId) {
            id
            name
            sets(
                page: 1
                perPage: 20
                filters: { 
                    stationNumbers: $stationNumbers
                }) {
                nodes {
                    id
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

function TOLoader() {
    // Replace eventId and stationNumbers with your actual values
    const eventId = '1127277';
    const stationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]; // your actual station numbers

    const { loading, error, data } = useQuery(GET_DATA, {
        variables: { eventId, stationNumbers },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // Here, you can specify what to render based on the API request's results.
    // The 'data' object will contain your query's results.

    return (
        <Grid container spacing={2}>
            {data.event.sets.nodes.map(({ id, station, slots }) => (
                <Grid item xs={12} sm={6} key={id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="div">
                                Station {station.number}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, margin:'1rem' }}>
                                <Card sx={{ width: 200, bgcolor: '#3454ed' }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {slots[0]?.entrant?.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <Card sx={{ width: 200, bgcolor: '#ed374c' }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {slots[1]?.entrant?.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// Wrap your component with the ApolloProvider and pass in your client
export default function App() {
    return (
        <ApolloProvider client={client}>
            <TOLoader />
        </ApolloProvider>
    );
}