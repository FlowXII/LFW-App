import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: 'https://api.start.gg/gql/alpha', // replace with your GraphQL API endpoint
});

// Create the authorization header
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
   // const token = process.env.START_GG_TOKEN;
    const token = "cd984c5069a9935bfb3d13d6a4f859c5";
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

export default client;