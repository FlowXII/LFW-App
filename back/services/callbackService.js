import axios from 'axios';
import querystring from 'querystring';
import dotenv from 'dotenv';

dotenv.config();

export const handleOAuthCallback = async (code, req) => {
  if (!code) {
    throw new Error('Authorization code is missing');
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  console.log('Client ID:', clientId); // Debug log
  console.log('Client Secret:', clientSecret ? '***' : 'Missing'); // Debug log
  console.log('Redirect URI:', redirectUri); // Debug log

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Client ID, Client Secret, or Redirect URI is missing.');
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
    req.session.accessToken = accessToken;
    console.log('Access Token:', accessToken);

    return { redirectUrl: '/dashboard' };
  } catch (error) {
    console.error('Error during OAuth callback handling:', error.response ? error.response.data : error.message);
    throw new Error('Error during OAuth callback handling');
  }
};
