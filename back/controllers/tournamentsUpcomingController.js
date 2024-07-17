import { fetchUpcomingTournaments } from '../services/tournamentsUpcomingService.js';

export const getUpcomingTournaments = async (req, res) => {
  const { cCode, perPage, videogameId } = req.query;
  try {
    const jsonData = await fetchUpcomingTournaments(cCode, perPage, videogameId);
    res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data from start.gg:', error);
    res.status(500).send('Internal Server Error');
  }
};
