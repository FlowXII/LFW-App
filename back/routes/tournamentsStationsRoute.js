// C:\Users\boyme\Code\LFW-App\back\routes\tournamentsUserRoute.js
import { getTournamentsStations } from '../controllers/tournamentsStationsController.js';

// Assuming you're using Express or a similar framework:
import express from 'express';
const router = express.Router();

router.get('/stations', getTournamentsStations);

export default router;