import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from a .env file into process.env
dotenv.config();

export async function fetchTournaments(userSlug, perPage) {
  const response = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Use the environment variable here
      'Authorization': `Bearer ${process.env.STARTGG_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { userSlug, perPage: parseInt(perPage, 10) },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
