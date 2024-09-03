import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  console.log('Dashboard route accessed');

  if (!req.session || !req.session.accessToken) {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const accessToken = req.session.accessToken;
    console.log('Access token retrieved:', accessToken ? 'Yes' : 'No');

    const userNameQuery = `
query {
  currentUser {
    name
  }
}
`;

const userNameResponse = await axios.post('https://api.start.gg/gql/alpha', 
  { query: userNameQuery },
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);

const userName = userNameResponse.data.data.currentUser.name;
console.log('User name retrieved:', userName);


const dashboardQuery = `
query DashboardQuery {
  currentUser {
    name
    id
    location {
      city
      state
      country
      countryId
    }
    images {
      id
      type
      url
    }
    slug
    player {
      id
      gamerTag
      prefix
    }
    tournaments(query: {
      perPage: 1,
      filter: { upcoming: false }
    }) {
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
        events {
          id
          name
          startAt
          state
          numEntrants
          slug
          entrants(query: {
            page: 1,
            perPage: 20,
            filter: { name: "${userName}" }
          }) {
            nodes {
              id
              name
            }
          }
          sets(
            page: 1
            perPage: 20
            filters: { state: [2, 6] }  # State 2 is Ongoing, State 6 is Called
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
    }
  }
}
`;

    console.log('GraphQL query defined');

    // Send a POST request with the GraphQL query
    const dashboardResponse = await axios.post('https://api.start.gg/gql/alpha', 
      { query: dashboardQuery },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Dashboard data retrieved successfully');

    res.json(dashboardResponse.data);
  } catch (error) {
    console.error('Error fetching user dashboard:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
