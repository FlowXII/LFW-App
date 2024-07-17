import {getUpcomingTournaments } from '../controllers/tournamentsUpcomingController.js';

import express from 'express';
const router = express.Router();

router.get('/upcoming', getUpcomingTournaments);

export default router;