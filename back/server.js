import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
import sessionMiddleware from './middleware/session.js';
import tournamentsUserRoute from './routes/tournamentsUserRoute.js';
import tournamentsStationsRoute from './routes/tournamentsStationsRoute.js';
import tournamentsUpcomingRoute from './routes/tournamentsUpcomingRoute.js';
import oAuthRoute from './routes/oauthRoute.js';
import callbackRoute from './routes/callbackRoute.js';
import checkSession from './routes/checkSession.js';
import profileGetRoute from './routes/profileGetRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((cors));

app.use(express.json());
app.use(sessionMiddleware);

// typical API routes 
app.use('/api', tournamentsUserRoute);
app.use('/api', tournamentsStationsRoute);
app.use('/api', tournamentsUpcomingRoute);


// OAuth routes
app.use('/', oAuthRoute);
app.use('/auth', callbackRoute);

// Routes for login/profile
app.use('/api', checkSession);
app.use('/api', profileGetRoute);

// Route for dashboard
app.use('/api', dashboardRoute);


// Serve the front-end
app.use(express.static(path.join(__dirname, '../front/dist')));

// Serve the front-end for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/dist', 'index.html'));
});
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Welcome ! Server running on port ${PORT} !`);
  });
}

export default app;

