import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/profile', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session || !req.session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log("Checking if the route is used");
  try {
    const accessToken = req.session.accessToken;

    // Define the GraphQL query
    const query = `
      query {
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
          player {
            id
            gamerTag
          }
        }
      }`;

    // Send a POST request with the GraphQL query
    const profileResponse = await axios.post('https://api.start.gg/gql/alpha', 
      { query },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(profileResponse.data);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

