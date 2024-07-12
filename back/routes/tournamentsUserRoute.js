// C:\Users\boyme\Code\LFW-App\back\routes\tournamentsUserRoute.js
import { getTournamentsByUser } from '../controllers/tournamentsUserController.js';

// Assuming you're using Express or a similar framework:
import express from 'express';
const router = express.Router();

router.get('/tournaments', getTournamentsByUser);

export default router;