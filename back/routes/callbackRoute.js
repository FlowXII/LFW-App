import express from 'express';
import { handleOAuthCallback } from '../services/callbackService.js'; // Import the function

const router = express.Router();

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const result = await handleOAuthCallback(code);

    // Assuming you get user data from OAuth provider
    const user = { id: '123', name: 'John Doe' }; // Replace with actual user data

    // Set user data in session
    req.session.user = user;

    // Redirect to the URL returned by handleOAuthCallback
    res.redirect(result.redirectUrl);
  } catch (error) {
    console.error('Error during OAuth callback handling:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
