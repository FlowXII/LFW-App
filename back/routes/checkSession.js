import express from 'express';
const router = express.Router();

router.get('/check-session', (req, res) => {
    if (req.session && req.session.accessToken) {
      // Optionally validate the token with the OAuth provider if needed
      return res.json({ isAuthenticated: true });
    } else {
      return res.json({ isAuthenticated: false });
    }
  });

export default router;