import axios from 'axios';
import querystring from 'querystring';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const handleOAuthCallback = async (code, res) => {
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;
  const jwtSecret = process.env.JWT_SECRET;
  const frontendUrl = process.env.FRONTEND_URL; // Add this line

  console.log('Client ID:', clientId);
  console.log('Client Secret:', clientSecret ? '***' : 'Missing');
  console.log('Redirect URI:', redirectUri);

  if (!clientId || !clientSecret || !redirectUri || !jwtSecret || !frontendUrl) {
    return res.status(500).json({ error: 'Client ID, Client Secret, Redirect URI, JWT Secret, or Frontend URL is missing.' });
  }

  try {
    const tokenResponse = await axios.post('https://api.start.gg/oauth/access_token', querystring.stringify({
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('Access Token:', accessToken);

    // Generate JWT
    const jwtToken = jwt.sign({ accessToken }, jwtSecret, { expiresIn: '1h' });
    console.log('JWT Token:', jwtToken);

    // Set JWT as a cookie
    res.cookie('jwt', jwtToken, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour in milliseconds
    });

    // Redirect to the frontend dashboard
    return res.redirect(`${frontendUrl}/dashboard`);
  } catch (error) {
    console.error('Error during OAuth callback handling:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Error during OAuth callback handling' });
  }
};