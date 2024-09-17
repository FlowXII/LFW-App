import express from 'express';
import { handleOAuthCallback } from '../services/callbackService.js';

const router = express.Router();

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log('Authorization code:', code); // Log the authorization code

  try {
    const result = await handleOAuthCallback(code, res); // Pass the res object
    res.redirect(result.redirectUrl);
  } catch (error) {
    console.error('Error during OAuth callback routing:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;

