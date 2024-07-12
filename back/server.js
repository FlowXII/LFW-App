import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();

// Unused for now
// import protectedRoute from './routes/protectedRoute';

import tournamentsUserRoutes from './routes/tournamentsUserRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// app.use(tokenRoutes);

app.use('/api', tournamentsUserRoutes);

// Other imports and code remain unchanged

// Comment out or remove the app.listen part when running tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for testing
export default app;
