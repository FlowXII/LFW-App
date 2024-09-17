import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  console.log('Dashboard route accessed');

  const token = req.cookies.jwt;
  if (!token) {
    console.log('No JWT found in cookies');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const accessToken = decoded.accessToken;
    console.log('Access token retrieved from JWT:', accessToken ? 'Yes' : 'No');

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
        perPage: 5,
        sortBy: "endAt desc",
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
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;