import session from 'express-session';

const sessionMiddleware = session({
  secret: 'fightnights93', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
});

export default sessionMiddleware;
