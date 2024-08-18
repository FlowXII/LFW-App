import express from 'express';
import { getProfile, login } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', getProfile);
router.post('/login', login);

export default router;