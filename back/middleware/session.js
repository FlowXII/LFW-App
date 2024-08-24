import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
});

export default sessionMiddleware;
