import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';

dotenv.config();

router.get('/check-session', (req, res) => {
  console.log("accessing session...");
    if (req.session && req.session.accessToken) {
      console.log(req.session.accessToken);
      // Optionally validate the token with the OAuth provider if needed
      return res.json({ isAuthenticated: true });
    } else {
      return res.json({ isAuthenticated: false });
    }
  });

export default router;