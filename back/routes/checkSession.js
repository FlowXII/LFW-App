import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/check_session', (req, res) => {
  console.log("accessing session...");

  const token = req.cookies.jwt; // Extract JWT from cookies

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    console.log('Decoded JWT:', decoded);

    // Optionally validate the token with the OAuth provider if needed
    return res.json({ isAuthenticated: true });
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.json({ isAuthenticated: false });
  }
});

export default router;

