import { fetchStationsTournaments } from '../services/tournamentsStationsService.js';

export const getTournamentsStations = async (req, res) => {

  const eventId = parseInt(req.query.eventId); 

  try {
    const jsonData = await fetchStationsTournaments(eventId);
    res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data from start.gg:', error);
    res.status(500).send('Internal Server Error');
  }

};
