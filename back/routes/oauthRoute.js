import express from 'express';
const router = express.Router();

router.get('/oauth_redirect', (req, res) => {
  const code = req.query.code;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const scopes = process.env.SCOPES; 
  const redirectUri = process.env.REDIRECT_URI; 

  console.log('Client ID:', clientId);
  console.log('Client Secret:', clientSecret);
  console.log('Scopes:', scopes);
  console.log('Redirect URI:', redirectUri);

  if (!clientId) {
    res.send('Client ID is missing.');
    return;
  }

  if (!clientSecret) {
    res.send('Client Secret is missing.');
    return;
  }

  if (!scopes) {
    res.send('Scopes are missing.');
    return;
  }

  if (!redirectUri) {
    res.send('Redirect URI is missing.');
    return;
  }

  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const authUrl = `https://start.gg/oauth/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodedRedirectUri}&client_secret=${clientSecret}`;
  
  console.log('Redirecting to:', authUrl);
  res.redirect(authUrl);
});

export default router;