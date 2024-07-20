import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

console.log('Environment Variables:', process.env); // Add this line

import tournamentsUserRoute from './routes/tournamentsUserRoute.js';
import tournamentsStationsRoute from './routes/tournamentsStationsRoute.js';
import tournamentsUpcomingRoute from './routes/tournamentsUpcomingRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/api', tournamentsUserRoute);
app.use('/api', tournamentsStationsRoute);
app.use('/api', tournamentsUpcomingRoute);

app.use(express.static(path.join(__dirname, '../front/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;

