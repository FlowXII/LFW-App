import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const STARTGG_TOKEN = process.env.STARTGG_TOKEN;

export async function fetchStationsTournaments(eventId) {
  console.log(`Fetching tournaments for event ID: ${eventId}`);

  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STARTGG_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query SetsAtStation($eventId: ID!) {
            event(id: $eventId) {
              id
              name
              sets(
                page: 1
                perPage: 20
                filters: {
                  state: [2, 6] # State 2 is Ongoing, State 6 is Called.
                }
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
        `,
        variables: { eventId },
      }),
    });

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
