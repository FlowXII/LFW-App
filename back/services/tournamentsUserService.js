import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function fetchTournaments(userSlug, perPage) {
  console.log(`Fetching tournaments for userSlug: ${userSlug}, perPage: ${perPage}`);

  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Response data: ${JSON.stringify(data, null, 2)}`);

    return data;
  } catch (error) {
    console.error(`Error fetching tournaments: ${error.message}`);
    throw error;
  }
}

