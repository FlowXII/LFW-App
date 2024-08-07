import { handleOAuthCallback } from '../services/callbackService.js';

export const oauthCallback = async (req, res) => {
  try {
    const result = await handleOAuthCallback(req.query.code);
    res.redirect(result.redirectUrl);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
