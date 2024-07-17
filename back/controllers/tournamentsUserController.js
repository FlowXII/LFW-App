import { fetchTournaments } from '../services/tournamentsUserService.js';

export const getTournamentsByUser = async (req, res) => {
  const { userSlug, perPage } = req.query;
  try {
    const jsonData = await fetchTournaments(userSlug, perPage);
    res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data from start.gg:', error);
    res.status(500).send('Internal Server Error');
  }
};
