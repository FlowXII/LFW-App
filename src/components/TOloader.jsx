import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: 'https://api.start.gg/gql/alpha', // replace with your GraphQL API endpoint
});

// Create the authorization header
const authLink = setContext((_, { headers }) => {
    const token = "cd984c5069a9935bfb3d13d6a4f859c5"; //or replace with your auth token
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
    # Query to fetch sets at a specific station for a given event
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
                }) {
                nodes {
                    id
                    state # Add the state field here
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

const REFRESH_INTERVAL = 5000; // Refresh every 5 seconds

function TOLoader() {
    const [eventId, setEventId] = useState('');
    const [submittedEventId, setSubmittedEventId] = useState(null);
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
    const stationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]; // your actual station numbers

    const { loading, error, data, refetch } = useQuery(GET_DATA, {
        variables: { eventId: submittedEventId, stationNumbers },
        skip: !submittedEventId, // Skip the query if no event ID is submitted
    });

    useEffect(() => {
        if (submittedEventId) {
            const interval = setInterval(() => {
                refetch();
                setCountdown(REFRESH_INTERVAL / 1000); // Reset countdown
            }, REFRESH_INTERVAL);

            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [submittedEventId, refetch]);

    useEffect(() => {
        if (submittedEventId) {
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : REFRESH_INTERVAL / 1000));
            }, 1000);

            return () => clearInterval(countdownInterval); // Cleanup interval on component unmount
        }
    }, [submittedEventId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedEventId(eventId);
    };

    if (!submittedEventId) {
        return (
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    placeholder="Enter Event ID"
                />
                <button type="submit">Submit</button>
            </form>
        );
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    if (!data || !data.event) return <p>No data available</p>;

    return (
        <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '0px 8px', margin: '10px' }}>
            <Grid container spacing={1} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
                {data.event.sets.nodes.map(({ id, state, station, slots }) => (
                    <Grid item xs={12} sm={6} md={3} lg={2} key={id} style={{ display: 'flex', flexDirection: 'column', flex: '1 0 16%', boxSizing: 'border-box', padding: '4px' }}>
                        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', border: state === 2 ? '1px solid white' : state === 6 ? '1px solid orange' : 'none'}}>
                            <CardContent style={{ flex: 1 }}>
                                <Typography variant="h4" component="div">
                                    Station {station.number}
                                </Typography>
                                <Typography variant="h6" component="div" style={{ color: state === 6 ? 'orange' : 'inherit' }}>
                                {state === 2 ? 'Ongoing' : 'Called'}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, margin: '1rem' }}>
                                    <Card sx={{ width: 150, bgcolor: '#3454ed' }}>
                                        <CardContent>
                                            <Typography variant="h6">
                                                {slots[0]?.entrant?.name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ width: 150, bgcolor: '#ed374c' }}>
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
        </div>
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