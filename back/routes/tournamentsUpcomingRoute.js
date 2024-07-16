// C:\Users\boyme\Code\LFW-App\back\routes\tournamentsUserRoute.js
import {getUpcomingTournaments } from '../controllers/tournamentsUpcomingController.js';

// Assuming you're using Express or a similar framework:
import express from 'express';
const router = express.Router();

router.get('/upcoming', getUpcomingTournaments);

export default router;