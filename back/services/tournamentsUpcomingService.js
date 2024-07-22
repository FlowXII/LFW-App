import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
console.log(`STARTGG_TOKEN: ${process.env.STARTGG_TOKEN}`);

export async function fetchUpcomingTournaments(cCode, perPage, videogameId) {
  console.log(`Fetching tournaments for countryCode: ${cCode}, perPage: ${perPage}, videogameId: ${videogameId}`);

  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STARTGG_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
            query TournamentsByCountry($cCode: String!, $perPage: Int!, $videogameId: ID!) {
                tournaments(query: {
                    perPage: $perPage
                    filter: {
                        upcoming: true
                        past: false
                        countryCode: $cCode
                        videogameIds: [$videogameId]
                    }
                }) {
                    nodes {
                        id
                        name
                        countryCode
                        startAt
                        endAt
                        venueAddress
                        city
                        slug
                    }
                }
            }
        `,
        variables: { cCode, perPage, videogameId },
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
