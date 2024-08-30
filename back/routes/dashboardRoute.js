import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  // Check if the user is authenticated (not checking it anymore temporarily)
  /*
  if (!req.session || !req.session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  */
  try {
    const accessToken = process.env.TEMPORARY_OAUTH_TOKEN;
    // Define the GraphQL query
    const query = `
query DashboardQuery {
  currentUser {
    name
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
  

    // Send a POST request with the GraphQL query
    const dashboardResponse = await axios.post('https://api.start.gg/gql/alpha', 
      { query },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(dashboardResponse.data);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;