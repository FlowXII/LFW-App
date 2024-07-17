import { getTournamentsStations } from '../controllers/tournamentsStationsController.js';

import express from 'express';
const router = express.Router();

router.get('/stations', getTournamentsStations);

export default router;