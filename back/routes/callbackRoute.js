import express from 'express';
import { handleOAuthCallback } from '../services/callbackService.js';

const router = express.Router();

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log('Authorization code:', code); // Log the authorization code

  try {
    const result = await handleOAuthCallback(code, res); // Pass the res object
    if (result && result.redirectUrl) {
      res.redirect(result.redirectUrl);
    } else {
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error('Error during OAuth callback routing:', error.message);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  }
});

export default router;
