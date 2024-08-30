import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // secure cookies in production only
    maxAge: 1000 * 60 * 60 * 24, // 1 day cookie expiration, can be adjusted
    httpOnly: true, // helps prevent XSS
    sameSite: 'lax', // helps mitigate CSRF attacks
  },
});


export default sessionMiddleware;
