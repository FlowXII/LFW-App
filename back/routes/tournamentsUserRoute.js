import { getTournamentsByUser } from '../controllers/tournamentsUserController.js';

import express from 'express';
const router = express.Router();

router.get('/tournaments', getTournamentsByUser);

export default router;