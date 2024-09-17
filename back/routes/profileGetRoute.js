import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.get('/profile', async (req, res) => {
  console.log('Profile route accessed');

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

    const profileQuery = `
    query ProfileQuery {
      currentUser {
        id
        name
        bio
        birthday
        genderPronoun
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
      }
    }
    `;

    console.log('GraphQL query defined');

    // Send a POST request with the GraphQL query
    const profileResponse = await axios.post('https://api.start.gg/gql/alpha', 
      { query: profileQuery },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Profile data retrieved successfully');

    res.json(profileResponse.data);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

